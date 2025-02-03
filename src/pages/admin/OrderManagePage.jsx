import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useUpdateItemStatusMutation,
} from "@/services/api/admin/adminApi";

export const OrderManagePage = () => {
  const { orderId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateItemStatus] = useUpdateItemStatusMutation();
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const [order, setOrder] = useState({});
  const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    if (data?.order) {
      setOrder(data.order);
    }
  }, [data?.order]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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
      return "bg-orange-200 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, newStatus }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemStatusChange = async (itemId, orderId, newStatus) => {
    try {
      await updateItemStatus({ itemId, orderId, newStatus }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold mt-4 text-foreground">
          Loading...
        </h2>
        <p className="text-muted-foreground mt-2">
          Please wait while we prepare your content.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="ORDER DETAILS "
        />
        <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Order #{order?.orderId}
              </h1>
              <div className="flex items-center gap-4">
                <Select
                  onValueChange={(value) =>
                    handleOrderStatusChange(order?.orderId, value)
                  }
                  defaultValue={order?.orderStatus}
                  disabled={["Cancelled", "Delivered"].includes(
                    order?.orderStatus
                  )}
                >
                  <SelectTrigger
                    className={`w-[180px] bg-gray-900 text-gray-300 border-gray-800 ${
                      ["Cancelled", "Delivered"].includes(order?.orderStatus)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent
                    className={`bg-gray-900 border-gray-800 ${
                      ["Cancelled", "Delivered"].includes(order?.orderStatus)
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-gray-300 focus:bg-gray-800 focus:text-white"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-400">
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={`${getStatusColor(
                      order?.orderStatus
                    )} text-sm px-3 py-1`}
                  >
                    {order?.orderStatus}
                  </Badge>
                  <p className="mt-2 text-sm text-gray-400">
                    Ordered on{" "}
                    {order?.orderAt
                      ? format(new Date(order.orderAt), "PPP")
                      : "Invalid date"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-400">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    ₹{order?.payableAmount?.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-gray-400 capitalize">
                    {order?.paymentMethod}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-400">
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium text-white">
                      {order?.address?.fullName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order?.address?.landMark}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order?.address?.city}, {order?.address?.state}{" "}
                      {order?.address?.pincode}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order?.address?.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Order Items</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-400">Product</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Price
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.products?.map((product) => (
                    <TableRow
                      key={product?.itemId}
                      className="group border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <img
                            src={product?.variant?.images[0]}
                            alt={product?.productName}
                            className="h-16 w-16 rounded-lg object-cover bg-gray-800"
                          />
                          <div>
                            <p className="font-medium text-white">
                              {product?.productName}
                            </p>
                            <p className="text-sm text-gray-400">
                              Color: {product?.variant?.color}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        ₹{product?.price?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        {product?.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getStatusColor(product?.itemStatus)}>
                          {product?.itemStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Select
                            onValueChange={(status) =>
                              handleItemStatusChange(
                                product.itemId,
                                order.orderId,
                                status
                              )
                            }
                            defaultValue={product?.itemStatus}
                            disabled={["Cancelled", "Delivered"].includes(
                              product?.itemStatus
                            )}
                          >
                            <SelectTrigger
                              className={`1w-[140px] bg-gray-900 text-gray-300 border-gray-800 ${
                                ["Cancelled", "Delivered"].includes(
                                  product?.itemStatus
                                )
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent
                              className={`bg-gray-900 border-gray-800 ${
                                ["Cancelled", "Delivered"].includes(
                                  product?.itemStatus
                                )
                                  ? "pointer-events-none"
                                  : ""
                              }`}
                            >
                              {statusOptions.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="text-gray-300 focus:bg-gray-800 focus:text-white"
                                >
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Order Summary Card remains the same */}
            <Card className="bg-gray-900 border-gray-800 max-w-md ml-auto">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{order?.payableAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Shipping</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex justify-between font-medium text-white">
                      <span>Total</span>
                      <span className="text-lg">
                        ₹{order?.payableAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
