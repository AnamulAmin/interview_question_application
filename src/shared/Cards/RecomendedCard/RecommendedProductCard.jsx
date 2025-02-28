import { AuthContext } from "../../../providers/AuthProvider";

import { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import Wishlist from "../Wishlist/Wishlist";
import WishlistIcon from "../Wishlist/WishlistIcon";
export default function RecommendedProductCard({ item = {} }) {
  const [isLike, setIsLike] = useState < any > false;
  const { addToCart, wishlist } = useContext(AuthContext);

  useEffect(() => {
    wishlist.map((item) => {
      if (item.id === item.id) {
        setIsLike(true);
      }
    });
  }, [wishlist]);
  return (
    <div className="max-w-xs bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 relative">
      {/* Product Image */}
      <div className="relative">
        <img
          src={
            item?.image
              ? item?.image
              : "https://i.pinimg.com/564x/58/ac/ca/58acca94f0313e0f56c2b0aab45c9257.jpg"
          } // Replace with actual image path
          alt="Product Image"
          width={200}
          height={200}
          className="w-full object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 left-0 w-full px-4 flex justify-between items-center">
          <div className="flex items-center mt-2 bg-white bg-opacity-30 text-black">
            <div className="text-sm font-bold flex items-center">
              <FaStar />
              <span className="ml-1">4.4</span>
            </div>
            <span className="text-sm text-black ml-1">(16k)</span>
          </div>
          <WishlistIcon item={item} />
        </div>
      </div>

      {/* Rating */}

      {/* Price and Button */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">₹299</span>
          <span className="text-sm text-gray-600">+1 Offer</span>
        </div>
        <div>
          <h2 className="text-lg font-bold">{item?.productTitle}</h2>

          {item?.shortDescription &&
          (item?.shortDescription.length > 100) &
            (item?.shortDescription.length < 200) ? (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html: item?.shortDescription?.slice(0, 100) + "...",
              }}
            />
          ) : (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: item?.shortDescription }}
            />
          )}
        </div>
        <button
          onClick={() => addToCart(item)}
          className="w-full border border-black text-black text-sm font-bold py-2 mt-2 rounded-lg hover:bg-black hover:text-white transition duration-300"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
