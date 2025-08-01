
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRating from "../common/star-ratings";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState('');
  const [rating, setRating] = useState(0)
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(rating) {
    setRating(rating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length > 0) {
      const indexOfCurrentItem = getCartItems.findIndex(items => items.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} items were available. You cannot add more items to cart.`);
          return;
        }
      }
    }
    dispatch(addToCart({
      productId: getCurrentProductId,
      quantity: 1,
      userId: user?.id,
    })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart successfully");
      } else {
        toast.error("Failed to add product to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  function handleAddReview() {
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating
    })).then(data => {
      if (data.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id))
        toast.success("Review Added");
      }

    })
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails._id))
  }, [productDetails, dispatch])

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
      : 0;
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square object-cover w-full rounded-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
            loading="lazy"
          />
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-3">{productDetails?.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>${productDetails?.price}</p>
            {
              productDetails?.salePrice > 0 ? (
                <p className="text-3xl font-semibold text-green-500">${productDetails?.salePrice}</p>
              ) : null
            }

          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              <StarRating rating={averageReview} />
            </div>
            <span className="text-sm text-muted-foreground">
              {averageReview.toFixed(2)}
            </span>
          </div>
          <div className="mt-5 mb-5">
            {
              productDetails?.totalStock === 0 ? <Button

                className={"w-full bg-primary hover:bg-primary/80 hover:cursor-pointer text-white font-semibold text-lg py-3 rounded-lg opacity-50 cursor-not-allowed"}>
                Out of Stock
              </Button> :
                <Button
                  onClick={() => {
                    handleAddToCart(productDetails?._id, productDetails?.totalStock);
                  }}
                  className={"w-full bg-primary hover:bg-primary/80 hover:cursor-pointer text-white font-semibold text-lg py-3 rounded-lg"}>
                  Add to cart
                </Button>
            }

          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews
            </h2>
            <div className="grid gap-6">
              {
                reviews && reviews.length > 0 ? reviews.map(review => <div className="flex items-center gap-4">
                  <Avatar className={"w-10 h-10 border"}>
                    <AvatarFallback className="w-10 h-10 border">
                      {review?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{review?.userName}</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <StarRating rating={review?.reviewValue} />
                    </div>
                    <p className="text-muted-foreground">{review.reviewMessage}</p>
                  </div>
                </div>) : <h2>No reviews</h2>
              }


            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex justify-between">
                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                name='reviewMsg'
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review" />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''} className="bg-primary hover:bg-primary/80 hover:cursor-pointer text-white font-semibold text-lg py-2 px-4 rounded-lg">
                Submit
              </Button>
            </div>


          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;