import { Image } from "@nextui-org/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const CartItemComponent = ({
  updateCartQuantity,
  item,
  removeFromCart,
}: any) => {
  const [quantity, setQuantity] = useState<any>(item.quantity || 1);

  const increaseQuantity = () => {
    setQuantity((prev: any) => {
      updateCartQuantity(item._id, prev + 1);
      return prev + 1;
    });
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev: any) => {
        updateCartQuantity(item._id, prev - 1);
        return prev - 1;
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 relative border rounded-md p-2 bg-white">
      <Image
        src={item.thumbnail}
        alt="Product Card"
        className="w-[100px] object-cover"
        width={100}
        height={100}
      />
      <div className="flex flex-col ml-4 ">
        <span className="font-bold text-black">{item.name}</span>
        <span className="text-gray-500 text-sm">BLACK</span>
        <div className="flex items-center mt-2">
          <button
            className="px-2 py-1 bg-gray-300 rounded"
            onClick={() => decreaseQuantity()}
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="px-2 py-1 bg-gray-300 rounded"
            onClick={() => increaseQuantity()}
          >
            +
          </button>
        </div>
      </div>
      <span className="font-bold text-lg">${item?.price * quantity}</span>

      <button
        className="absolute top-1 right-1"
        onClick={() => removeFromCart(item._id)}
      >
        <IoMdClose />
      </button>
    </div>
  );
};

export default CartItemComponent;
