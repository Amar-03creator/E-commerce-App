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
  const getCartItems = useSelector((state) => state.shoppingCart.cartItems?.items || []);



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

  function handleAddToCart(productId, totalStock) {

    const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === productId);

    if (indexOfCurrentItem > -1) {
      const currentQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (currentQuantity + 1 > totalStock) {
        toast.error(`Only ${currentQuantity} items were available. You cannot add more items to cart.`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
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
    if (featureImageList && featureImageList.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
      }, 4000); 

      return () => clearInterval(interval);
    }
  }, [featureImageList]);



  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);


  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length);
  };

  return <div className="flex flex-col bg-gray-50">
    {/* --- UPDATE: Container for Carousel --- */}
    {/* This container has a black background and top padding to create the "gap" */}
    <div className="pt-4">
      <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden">
        <div
          className="flex transition-transform ease-out duration-700 h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {
            featureImageList && featureImageList.length > 0
              ? featureImageList.map((slide, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <img
                    src={slide?.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )) : <div className="w-full h-full flex-shrink-0 bg-gray-200"></div>
          }
        </div>

        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant='ghost'
            size="icon"
            onClick={prevSlide}
            className='rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors'
          >
            <ChevronLeftIcon className='w-6 h-6' />
          </Button>
          <Button
            variant='ghost'
            size="icon"
            onClick={nextSlide}
            className='rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors'
          >
            <ChevronRightIcon className='w-6 h-6' />
          </Button>
        </div>

        <div className="absolute bottom-4 right-0 left-0">
          <div className="flex items-center justify-center gap-2">
            {featureImageList.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all w-3 h-3 bg-white rounded-full cursor-pointer ${currentSlide === i ? "p-2" : "bg-opacity-50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>


    {/* The rest of your page content remains the same */}
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Shop by Category</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {
            categoriesWithIcon.map((categoryItem) => (
              <Card onClick={() => handleNavigateToListingPage(categoryItem, 'category')} className={'flex flex-col items-center p-2 bg-white hover:shadow-xl hover:cursor-pointer transition-all duration-300 hover:scale-105'} key={categoryItem.id}>
                <CardContent className={'flex flex-col items-center justify-center p-6'}>
                  <categoryItem.icon className='w-12 h-12 text-gray-700 mb-2' />
                  <h3 className='text-lg font-semibold'>{categoryItem.label}</h3>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>

    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Shop by Brand</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {
            brandsWithIcon.map((brandItem) => (
              <Card onClick={() => handleNavigateToListingPage(brandItem, 'brand')} className={'flex flex-col items-center p-2 bg-white hover:shadow-xl hover:cursor-pointer transition-all duration-300 hover:scale-105'} key={brandItem.id}>
                <CardContent className={'flex flex-col items-center justify-center p-6 py-8'}>
                  <img src={brandItem.icon} alt={brandItem.label} className='w-12 h-12 mb-2 object-contain' loading='lazy' />
                  <h3 className='text-lg font-mono'>{brandItem.label}</h3>
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
              key={product._id}
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
