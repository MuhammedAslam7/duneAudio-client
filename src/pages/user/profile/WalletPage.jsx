import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavbarUser } from "@/components/user/layouts/NavbarUser";
import { SecondNavbarUser } from "@/components/user/layouts/SecondNavbarUser";
import { SidebarProfile } from "@/components/user/layouts/SidebarProfile";
import { FooterUser } from "@/components/user/layouts/FooterUser";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  useGetWalletQuery, 
  useAddMoneyToWalletMutation,
  useVerifyPaymentMutation 
} from "@/services/api/user/userApi";

export const WalletPage = () => {
  const [amount, setAmount] = useState("5000");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { data, isLoading } = useGetWalletQuery();
  const [addMoney] = useAddMoneyToWalletMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  
  const { wallet } = data || {};

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async () => {
    try {
      await loadRazorpay();
      
      const response = await addMoney(Number(amount)).unwrap();
      
      const options = {
        key: response.key,
        amount: response.order.amount,
        currency: "INR",
        name: "Your Company",
        description: "Wallet Top Up",
        order_id: response.order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(amount)
            }).unwrap();``

            alert("Payment successful!");
          } catch (error) {
            console.log(error)
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error in handleAddMoney:', error);
      alert("Something went wrong!");
    }
  };

  const handleQuickAdd = (value) => {
    setAmount(String(Number(amount) + value));
  };

  return (
    <div>
      <NavbarUser />
      <SecondNavbarUser />
      <div className="max-w-5xl gap-6 flex mx-auto p-4">
        <SidebarProfile heading="Wallet" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl">
              Balance: <span className="font-medium">₹ {wallet?.balance}</span>
            </div>
            <Button
              variant="secondary"
              className="bg-black text-white hover:bg-black/90"
              onClick={() => setIsHistoryOpen(true)}
            >
              History
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Money to Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              <div className="bg-black rounded-lg p-4">
                <label className="text-white mb-2 block">Enter Amount</label>
                <div className="flex items-center">
                  <span className="text-white mr-2 text-lg">₹</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-black text-white border-none text-lg focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-black text-white border-none hover:bg-black/90"
                  onClick={() => handleQuickAdd(500)}
                >
                  + ₹500
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white border-none hover:bg-black/90"
                  onClick={() => handleQuickAdd(1000)}
                >
                  + ₹1000
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white border-none hover:bg-black/90"
                  onClick={() => handleQuickAdd(2000)}
                >
                  + ₹2000
                </Button>
              </div>

              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleAddMoney}
              >
                Add to Wallet
              </Button>
            </CardContent>
          </Card>

          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction History</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4 p-4">
                  {wallet?.transactions?.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No transactions found
                    </div>
                  ) : (
                    wallet?.transactions?.map((transaction) => (
                      <div
                        key={transaction.transactionId}
                        className="flex items-center justify-between border-b border-gray-200 pb-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {transaction.description || "Wallet Top-up"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {transaction.transactionId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(transaction.date), "PPpp")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${transaction.description =="Order Payment" ? "text-red-600" : "text-green-500"}`}>
                            ₹{transaction.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <FooterUser />
    </div>
  );
};