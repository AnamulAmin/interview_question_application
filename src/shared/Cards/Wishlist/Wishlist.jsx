import { AuthContext } from "../../../providers/AuthProvider";
import { useContext } from "react";
import WishlistItemComponent from "./WishlistItemComponent";

const Wishlist = ({ isShow }) => {
  const { wishlist, removeFromWishlist } = useContext(AuthContext);

  return (
    <div
      className={`w-[450px] h-screen bg-white rounded-lg shadow-lg p-4 absolute top-0 right-0 z-50 transition-all duration-500 pr-10 pl-5 flex flex-col ${
        isShow ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h2 className="text-2xl text-gray-500 mb-2 border-b border-gray-300">
        Your Wishlist
      </h2>

      <div
        className="border-b pb-4 h-full overflow-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {wishlist?.length > 0 &&
          wishlist?.map((item: any) => (
            <WishlistItemComponent
              item={item}
              key={item._id}
              removeFromWishlist={removeFromWishlist}
            />
          ))}
      </div>
    </div>
  );
};

export default Wishlist;
