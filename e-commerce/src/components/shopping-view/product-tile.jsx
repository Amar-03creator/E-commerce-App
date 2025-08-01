import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart }) {
  return (
    <Card className="pt-0 w-full max-w-sm mx-auto hover:shadow-2xl duration-300 transition-transform  hover:scale-102">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-2xl"
            loading="lazy"
          />

          {/* stock badge in top-left */}
          {product?.totalStock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          )}
          {product?.totalStock > 0 && product?.totalStock < 20 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product.totalStock} items left`}
            </Badge>
          )}

          {/* sale badge in bottom-right */}
          {product?.salePrice > 0 && product?.totalStock > 0 && (
            <Badge className="absolute bottom-2 right-2 bg-yellow-500 hover:bg-yellow-600">
              Sale
            </Badge>
          )}
        </div>

        <CardContent className={"p-4"}>
          <h2 className="text-lg font-bold mb-2">{product?.title}</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-[16px]">{categoryOptionsMap[product?.category]}</span>
            <span className="text-gray-700 text-[16px]">{brandOptionsMap[product?.brand]}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-lg font-semibold ${product?.salePrice > 0
              ? 'line-through text-gray-500'
              : 'text-primary'
              }`}>${product?.price}</span>
            {
              product?.salePrice > 0 ? (
                <span className="text-lg font-semibold text-green-500">${product?.salePrice}</span>
              ) : null
            }
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {
          product?.totalStock === 0 ? <Button className="w-full bg-primary hover:bg-primary/80 hover:cursor-pointer font-semibold text-sm opacity-50 cursor-not-allowed">
            Out of Stock
          </Button> : <Button onClick={() => handleAddToCart(product?._id, product?.totalStock)} className="w-full bg-primary hover:bg-primary/80 hover:cursor-pointer font-semibold text-sm">
            Add to Cart
          </Button>
        }
      </CardFooter>
    </Card>
  );

}

export default ShoppingProductTile;