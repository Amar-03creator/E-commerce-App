// src/Pages/shopping-view/paypal-return.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";       // ← Lucide loader icon
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export default function PaypalReturnPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paymentId = params.get("token");
  const payerId   = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = sessionStorage.getItem("currentOrderId");
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <CardTitle>Processing Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Hang tight! We’re confirming your PayPal payment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
