import useGetAllCategories from "../../Hook/GetDataHook/useGetAllCategories";
// import {Link} from "react-router-dom";
import { useState, useEffect } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

import "./horizontalMenuStyle.css";
import useGetAllSubCategories from "../../Hook/GetDataHook/useGetAllSubCategories";
import SubcategoryMenu from "./SubMenu/SubcategoryMenu";
import useGetAllChildCategories from "../../Hook/GetDataHook/useGetAllChildCategories";
import { Link } from "react-router-dom";
function HorizontalMenu() {
  const [activeCategory, setActiveCategory] = useState < any > "";
  const [categoryImage, setCategoryImage] = useState < any > "";
  const [isHover, setIsHover] = useState < any > false;
  const categories = useGetAllCategories({ query: `showOnNavbar=Yes` });
  const chaiCategories = useGetAllChildCategories({
    query: `showOnNavbar=Yes`,
  });
  const [currentSubCategories, setCurrentSubCategories] = useState < any > [];

  // const subcategories = useGetAllSubCategories({
  //   query: `category=${activeCategory}`,
  //   activeCategory,
  // });
  const subcategories = useGetAllSubCategories({
    // query: `category=${activeCategory}`,
    // activeCategory,
  });

  useEffect(() => {
    const currentCategory = categories.find(
      (category) => category.slug === activeCategory
    );
    if (!currentCategory) {
      return;
    }
    setCategoryImage(currentCategory.categoryBanner);

    const currentSubCategoriesData = subcategories.filter(
      (subcategory) => subcategory.category === currentCategory.slug
    );
    setCurrentSubCategories(currentSubCategoriesData);
  }, [activeCategory]);

  console.log(activeCategory, "activeCategory");
  return (
    <div className="relative">
      <header className="w-full bg-neutral-700 text-white ">
        <div className="container mx-auto flex px-6  gap-4 ">
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            className="horizontal_menu"
            navigation={true}
            modules={[Navigation]}
          >
            {categories?.length > 0 &&
              categories.map((category, index) => (
                <SwiperSlide key={index}>
                  <button
                    className={`py-4 px-2  hover:bg-white ${
                      isHover && category?.slug === activeCategory
                        ? "bg-white text-black"
                        : "text-white"
                    } hover:text-black cursor-pointer relative`}
                    onMouseEnter={() => {
                      setActiveCategory(category.slug);
                      setIsHover(true);
                    }}
                    onMouseLeave={() => {
                      setIsHover(false);
                    }}
                  >
                    <Link
                      to={`/products/${category.slug}`}
                      className={"text-nowrap"}
                    >
                      {category.categoryName}
                    </Link>
                  </button>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </header>

      <SubcategoryMenu
        subcategories={currentSubCategories}
        setActiveCategory={setActiveCategory}
        isHover={isHover}
        setIsHover={setIsHover}
        categoryImage={categoryImage}
        chaiCategories={chaiCategories}
      />
    </div>
  );
}

export default HorizontalMenu;
