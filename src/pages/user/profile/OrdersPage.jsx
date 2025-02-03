import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Truck,
  Package,
  ChevronRight,
  CreditCard,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { SidebarProfile } from "@/components/user/layouts/SidebarProfile";
import {
  useMyOrdersQuery,
  useRetryOrderMutation,
  useRetryRazorpayPaymentMutation,
} from "@/services/api/user/userApi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OrdersPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMyOrdersQuery();
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState();
  const [retryOrder] = useRetryOrderMutation();
  const [retryRazorpayPayment] = useRetryRazorpayPaymentMutation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isWalletDisabled = selectedOrder?.payableAmount > walletBalance;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      case "Shipped":
        return "blue";
      default:
        return "gray";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Failed":
        return "red";
      case "Pending":
        return "orange";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    if (data?.orders) {
      setOrders(data?.orders);
      setWalletBalance(data?.walletBalance);
    }
  }, [data?.orders, data?.walletBalance]);

  const handleRetryPayment = async (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  const handlePaymentSubmit = async () => {
    try {
      const result = await retryOrder({
        paymentMethod,
        orderId: selectedOrder.orderId,
      });
      console.log(result);
      setModalOpen(false);
      if (paymentMethod == "wallet") {
        navigate("/order-success-page");
      }
      if (paymentMethod == "razorpay") {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: result.data.amount,
          currency: "INR",
          name: "Dune Audio",
          description: "Product Price",
          order_id: result.data.id,
          handler: async function (response) {
            try {
              await retryRazorpayPayment({
                orderId: selectedOrder.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                paymentStatus: "success",
              }).unwrap();
              navigate("/order-success-page");
            } catch (error) {
              navigate("/payment-failed-page");
              console.error("Payment success handling failed:", error);
            }
          },
          theme: {
            color: "#3399cc",
          },
          prefill: {
            // name: selectedAddress?.fullName,
            // email: "customer@example.com",
            // contact: selectedAddress?.phone,
          },
          retry: {
            enabled: false,
          },
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.open();

        paymentObject.on("payment.failed", async function () {
          try {
            await retryRazorpayPayment({
              razorpayPaymentId: null,
              razorpayOrderId: result.id,
              razorpaySignature: null,
              paymentStatus: "failed",
            }).unwrap();
          } catch (error) {
            navigate("/payment-failed-page");
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div>
      <NavbarUser />
      <SecondNavbarUser />
      <div className="max-w-5xl mx-auto flex mt-8 px-4 space-x-6">
        <SidebarProfile heading="My Orders" />

        {orders?.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              No Orders Found
            </h1>
            <p className="text-gray-600 mb-6">
              You have not placed any orders yet. Start exploring our products
              now!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex-1">
            {orders?.map((order) => (
              <Card
                key={order?.orderId}
                className={`w-full mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  order?.paymentStatus === "Failed"
                    ? "border-2 border-red-500"
                    : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-l font-bold">
                        Order #{order.orderId}
                      </CardTitle>
                      <div className="flex space-x-2 mt-2">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(order?.orderStatus),
                            fontWeight: "bold",
                          }}
                        >
                          {order?.orderStatus?.charAt(0)?.toUpperCase() +
                            order?.orderStatus?.slice(1)}
                        </Badge>
                        <Badge
                          style={{
                            backgroundColor: getPaymentStatusColor(
                              order?.paymentStatus
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {order?.paymentStatus?.charAt(0)?.toUpperCase() +
                            order?.paymentStatus?.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-black font-mono">
                          {order?.orderAt
                            ? format(
                                new Date(order.orderAt),
                                "EEE, MMM dd, yyyy, h:mm a"
                              )
                            : "Invalid date"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Payment Method:{" "}
                        {order.paymentMethod?.charAt(0)?.toUpperCase() +
                          order.paymentMethod?.slice(1)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.variant?.images?.[0] ? (
                              <img
                                src={product.variant.images[0]}
                                alt={product.productName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-base">
                              {product.productName}
                            </p>
                            {product.variant?.color && (
                              <p className="text-sm text-muted-foreground">
                                Color: {product.variant.color}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Item Status: {product.itemStatus}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {product.quantity} x ₹{product.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ₹{(product.quantity * product.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount:</span>
                    <div>₹{order?.payableAmount.toFixed(2)}</div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-4 space-x-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                  <Button
                    disabled={order?.paymentStatus == "Failed"}
                    onClick={() => navigate(`/order-details/${order.orderId}`)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  {order?.paymentStatus === "Failed" && (
                    <Button
                      onClick={() => handleRetryPayment(order)}
                      variant="secondary"
                      size="sm"
                      className="text-red-500 flex-1"
                    >
                      <CreditCard className=" w-4 h-4 mr-2" />
                      Retry Payment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Select Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                <Card className={isWalletDisabled ? "opacity-50" : ""}>
                  <CardContent className="flex items-center p-4">
                    <RadioGroupItem
                      value="wallet"
                      id="wallet"
                      className="mr-4"
                      disabled={isWalletDisabled}
                    />
                    <Label
                      htmlFor="wallet"
                      className={`flex items-center flex-1 ${
                        isWalletDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <Wallet className="mr-3 h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Pay from Wallet</p>
                        <p className="text-sm text-muted-foreground">
                          Use your account balance
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            isWalletDisabled ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          ₹{walletBalance?.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Available Balance
                        </p>
                      </div>
                    </Label>
                  </CardContent>
                </Card>
                {isWalletDisabled && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Insufficient balance. Please add funds or choose another
                      payment method.
                    </AlertDescription>
                  </Alert>
                )}
                <Card>
                  <CardContent className="flex items-center p-4">
                    <RadioGroupItem
                      value="razorpay"
                      id="razorpay"
                      className="mr-4"
                    />
                    <Label
                      htmlFor="razorpay"
                      className="flex items-center cursor-pointer"
                    >
                      <CreditCard className="mr-3 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Pay with Razorpay</p>
                        <p className="text-sm text-muted-foreground">
                          Debit/Credit Card, UPI, Netbanking
                        </p>
                      </div>
                    </Label>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              onClick={handlePaymentSubmit}
              className="w-full"
              disabled={!paymentMethod}
            >
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FooterUser />
    </div>
  );
}
