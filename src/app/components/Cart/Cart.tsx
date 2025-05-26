import React from "react";
import CartIcon from "../../../../public/img/cart/cart.svg";
import TrashIcon from "../../../../public/img/cart/trash.svg";
import CrossIcon from "../../../../public/img/cart/cross.svg";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { toggleCart, removeFromCart, toggleCartVisiblity } from "@/app/store/features/cart/cartSlice";
import { ICourse } from "@/app/types/course.contract";
import { BookOpen, ArrowRight, Search } from "lucide-react";
// import { useUser } from '../context/CartContext';

const Cart = () => {
  // const { items, handleRemoveItem, setCart, bill } = useUser();
  const dispatch = useAppDispatch();
  const { items, discountTotal, isCartOpen, total, isCartVisible } = useAppSelector((state) => state.cart);

  const handleRemoveItem = (courseId: string) => {
    dispatch(removeFromCart(courseId));
  };

  const handleCloseCart = () => {
    dispatch(toggleCartVisiblity());
    setTimeout(() => {
      dispatch(toggleCart());
    }, 300);
  };

  return (
    <div className="flex justify-end h-full">
      {/* Cart Panel */}
      <div className="relative w-full flex flex-col bg-white h-screen">
        {/* Header - Fixed */}
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold line-clamp-1">Your Shopping Cart</h1>
            <button
              className="hover:cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={handleCloseCart}
            >
              <Image src={CrossIcon} alt="Close Cart" width={30} height={30} />
            </button>
          </div>

          <div className="mt-2 flex justify-start items-center gap-1 text-sm md:text-md">
            <span className="text-blue-500">{`(${items.length})`}</span> Courses in Cart
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 rounded-full bg-[#FFF5E6] flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Looks like you haven't added any courses to your cart yet. Start exploring our courses and find
                  something that interests you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link
                    href="/course"
                    onClick={handleCloseCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-hover transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Browse Courses
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={handleCloseCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item: ICourse, idx: number) => {
                return (
                  <React.Fragment key={item._id}>
                    <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-[25%] relative aspect-[1.2]">
                        <Image
                          src={"/img/Course/new-course.png"}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="w-[60%] pl-4 flex flex-col justify-start gap-1.5">
                        <h2 className="text-sm md:text-[20px] font-bold line-clamp-2">{item.title}</h2>
                        <p className="text-sm md:text-base text-gray-400">
                          by: <span className="text-blue-400">{item.instructor}</span>
                        </p>
                        <p className="font-semibold text-sm md:text-[18px]">
                          ${item.isDiscounted ? item.discountPrice : item.price}.00{" "}
                          {item.isDiscounted && (
                            <span className="text-gray-400 font-normal text-sm line-through">${item.price}.00</span>
                          )}
                        </p>
                      </div>
                      <div
                        onClick={() => handleRemoveItem(item._id)}
                        className="w-[15%] flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Image src={TrashIcon} alt="Remove Item" width={20} height={20} />
                      </div>
                    </div>
                    {idx < items.length - 1 && <div className="border-t border-gray-200 my-4" />}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        {items.length > 0 && (
          <div className="flex-none p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm md:text-md">Subtotal:</h2>
              <h1 className="font-bold text-lg">${discountTotal || 0}.00</h1>
            </div>

            <div className="flex gap-4">
              <Link
                href="/viewcart"
                onClick={handleCloseCart}
                className="flex-1 p-3 rounded-full border border-gray-400 text-gray-800 text-sm md:text-md text-center hover:bg-gray-100 transition"
              >
                View Cart
              </Link>
              <Link
                href="/viewcart?checkout=true"
                onClick={handleCloseCart}
                className="text-center flex-1 p-3 rounded-full border border-primary bg-primary text-sm md:text-md text-white hover:bg-primary-hover transition"
              >
                {`Proceed to checkout →`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
