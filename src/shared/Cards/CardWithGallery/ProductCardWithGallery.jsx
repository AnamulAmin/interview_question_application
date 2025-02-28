import CardGallerySide from "./CardGallerySide/CardGallerySide";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext } from "react";
import WishlistIcon from "../Wishlist/WishlistIcon";
import { FaEye } from "react-icons/fa";
import CustomImage from "../../ImageComponents/CustomImage";

export default function ProductCardWithGallery({
  product,
  setTargetId,
  setIsShowDetail,
}) {
  const { addToCart } = useContext(AuthContext);

  return (
    <>
      <div className="max-w-xs bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 relative">
        {/* Product Image */}

        <div className="min-h-[250px] w-full">
          {product?.gallery && product?.gallery?.length > 0 ? (
            <CardGallerySide
              gallery={product?.gallery}
              thumbnailImage={product?.thumbnail}
            />
          ) : (
            <CustomImage
              imageKey={product?.thumbnail}
              alt={"image"}
              className="h-[350px] w-full object-cover"
              width={600}
              height={500}
            />
          )}
        </div>

        <WishlistIcon item={product} />

        <p className="text-sm mb-4 space-x-2">
          {" "}
          {product?.productColorValue &&
            product?.productColorValue.map((item: any, index: number) => (
              <span
                className="h-6 w-6 rounded inline-block"
                key={index}
                style={{ background: item }}
              ></span>
            ))}{" "}
        </p>

        {/* Rating */}
        <div
          onClick={() => {
            setIsShowDetail(true);
            setTargetId(product._id);
          }}
          className="flex justify-center items-center mt-2 py-4 bg-black bg-opacity-20 opacity-100 text-white group-hover:opacity-100 group-hover:visible"
        >
          <FaEye size={20} />
        </div>

        {/* Product Details */}
        <div className="mt-2">
          <h2 className="text-lg font-bold">{product?.productTitle}</h2>
          {product?.shortDescription &&
          (product?.shortDescription.length > 100) &
            (product?.shortDescription.length < 200) ? (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: product?.shortDescription }}
            />
          ) : (
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html: product?.shortDescription.slice(0, 100) + "...",
              }}
            />
          )}
        </div>

        {/* Price and Button */}
        {/* <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            ₹{product?.price}
          </span>
          <span className="text-sm text-gray-600">
            {product?.productDiscount} Offer
          </span>
        </div>
        <button onClick={()=> addToCart(product) } className="w-full border border-black text-neutral-900 text-sm font-bold py-2 mt-2 rounded-lg hover:bg-neutral-900 hover:text-white transition duration-300">
          ADD TO CART
        </button>
      </div> */}
      </div>
    </>
  );
}
