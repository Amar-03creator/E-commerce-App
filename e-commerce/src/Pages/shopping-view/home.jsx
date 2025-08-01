import { Button } from '@/components/ui/button';
import leviIcon from '../../assets/leviIcon.jpg';
import adidasIcon from '../../assets/adidasIcon.png';
import nikeIcon from '../../assets/nikeIcon.png';
import zaraIcon from '../../assets/zaraIcon.webp';
import pumaIcon from '../../assets/pumaIcon.png';
import hAndmIcon from '../../assets/hAndmIcon.svg';
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, FootprintsIcon, ShirtIcon, Venus, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';

import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getFeatureImages } from '@/store/common-slice';


const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "footwear", label: "Footwear", icon: FootprintsIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
]

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: nikeIcon },
  { id: "adidas", label: "Adidas", icon: adidasIcon },
  { id: "puma", label: "Puma", icon: pumaIcon },
  { id: "levi", label: "Levi's", icon: leviIcon },
  { id: "zara", label: "Zara", icon: zaraIcon },
  { id: "h&m", label: "H&M", icon: hAndmIcon },
];

function ShoppingHome() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shoppingProduct);
  const { user } = useSelector((state) => state.auth);
  const { featureImageList } = useSelector((state) => state.commonFeature)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filters');
    const currentFilters = {
      [section]: [getCurrentItem.id]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilters));
    navigate('/shop/listing');
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddToCart(productId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: productId,
        quantity: 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id)); // Refresh cart items after adding
        toast.success(data.payload.message || "Product added to cart successfully!");
      } else {
        toast.error(data?.payload?.message || "Failed to add product to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide) => (currentSlide + 1) % 4);
    }, 3000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);



  useEffect(() => {
    // Dispatch an action to set the current page in the store
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  console.log("Product List:", productList);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch])

  return <div className="flex flex-col min-h-screen">
    <div className="relative w-full h-[600px] overflow-hidden">
      {
        featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${currentSlide === index ? 'opacity-100' : 'opacity-0'} absolute w-full h-full object-cover transition-opacity duration-800 ease-in-out`}
            />
          )) : null
      }
      <Button variant='outline'
        onClick={() => setCurrentSlide((currentSlide - 1 + featureImageList.length) % featureImageList.length)}
        className='absolute top-1/2 left-4 z-20 bg-black/30 hover:bg-white/30 transition-colors duration-300 hover:cursor-pointer'>
        <ChevronLeftIcon className='w-4 h-4' />
      </Button>
      <Button variant='outline'
        onClick={() => setCurrentSlide((currentSlide + 1) % featureImageList.length)}
        className='absolute top-1/2 right-4 z-20 bg-black/30 hover:bg-white/30 transition-colors duration-300 hover:cursor-pointer'>
        <ChevronRightIcon className='w-4 h-4' />
      </Button>
    </div>
    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Shop by Category</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {
            categoriesWithIcon.map((categoryItem) => (
              <Card onClick={() => handleNavigateToListingPage(categoryItem, 'category')} className={'flex flex-col items-center p-2 hover:shadow-2xl hover:cursor-pointer transition-transform hover:scale-102 duration-300'} key={categoryItem.id}>
                <CardContent className={'flex flex-col items-center justify-center p-6'}>
                  <categoryItem.icon className='w-12 h-12 text-gray-700 mb-2' />
                  <h3 className='text-lg font-semibold'>{categoryItem.label}</h3>
                </CardContent>

              </Card>
            ))}
        </div>
      </div>
    </section>

    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Shop by Brand</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {
            brandsWithIcon.map((brandItem) => (
              <Card onClick={() => handleNavigateToListingPage(brandItem, 'brand')} className={'flex flex-col items-center p-2 hover:shadow-2xl hover:cursor-pointer transition-transform hover:scale-102 duration-300'} key={brandItem.id}>
                <CardContent className={'flex flex-col items-center justify-center p-6 py-8'}>
                  <img src={brandItem.icon} alt={brandItem.label} className='w-12 h-12 mb-2 object-contain' loading='lazy' />
                  <h3 className='text-lg  font-mono'>{brandItem.label}</h3>
                </CardContent>

              </Card>
            ))}
        </div>
      </div>
    </section>

    <section className='py-12 bg-white'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Featured Products</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {
            productList && productList.length > 0 ? productList.map((product) => <ShoppingProductTile
              product={product}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
              key={product.id}
            />
            ) :
              <div className='col-span-4 text-center text-gray-500'>No products available</div>
          }
        </div>
      </div>
    </section>
    <ProductDetailsDialog
      open={openDetailsDialog}
      setOpen={setOpenDetailsDialog}
      productDetails={productDetails}
    />
  </div>
}

export default ShoppingHome;