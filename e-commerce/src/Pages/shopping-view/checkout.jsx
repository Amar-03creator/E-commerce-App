// src/Pages/shopping-view/checkout.jsx
import Address from "@/components/shopping-view/address";
import image from "../../assets/shopping-account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Loader2 } from "lucide-react";

export default function ShoppingCheckout() {
  const { cartItems }  = useSelector((s) => s.shoppingCart);
  const { user }       = useSelector((s) => s.auth);
  const { approvalURL } = useSelector((s) => s.shopOrder);
  const dispatch       = useDispatch();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    // 1) client-side guards
    if (!cartItems?.items?.length) {
      return toast("Your cart is empty. Please add items to proceed.", { icon: "❌" });
    }
    if (!currentSelectedAddress) {
      return toast("Please select one address to proceed.", { icon: "❌" });
    }

    // 2) immediately show the overlay
    setIsPaymentStart(true);

    // 3) build payload and dispatch
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((ci) => ({
        productId: ci.productId,
        title: ci.title,
        image: ci.image,
        price: ci.salePrice > 0 ? ci.salePrice : ci.price,
        quantity: ci.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        name: currentSelectedAddress.name,
        street: currentSelectedAddress.street,
        city: currentSelectedAddress.city,
        state: currentSelectedAddress.state,
        zip: currentSelectedAddress.zip,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((res) => {
      if (res.payload?.success) {
        sessionStorage.setItem("currentOrderId", res.payload.orderId);
        // the approvalURL watcher below will redirect
      } else {
        // if the API fails, hide the overlay again
        setIsPaymentStart(false);
      }
    });
  }

  // redirect when PayPal link comes back
  if (approvalURL) window.location.href = approvalURL;

  return (
    <div className="relative flex flex-col">
      {/* Main content, blurred when payment starts */}
      <div className={`${isPaymentStart ? "filter blur-sm" : ""}`}>
        <div className="relative h-[300px] w-full overflow-hidden">
          <img src={image} className="h-full w-full object-cover object-center" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
          <div className="flex flex-col gap-4">
            {cartItems?.items?.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
            <div className="mt-8 flex justify-between font-bold">
              <span>Total</span>
              <span>${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="mt-4">
              <Button onClick={handleInitiatePaypalPayment} className="w-full cursor-pointer">
                Checkout with PayPal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate overlay + loader */}
      {isPaymentStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Redirecting to PayPal…</h2>
            <p className="text-gray-600 text-center">
              Please wait while we set up your payment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
