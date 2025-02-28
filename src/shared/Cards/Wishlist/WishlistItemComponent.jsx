import { IoMdClose } from "react-icons/io";
import CustomImage from "../../ImageComponents/CustomImage";

const WishlistItemComponent = ({ item, removeFromWishlist }) => {
  return (
    <div className="flex items-center mb-4 relative border rounded-md p-2">
      <div className="w-full max-w-[100px]">
        <CustomImage
          imageKey={item.thumbnail}
          alt="Card Image"
          className="w-[100px] object-cover"
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col ml-4 ">
        <span className="font-bold text-black">{item.productTitle}</span>

        {item?.shortDescription &&
        (item?.shortDescription.length > 100) &
          (item?.shortDescription.length < 200) ? (
          <p
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: item?.shortDescription }}
          />
        ) : (
          <p
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{
              __html: item?.shortDescription.slice(0, 100) + "...",
            }}
          />
        )}
      </div>

      <button
        className="absolute top-1 right-1"
        onClick={() => removeFromWishlist(item._id)}
      >
        <IoMdClose />
      </button>
    </div>
  );
};

export default WishlistItemComponent;
