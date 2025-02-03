import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import {
  useOrderByIdQuery,
  useCancelOrderMutation,
  useCancelItemMutation,
  useReturnItemMutation,
} from "@/services/api/user/userApi";
import { useParams } from "react-router-dom";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { ConfirmationModal } from "@/components/user/modals/ConfirmationModal";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { data, isLoading } = useOrderByIdQuery(orderId);
  const [cancelOrder] = useCancelOrderMutation();
  const [cancelItem] = useCancelItemMutation();
  const [returnItem] = useReturnItemMutation();
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [order, setOrder] = useState({});
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [cancelItemModal, setCancelItemModal] = useState(false);
  const [currentCancelItem, setCurrentCancelItem] = useState(null);
  const [returnItemModal, setReturnItemModal] = useState(false);
  const [currentReturnItem, setCurrentReturnItem] = useState(null);
  const [returnFieldOpenId, setReturnFieldOpenId] = useState(null);

  useEffect(() => {
    if (data?.order) {
      setOrder(data?.order);
    }
  }, [data?.order]);

  const toggleProductsExpanded = () => {
    setIsProductsExpanded(!isProductsExpanded);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Dune Audio", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(16);
    doc.text("Invoice", pageWidth / 2, yPos, { align: "center" });
    yPos += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.orderId}`, 20, yPos);
    yPos += 10;
    doc.text(
      `Order Date: ${format(new Date(order.orderAt), "PPpp")}`,
      20,
      yPos
    );
    yPos += 10;
    doc.text(`Status: ${order.orderStatus}`, 20, yPos);
    yPos += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${order.address.fullName}`, 20, yPos);
    yPos += 10;
    doc.text(`Email: ${order.address.email}`, 20, yPos);
    yPos += 10;
    doc.text(`Phone: ${order.address.phone}`, 20, yPos);
    yPos += 10;
    doc.text(
      `Address: ${order.address.landMark}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`,
      20,
      yPos
    );
    yPos += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Products", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text("Product", 20, yPos);
    doc.text("Quantity", 100, yPos);
    doc.text("Price", 140, yPos);
    doc.text("Total", 180, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    order.products.forEach((product) => {
      doc.text(product.productName, 20, yPos);
      doc.text(product.quantity.toString(), 100, yPos);
      doc.text(`₹${product.price.toFixed(2)}`, 140, yPos);
      doc.text(`₹${(product.price * product.quantity).toFixed(2)}`, 180, yPos);
      yPos += 10;
    });

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${order.payableAmount.toFixed(2)}`, 140, yPos);

    doc.save(`Dune_Audio_Invoice_${order.orderId}.pdf`);
  };

  const downloadAsExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Dune Audio"],
      ["Invoice"],
      [],
      ["Order Details"],
      ["Order ID", order.orderId],
      ["Order Date", format(new Date(order.orderAt), "PPpp")],
      ["Status", order.orderStatus],
      [],
      ["Customer Details"],
      ["Name", order.address.fullName],
      ["Email", order.address.email],
      ["Phone", order.address.phone],
      [
        "Address",
        `${order.address.landMark}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`,
      ],
      [],
      ["Products"],
      ["Product", "Quantity", "Price", "Total"],
      ...order.products.map((product) => [
        product.productName,
        product.quantity,
        `₹${product.price.toFixed(2)}`,
        `₹${(product.price * product.quantity).toFixed(2)}`,
      ]),
      [],
      ["Total Amount", `₹${order.payableAmount.toFixed(2)}`],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");
    XLSX.writeFile(wb, `Dune_Audio_Invoice_${order.orderId}.xlsx`);
  };

  const cancelConfirm = async () => {
    try {
      await cancelOrder(order?.orderId).unwrap();
      setCancelOrderModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelItem = (product) => {
    setCurrentCancelItem(product);
    setCancelItemModal(true);
  };

  const cancelItemConfirm = async () => {
    try {
      await cancelItem({
        orderId: order.orderId,
        itemId: currentCancelItem.itemId,
      }).unwrap();
      setCancelItemModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      returnReason: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.returnReason) {
        errors.returnReason = "This field is required";
      } else if (values.returnReason.length < 10) {
        errors.returnReason = "Must be at least 10 characters";
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      setReturnItemModal(true);
    },
  });

  const handleReturnConfirm = async () => {
    try {
      await returnItem({
        orderId: order.orderId,
        itemId: currentReturnItem.itemId,
        returnReason: formik.values.returnReason,
      }).unwrap();
      setReturnItemModal(false);
      setReturnFieldOpenId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "return requested":
        return "bg-orange-200 text-orange-800";
      case "returned":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <SecondNavbarUser />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
            <div className="flex space-x-2">
              <Button
                disabled={
                  order?.orderStatus == "Cancelled" ||
                  order?.orderStatus == "Delivered" ||
                  order?.products?.some(
                    (product) =>
                      product?.itemStatus == "Delivered" ||
                      product?.itemStatus == "Returned" ||
                      product?.itemStatus == "Return Requested"
                  )
                }
                onClick={() => setCancelOrderModal(true)}
                variant="destructive"
                size="sm"
              >
                {order?.orderStatus == "Cancelled"
                  ? "Order Cancelled !"
                  : "Cancel Order"}
              </Button>
              <Button
                onClick={downloadAsPDF}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button
                onClick={downloadAsExcel}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                <p className="mt-1 text-sm text-gray-900">{order?.orderId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Order Date
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {order?.orderAt
                    ? format(new Date(order.orderAt), "PPpp")
                    : "Invalid date"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Payment Method
                </h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {order?.paymentMethod}
                </p>
              </div>
              <div className="flex space-x-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Amount
                  </h3>
                  <p className="mt-1 text-sm font-medium text-green-600">
                    ₹{order?.payableAmount?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Discount
                  </h3>
                  <p className="mt-1 text-sm font-medium text-green-600">
                    ₹{order?.totalDiscount?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Order Status
              </h3>
              <Badge
                variant="outline"
                className={getStatusColor(order?.orderStatus)}
              >
                {order?.orderStatus}
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Delivery Address
              </h3>
              <address className="not-italic">
                <p className="text-sm text-gray-900">
                  {order?.address?.fullName}
                </p>
                <p className="text-sm text-gray-600">{order?.address?.email}</p>
                <p className="text-sm text-gray-600">{order?.address?.phone}</p>
                <p className="text-sm text-gray-600">
                  {order?.address?.landMark}
                </p>
                <p className="text-sm text-gray-600">
                  {order?.address?.city}, {order?.address?.state}{" "}
                  {order?.address?.pincode}
                </p>
                <p className="text-sm text-gray-600">
                  {order?.address?.country}
                </p>
              </address>
            </div>

            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleProductsExpanded}
              >
                <h3 className="text-lg font-medium text-gray-900">Products</h3>
                {isProductsExpanded ? (
                  <ChevronUp className="text-gray-500 h-5 w-5" />
                ) : (
                  <ChevronDown className="text-gray-500 h-5 w-5" />
                )}
              </div>
              {isProductsExpanded && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Item Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order?.products?.map((product) => (
                      <TableRow key={product?.productId}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-contain"
                                src={product?.variant?.images[0]}
                                alt={product?.productName}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {product?.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Color: {product?.variant?.color}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="ml-3">{product?.quantity}</div>
                        </TableCell>
                        <TableCell>₹{product?.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(product?.itemStatus)}
                          >
                            {product?.itemStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {(product?.itemStatus == "Delivered" ||
                              product?.itemStatus == "Return Requested") && (
                              <Button
                                variant="ghost"
                                disabled={
                                  product?.itemStatus == "Return Requested"
                                }
                                size="sm"
                                className="text-orange-500 hover:text-red-900"
                                onClick={() => {
                                  setCurrentReturnItem(product);
                                  setReturnFieldOpenId(product?.itemId);
                                }}
                              >
                                Return Item
                              </Button>
                            )}

                            {product?.itemStatus !== "Delivered" &&
                              product?.itemStatus !== "Return Requested" &&
                              product?.itemStatus !== "Returned" && (
                                <Button
                                  onClick={() => handleCancelItem(product)}
                                  disabled={product?.itemStatus == "Cancelled"}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel Item
                                </Button>
                              )}
                            {returnFieldOpenId == product?.itemId && (
                              <form
                                className="flex gap-3 items-center"
                                onSubmit={formik.handleSubmit}
                              >
                                <div>
                                  <Input
                                    type="text"
                                    name="returnReason"
                                    placeholder="Enter Return Reason"
                                    value={formik.values.returnReason}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-input"
                                  />
                                  {formik.touched.returnReason &&
                                    formik.errors.returnReason && (
                                      <div className="text-red-500">
                                        {formik.errors.returnReason}
                                      </div>
                                    )}
                                </div>
                                <Button className="w-13 h-7" type="submit">
                                  Submit
                                </Button>
                              </form>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Order Summary
              </h3>
              <div className="bg-gray-100 p-4 rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ₹{order?.payableAmount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Total:</span>
                  <span>₹{order?.payableAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <FooterUser />
      <ConfirmationModal
        isOpen={cancelOrderModal}
        onClose={() => setCancelOrderModal(false)}
        onConfirm={cancelConfirm}
        title="Are you sure"
        message="Once you cancel the order, It will be remove from your orders"
        confirmText="Confirm Cancel"
        cancelText="Keep Order"
      />
      <ConfirmationModal
        isOpen={cancelItemModal}
        onClose={() => setCancelItemModal(false)}
        onConfirm={cancelItemConfirm}
        title="Are You Sure"
        message="Once you cancel this item it will remove from you orders !. If you have any other products that will be delivered"
        confirmText="Confirm Cancel"
        cancelText="Keep Item"
      />
      <ConfirmationModal
        isOpen={returnItemModal}
        onClose={() => setReturnItemModal(false)}
        onConfirm={handleReturnConfirm}
        title="Are You Sure"
        message="if you return the item it will pick up by 2 to 3 days"
        confirmText="Confirm Return"
        cancelText="cancel"
      />
    </div>
  );
};
