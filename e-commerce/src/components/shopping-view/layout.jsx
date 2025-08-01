import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    // This parent div now has a defined height and hides its own overflow
    <div className="flex flex-col h-screen bg-white">
      <ShoppingHeader />
      
      {/* By adding overflow-y-auto, this main element becomes the scrollable container */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;