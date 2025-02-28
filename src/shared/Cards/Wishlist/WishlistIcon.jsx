;
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext,  useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useAxiosPublic from "../../../Hook/useAxiosPublic";
import toast from "react-hot-toast";
export default function WishlistIcon({item}) {
  const {  wishlist, addToWishlist, removeFromWishlist } = useContext(AuthContext);
  const [isLike, setIsLike] = useState<any>(!wishlist.map((item)=> item._id).includes(item._id));

  const axiosPublic = useAxiosPublic();


  const handleWishlist = async () => {

    

    
    
    setIsLike((prev: any)=> {
      if (prev: any) {
        addToWishlist(item);
       return false
      } else {
        removeFromWishlist(item._id);
       return true
      }

    })
  };



  return (
    
          <button
            className=" bg-white rounded-full p-1 shadow hover:shadow-lg absolute top-3 right-3 z-40"
            onClick={handleWishlist}
          >
            {isLike ? <FaRegHeart /> : <FaHeart />}
          </button>
        
  );
}
