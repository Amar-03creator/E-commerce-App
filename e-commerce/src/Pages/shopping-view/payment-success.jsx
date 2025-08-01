
// src/Pages/shopping-view/payment-success.jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-2 text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Thank you for your purchase. Your order is now confirmed and on its way!
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate("/shop/home")} 
            className="w-full cursor-pointer"
          >
            Back to Shop
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
