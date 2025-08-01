import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shoppingCart);
const {productList} = useSelector((state) => state.shoppingProduct);


  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length > 0) {
        const indexOfCurrentCartItem = getCartItems.findIndex(items => items.productId === getCartItem.productId);
        const getCurrentProductIndex = productList.findIndex(product=> product._id === getCartItem.productId);
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast.error(`Only ${getQuantity} items were available. You cannot add more items to cart.`);
            return;
          }
        }
      }
    }
    dispatch(updateCartItemQty({
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity:
        typeOfAction === "plus"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
    })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item quantity updated successfully");
      } else {
        toast.error("Failed to update cart item quantity");
      }
    });
  }


  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item removed from cart successfully");
      } else {
        toast.error("Failed to remove item from cart");
      }
    });
  }




  return <div className="flex items-center space-x-4">
    <img src={cartItem.image} alt={cartItem.title} className="h-16 w-16 rounded-md object-cover" />
    <div className="flex-1">
      <h3 className="font-bold">{cartItem.title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Button
          variant={"outline"}
          size="icon"
          className={"bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"}
          onClick={() => handleUpdateQuantity(cartItem, "minus")}
          disabled={cartItem?.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <span className="text-sm font-semibold">{cartItem?.quantity}</span>
        <Button
          variant={"outline"}
          size="icon"
          className={"bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"}
          onClick={() => handleUpdateQuantity(cartItem, "plus")}
          disabled={cartItem.quantity >= cartItem?.totalStock}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-sm font-semibold">${
        cartItem?.salePrice > 0 ? cartItem?.salePrice * cartItem?.quantity : cartItem?.price * cartItem?.quantity
      }</span>
      <Trash onClick={() => handleCartItemDelete(cartItem)} className="h-4 w-4 text-red-500 hover:cursor-pointer hover:text-red-700" />
    </div>
  </div>
}

export default UserCartItemsContent;