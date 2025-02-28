import { AuthContext } from "../providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCart } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { MdMenu, MdOutlineStore } from "react-icons/md";
import Wishlist from "./Cards/Wishlist/Wishlist";
import BgBlurModal from "./Modal/BgBlurModal";
import Cart from "./cart/Cart";
import { Link, useNavigate } from "react-router-dom";
import ProductSearch from "../components/Home/Products/ProductSearch/ProductSearch";
const Navbar = () => {
  const placeholders = ["Shorts", "Watch", "Shirt"];
  const [placeholderText, setPlaceholderText] = useState < any > "";
  const [placeholderIndex, setPlaceholderIndex] = useState < any > 0;
  const [charIndex, setCharIndex] = useState < any > 0;
  const [isTyping, setIsTyping] = useState < any > true;
  const [isFocused, setIsFocused] = useState < any > false;
  const router = useNavigate();
  const [isShowModal, setIsShowModal] = useState < any > false;
  const [isShowWishlist, setIsShowWishlist] = useState < any > false;
  const [isShowSearch, setIsShowSearch] = useState < any > false;
  const SearchBar = ({ setIsShowSearch }) => {
    useEffect(() => {
      if (isFocused) return;

      let typingTimeout;

      if (isTyping) {
        if (charIndex < placeholders[placeholderIndex].length) {
          typingTimeout = setTimeout(() => {
            setPlaceholderText(
              (prev: any) => prev + placeholders[placeholderIndex][charIndex]
            );
            setCharIndex((prev: any) => prev + 1);
          }, 300);
        } else {
          setIsTyping(false);
          setTimeout(() => setIsTyping(false), 2000);
        }
      } else {
        if (charIndex > 0) {
          typingTimeout = setTimeout(() => {
            setPlaceholderText((prev: any) => prev.slice(0, -1));
            setCharIndex((prev: any) => prev - 1);
          }, 150);
        } else {
          setIsTyping(true);
          setPlaceholderIndex((prev: any) => (prev + 1) % placeholders.length);
        }
      }

      return () => clearTimeout(typingTimeout);
    }, [charIndex, isTyping, placeholderIndex, placeholders, isFocused]);

    const handleFocus = () => {
      // setIsFocused(true);
      setIsShowSearch(true);
    };

    const handleBlur = (e) => {
      if (e.target.value.length === 0) {
        setIsFocused(false);
      }
    };

    return (
      <div className="bg-gray-100 rounded-full px-3 w-[70%] md:py-2 py-1 md:gap-2 gap-1 flex-row-reverse justify-between flex">
        <input
          type="text"
          className="outline-none w-full bg-gray-100"
          placeholder={!isFocused ? `Search for "${placeholderText}"` : ""}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <IoIosSearch className="text-2xl text-gray-400" />
      </div>
    );
  };

  const { userRole, logOut, totalItems } = useContext(AuthContext);

  const currentUserRoute =
    userRole === "Administrator"
      ? "/dashboard/admin/view_and_edit_admin_information"
      : userRole === "Survey Creator"
      ? "/dashboard/company/creator_profile"
      : "/dashboard/user/participant_profile";

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("User logged out successfully!", {
          duration: 3000,
          position: "top-right",
        });

        router("/", { scroll: false });
      })
      .catch((error) => {
        toast.error("Logout failed. Please try again later.");
        console.error(error);
      });
  };

  useEffect(() => {
    const header = document.getElementById("header");
    const nav_menu = document.getElementById("nav-menu");
    const logo_name = document.getElementById("logo_name");
    const menu_icon = document.getElementById("menu_icon");
    window.addEventListener("scroll", () => {
      const scrolling = window.scrollY;
      if (scrolling > 300) {
        // navbar style
        header.classList.add(
          "fixed",
          "top-0",
          "bg-[#E9F1FA]",
          "dark:text-neutral-800"
        );
        header.classList.remove(
          "relative",
          "bg-transparent",
          "dark:lg:text-white"
        );
        // navbar menu style
        nav_menu.classList.add("dark:text-neutral-800");
        // nav_menu.classList.remove("dark:text-white");
        logo_name.classList.remove("dark:text-white");
        logo_name.classList.add("dark:text-neutral-800");
        menu_icon.classList.remove("dark:text-white");
        menu_icon.classList.add("dark:text-neutral-800");
      } else {
        header.classList.add("relative", "dark:text-white");
        header.classList.remove(
          "fixed",
          "top-0",
          "bg-blue-200",
          "dark:text-neutral-800"
        );
        nav_menu.classList.add("dark:text-white");
        logo_name.classList.add("dark:text-white");
        logo_name.classList.remove("dark:text-neutral-800");
        menu_icon.classList.add("dark:text-white");
        menu_icon.classList.remove("dark:text-neutral-800");
      }
    });
  }, []);
  return (
    <>
      <header
        className="flex flex-wrap lg:justify-start lg:flex-nowrap w-full items-center z-50 top-0 left-0 text-sm  transition-all duration-500 relative bg-white border-b "
        id="header"
      >
        <div className="navbar w-[94%] mx-auto ">
          <div className="navbar-start">
            <div className="flex items-center gap-3">
              <div role="button" className="" id="menu_icon">
                <MdMenu className="text-2xl" />
              </div>
              <div>
                <Link to="/" className="flex justify-center items-center ">
                  <img
                    className="w-28 mix-blend-multiply dark:mix-blend-normal"
                    width={400}
                    height={400}
                    src={
                      "https://multisports.shop/images/site_setting/multi-sports_vi6P5.png"
                    }
                    alt="logo"
                  />{" "}
                </Link>
              </div>
            </div>
          </div>

          {/* <label class="input input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              class=""
              placeholder="I'm in the market for..."
            />
            <button className="hover:bg-gray-300 p-1 rounded">
              <CiSearch size={30} />
            </button>
          </label> */}

          <SearchBar setIsShowSearch={setIsShowSearch}></SearchBar>

          {/* Menu */}
          <div className="navbar-end flex items-center gap-1 md:gap-3">
            {/* My Store */}
            <button className="flex items-center justify-center flex-col gap-1 md:p-3 p-1 rounded">
              <MdOutlineStore className="md:text-2xl text-base text-gray-600 hover:text-blue-500 hover:scale-110 cursor-pointer transition-all" />
              <span className="hidden md:block">My Store</span>
            </button>

            {/* Wishlist */}
            <button
              className="flex items-center justify-center flex-col gap-1 md:p-3 p-1 rounded"
              onClick={() => setIsShowWishlist(true)}
            >
              <FaRegHeart className="md:text-2xl text-base text-gray-600 hover:text-pink-500 hover:scale-110 cursor-pointer transition-all" />
              <span className="hidden md:block">Wishlist</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsShowModal(true)}
              className="flex items-center justify-center flex-col gap-1 md:p-3 p-1 rounded relative"
            >
              <BsCart className="md:text-2xl text-base text-gray-600 hover:text-orange-500 hover:scale-110 cursor-pointer transition-all" />
              <span className="hidden md:block">Cart</span>
              <div className="badge badge-primary badge-lg absolute top-0 -right-2">
                {totalItems}
              </div>
            </button>

            {/* Sign In */}
            <Link to="/login">
              <div className="flex items-center justify-center flex-col gap-1 md:p-3 p-1 rounded">
                <FaRegUser className="md:text-2xl text-base text-gray-600 hover:text-blue-500 hover:scale-110 cursor-pointer transition-all" />
                <span className="hidden md:block">Sign In</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
      <BgBlurModal isShowModal={isShowModal} setIsShowModal={setIsShowModal}>
        <Cart isShow={isShowModal} setIsShow={setIsShowModal} />
      </BgBlurModal>

      <BgBlurModal isShowModal={isShowModal} setIsShowModal={setIsShowModal}>
        <RunningOrders isShow={isShowModal} setIsShow={setIsShowModal} />
      </BgBlurModal>
      <BgBlurModal
        isShowModal={isShowWishlist}
        setIsShowModal={setIsShowWishlist}
      >
        <Wishlist isShow={isShowWishlist} setIsShow={setIsShowWishlist} />
      </BgBlurModal>
      <BgBlurModal isShowModal={isShowSearch} setIsShowModal={setIsShowSearch}>
        <ProductSearch isShow={isShowSearch} setIsShow={setIsShowSearch} />
      </BgBlurModal>
    </>
  );
};

export default Navbar;
