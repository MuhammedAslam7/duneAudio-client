import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Wallet, Truck, CreditCard, Copy, Ticket } from "lucide-react";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationModal } from "@/components/user/modals/ConfirmationModal";
import { useState, useEffect } from "react";
import { useGetPaymentPageQuery } from "@/services/api/user/userApi";
import {
  useAddOrderMutation,
  useRazorpayPaymentMutation,
  useLazyVerifyStockQuery,
} from "@/services/api/user/userApi";
import Breadcrumbs from "@/components/user/layouts/Breadcrumbs";
import { useToaster } from "@/utils/Toaster";

export function PaymentPage() {
  const toast = useToaster();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetPaymentPageQuery();

  let { totalPrice } = data?.cart || {};
  const minAmount = data?.minAmount;
  const walletBalance = data?.walletBalance || 0;
  const availableCoupons = data?.coupon || [];

  let { selectedAddress } = location?.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [addOrder] = useAddOrderMutation();
  const [paymentMethod, setPaymentMethod] = useState(totalPrice < 1000 ? "cash on delivery" : "razorpay");
  const [razorpayPayment] = useRazorpayPaymentMutation();
  const [verifyStock, { data: result, isLoading: isProceeding }] =
    useLazyVerifyStockQuery();
  const [totalDiscount, setTotalDiscount] = useState(
    data?.cart?.totalDiscount || 0
  );
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    if (data?.cart && !data?.isFresh) {
      refetch();
    }
    if (data?.cart?.totalDiscount !== undefined) {
      setTotalDiscount(data.cart.totalDiscount);
    }
  }, [data?.cart]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCouponCode(code);
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.couponCode === couponCode);
    if (!coupon) {
      toast("Error", "Invalid coupon code!", "#ef4444");
      return;
    }

    if (totalPrice < coupon.minPurchaseAmount) {
      toast(
        "Error",
        `Minimum purchase amount should be ₹${coupon.minPurchaseAmount}`,
        "#ef4444"
      );
      return;
    }

    const couponLimit = totalPrice * 0.5;

    if (coupon.discountAmount > couponLimit) {
      return toast(
        "Error",
        "The coupon amount is very high. Can't apply",
        "#ef4444"
      );
    }

    if (couponApplied) {
      toast("Error", "Coupon already applied!", "#ef4444");
      return;
    }

    setTotalDiscount((prev) => prev + coupon.discountAmount);
    setSelectedCoupon(coupon);
    setCouponApplied(true);
    toast("Success", "Coupon applied successfully!", "#22c55e");
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setCouponApplied(false);
    setTotalDiscount((prev) => prev - selectedCoupon.discountAmount);
  };

  const handleSubmit = async () => {
    try {
      const response = await verifyStock().unwrap();
      const outOfStock = response.find((res) => res.stock < 0);

      if (outOfStock) {
        toast(
          "Out of Stock",
          `${outOfStock.productName} is out of ${Math.abs(
            outOfStock.stock
          )} stock...Go to cart page and update the quantity please...`,
          "#f97316"
        );
        return;
      }

      if (paymentMethod === "pay from wallet") {
        const havebalance = walletBalance - (totalPrice - totalDiscount);
        if (havebalance < 0) {
          return toast(
            "No-balance",
            "Don't have enough balance in your wallet",
            "#f97316"
          );
        }
      }

      setModalOpen(true);
    } catch (error) {
      console.log(error);
      toast("Error", "Something went wrong!", "#ef4444");
    }
  };

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
  };

  const confirmSubmit = async () => {
    try {
      const result = await addOrder({
        addressId: selectedAddress._id,
        paymentMethod,
        totalPrice,
        totalDiscount,
        couponUsed: couponApplied,
        couponCode: selectedCoupon?.couponCode,
      }).unwrap();

      setModalOpen(false);

      if (
        paymentMethod === "cash on delivery" ||
        paymentMethod === "pay from wallet"
      ) {
        navigate("/order-success-page");
      }else if (paymentMethod === "razorpay") {
        const options = { 
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: result.amount,
          currency: "INR",
          name: "Dune Audio",
          description: "Product Price",
          order_id: result.id,
          handler: async function (response) {
            try {
              await razorpayPayment({ 
                totalPrice,
                totalDiscount,
                couponUsed: couponApplied,
                couponCode: selectedCoupon?.couponCode,
                addressId: selectedAddress._id,
                paymentMethod: "razorpay",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                paymentStatus: "success",
              }).unwrap();
              navigate("/order-success-page");
            } catch (error) {
              console.error("Payment success handling failed:", error);
              navigate("/payment-failure");
            }
          },
          theme: {
            color: "#3399cc",
          },
          prefill: {
            name: selectedAddress?.fullName,
            email: "customer@example.com",
            contact: selectedAddress?.phone,
          },
          retry: {
            enabled: false,
          },
        };
      
        const paymentObject = new window.Razorpay(options);
      
        paymentObject.open();
      
        paymentObject.on("payment.failed", async function () {
          try {
            await razorpayPayment({
              totalPrice,
              totalDiscount,
              couponUsed: couponApplied,
              couponCode: selectedCoupon?.couponCode,
              addressId: selectedAddress._id,
              paymentMethod: "razorpay",
              razorpayPaymentId: null,
              razorpayOrderId: result.id,
              razorpaySignature: null,
              paymentStatus: "failed",
            }).unwrap();
            navigate("/payment-failed-page");
          } catch (error) {
            console.error("Failed to handle payment failure:", error);
          }
        });
      }
      
    } catch (error) {
      console.log(error);
      toast("Error", "Order placement failed!", "#ef4444");
    }
  };

  return (
    <div className="container mx-auto">
      <NavbarUser />
      <SecondNavbarUser />
      <div className="mt-8 ml-[160px]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <Breadcrumbs currentPage="Payment" />
      </div>
      <div className="container mx-auto p-6 grid md:grid-cols-[750px_1fr] gap-8 max-w-7xl">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Payment Options
            <div className="h-0.5 w-32 bg-blue-500 mt-1" />
          </h2>

          <RadioGroup
            value={paymentMethod}
            onValueChange={handlePaymentMethod}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4 border p-4 rounded-lg">
              <RadioGroupItem
                disabled={totalPrice > 1000}
                value="cash on delivery"
                id="cash"
              />
              <div className="space-y-3">
                <Label htmlFor="cash" className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Cash on delivery
                </Label>
                {totalPrice > 1000 && (
                  <p className="text-red-500 text-sm">
                    Not available for more than 1000/-
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 border p-4 rounded-lg">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pay with Razorpay
              </Label>
            </div>

            <div className="flex items-center justify-between border border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm transition-all duration-300">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="pay from wallet" id="wallet" />
                <Label
                  htmlFor="wallet"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <Wallet className="h-6 w-6" />
                  <span>Pay From Wallet</span>
                </Label>
              </div>

              <p className="text-gray-800 font-semibold bg-indigo-100 px-4 py-1 rounded-full">
                Wallet Balance: ₹{walletBalance}
              </p>
            </div>
          </RadioGroup>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-black text-white hover:bg-gray-800"
            disabled={totalPrice > 1000 && paymentMethod == "cash on delivery"}
          >
            Continue
          </Button>

          <div className="w-full mt-4">
            <img
              src="/logo/f68618eff45eea357bb1cd1beecfc51d 2.jpg"
              alt="Payment methods images"
              width={50}
              height={30}
              className="w-max object-contain"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Value of Products</span>
              <span className="font-medium">₹{totalPrice}</span>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Have a coupon?
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCouponModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  View Coupons
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode}
                >
                  Apply
                </Button>
                {couponApplied && (
                  <Button onClick={handleRemoveCoupon}>Remove</Button>
                )}
              </div>
              {selectedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Coupon applied: {selectedCoupon.couponCode}
                </div>
              )}
            </div>

            {couponApplied && (
              <div className="flex justify-between">
                <span className="text-gray-600">Coupon Amount (-)</span>
                <span className="text-green-500 font-medium">
                  ₹{selectedCoupon?.discountAmount}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Total Discount (-)</span>
              <span className="text-green-500 font-medium">
                ₹{totalDiscount}.00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated GST (+)</span>
              <span>₹00.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping (+)</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Order Total</span>
                <span className="text-xl">
                  ₹{totalPrice - totalDiscount} /-
                </span>
              </div>
            </div>

            <div className="mt-6 bg-black text-white p-4 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{selectedAddress?.fullName}</p>
                <p>
                  {selectedAddress?.country}, {selectedAddress?.state}
                </p>
                <p>
                  {selectedAddress?.city}, {selectedAddress?.pincode}
                </p>
                <p>No: {selectedAddress?.phone}</p>
                <p>{selectedAddress?.landMark}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Available Coupons</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {availableCoupons.map((coupon) => (
              <div key={coupon._id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      ₹{coupon.discountAmount} OFF
                    </p>
                    <p className="text-sm text-gray-600">
                      Min. Purchase: ₹{coupon.minPurchaseAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valid till:{" "}
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCode(coupon.couponCode)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                </div>
                <p className="text-xs bg-gray-100 p-2 rounded">
                  Code: {coupon.couponCode}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <FooterUser />
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmSubmit}
        title="Are you sure"
        message="If you confirm this order, You can manage the order on Your Orders"
        confirmText={
          paymentMethod === "cash on delivery"
            ? "Place Order"
            : "Place Order & Pay"
        }
        cancelText="Cancel"
      />
    </div>
  );
}
