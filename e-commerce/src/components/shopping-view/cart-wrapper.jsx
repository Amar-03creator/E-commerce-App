import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {

  const navigate = useNavigate();

  const totalCartAmount = cartItems && cartItems.length > 0 ? cartItems.reduce((total, item) => {
    const itemPrice = item.salePrice > 0 ? item.salePrice : item.price;
    return total + (itemPrice * item.quantity);
  }, 0) : 0;


  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>
          Your Cart
        </SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4 px-4">
        {
          cartItems && cartItems.length > 0 ? cartItems.map((cartItem) => <UserCartItemsContent
            key={cartItem.productId}
            cartItem={cartItem} />) : <p className="text-center text-sm text-gray-500">Your cart is empty</p>
        }
      </div>
      <div className="mt-8 space-y-4 px-4">
        {/* <UserCartItemsContent /> */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Total</span>
          <span className="font-bold text-gray-900">{totalCartAmount}</span>
        </div>
      </div>
      <div className="px-4 mt-4">
        <Button onClick={() => {
          navigate('/shop/checkout');
          setOpenCartSheet(false);
        }
        } className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer">
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;