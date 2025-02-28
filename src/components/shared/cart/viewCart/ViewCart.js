import { useContext } from "react";
import CartItemComponent from "../CartItemComponent";
import { AuthContext } from "@/providers/AuthProvider";

export default function ViewCart() {
  const { cartItems, removeFromCart, updateCartQuantity } =
    useContext(AuthContext);
  return (
    <div
      className="border-b p-4 shadow-md rounded-md h-fit bg-white "
      style={{ scrollbarWidth: "thin" }}
    >
      {cartItems?.length > 0 &&
        cartItems?.map((item: any) => (
          <CartItemComponent
            item={item}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            key={item._id}
          />
        ))}
    </div>
  );
}
