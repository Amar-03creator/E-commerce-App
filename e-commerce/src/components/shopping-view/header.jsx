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
      item.id !== "search"
        ? { category: [item.id] }
        : null;

    sessionStorage.setItem('filters', JSON.stringify(currentFilters));

    location.pathname.includes('listing') && currentFilters !== null
      ? setSearchParams(new URLSearchParams(`?category=${item.id}`))
      : navigate(item.path);
  }

  if (!shoppingViewHeaderMenuItems || shoppingViewHeaderMenuItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
          key={item.id}
          className="cursor-pointer w-fit text-sm ml-3 font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-100/60 transition-all duration-200 px-3 py-1 rounded-md border border-transparent hover:border-indigo-400"
          onClick={() => handleNavigate(item)}
        >
          {item.icon && <span className="mr-2 align-middle">{item.icon}</span>}
          <span className="align-middle">{item.label}</span>
        </Label>
      ))}
    </nav>
  );
}
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(({ payload }) => {
      if (payload?.success) {
        toast.success(payload.message || "Logged out successfully!");
      } else {
        toast.error(payload?.message || "Logout failed");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          variant="ghost"
          onClick={() => setOpenCartSheet(true)}
          size="icon"
          className="relative hover:bg-indigo-100 text-indigo-600 transition-colors duration-200 cursor-pointer hover:border-indigo-400"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute top-[-6px] right-[-6px] bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems?.items?.length || '0'}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items?.length > 0 ? cartItems.items : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-indigo-600 hover:brightness-110 transition duration-200">
            <AvatarFallback className="bg-indigo-600 text-white font-semibold cursor-pointer text-lg">
              {user?.userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel className="text-gray-700">
            Logged in as {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}
            className="hover:bg-indigo-100 text-sm text-gray-800">
            <CircleUserRound className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-100 text-sm text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-lg border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden inline-flex items-center justify-center"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <div className="bg-blue-200 p-2 rounded-md mb-2">
              <DropdownMenuLabel>Hello, {user?.userName}</DropdownMenuLabel>
            </div>
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        <Link className="flex items-center gap-2" to="/shop/home">
          <HouseIcon className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-800">E-Commerce</span>
        </Link>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div>
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
export default ShoppingHeader;
