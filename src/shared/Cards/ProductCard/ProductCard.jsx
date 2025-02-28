import CustomImage from "../../ImageComponents/CustomImage";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext } from "react";
import WishlistIcon from "../Wishlist/WishlistIcon";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(AuthContext);

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-[350px]">
        <CustomImage
          imageKey={product?.thumbnail}
          alt={"image"}
          className="h-[350px] w-full object-cover"
          width={600}
          height={500}
        />
        {true && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            New
          </div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Save ৳{product.discount}
          </div>
        )}
      </div>

      <WishlistIcon item={product} />

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-sm font-semibold">{product?.productTitle}</h3>
        <div className="flex items-center justify-between mt-2">
          {product?.shortDescription &&
          (product?.shortDescription?.length > 100) &
            (product?.shortDescription?.length < 200) ? (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: product?.shortDescription }}
            />
          ) : (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html: product?.shortDescription?.slice(0, 100) + "...",
              }}
            />
          )}

          <span className="text-xl font-bold text-gray-900">
            ৳{product?.price}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-black text-white text-sm font-bold py-2 mt-4 rounded-lg hover:bg-white hover:text-black hover:border-black hover:border transition duration-300"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
