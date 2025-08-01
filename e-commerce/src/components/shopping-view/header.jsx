import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { CircleUserRound, HouseIcon, LogOut, Menu, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(item) {
    sessionStorage.removeItem('filters');
    const currentFilters =
      item.id !== "home" &&
      item.id !== "products" &&
      item.id !== "search" ? {
        category: [item.id]
      } : null;
    sessionStorage.setItem('filters', JSON.stringify(currentFilters));

    location.pathname.includes('listing') && currentFilters !== null ? setSearchParams(new URLSearchParams(`?category=${item.id}`)) : navigate(item.path);
  }

  if (!shoppingViewHeaderMenuItems || shoppingViewHeaderMenuItems.length === 0) {
    return null; // or return a placeholder if no items are available
  }


  return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
    {
      shoppingViewHeaderMenuItems.map((item) => <Label key={item.id} className="cursor-pointer w-fit bg-transparent text-sm ml-3 border-2 border-transparent hover:border-gray-400 hover:bg-gray-100 font-semibold rounded" onClick={() => {
        handleNavigate(item);
      }}>
        <span className="p-1">{item.label}</span>
      </Label>)
    }
  </nav>
}


function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(({ payload }) => {
      // payload is whatever your API returned, e.g. { success: true, message: 'Logged out Successfully' }
      if (payload?.success) {
        toast.success(payload.message || "Logged out successfully!");
      } else {
        toast.error(payload?.message || "Logout failed");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch]);

  console.log("cartItems", cartItems);


  return <div className="flex items-center gap-4">
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
      <Button variant={"outline"} onClick={() => setOpenCartSheet(true)} size="icon" className="relative inline-flex cursor-pointer">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute top-[-5px] right-[-3px] text-sm bg-white font">{cartItems?.items?.length || '0'}</span>
        <span className="sr-only">User Cart</span>
      </Button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
    </Sheet>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-black ">
          <AvatarFallback className="bg-black text-white font-extrabold cursor-pointer text-lg">
            {user?.userName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className={"w-56"}>
        <DropdownMenuLabel>
          Logged in as {user?.userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/shop/account")}>
          <CircleUserRound className="mr-2 h-4 w-4" />Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />Logout
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  </div>
}


function ShoppingHeader() {


  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  return <header className="sticky top-0 z-40 w-full border-b bg-background">
    <div className="flex h-16 items-center justify-between px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline"
            size="icon"
            className="lg:hidden inline-flex items-center justify-center">
            <Menu className="h-6 w-6" />
            <span className="sr-only">
              Toggle Menu
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className="w-full max-w-xs ">
          <div className="bg-blue-200 p-2">
            <DropdownMenuLabel>
              Hello, {user?.userName}
            </DropdownMenuLabel>
          </div>
          <MenuItems />
          <HeaderRightContent />
        </SheetContent>
      </Sheet>
      <Link className="flex items-center gap-2" to="/shop/home">
        <HouseIcon className="h-6 w-6" />

        <span className="font-bold">E-Commerce</span>
      </Link>

      <div className="hidden lg:block">
        <MenuItems />
      </div>
      <div >
        <HeaderRightContent />
      </div>

    </div>
  </header>
}

export default ShoppingHeader;