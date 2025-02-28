import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SubcategoryLink({ subcategory, childCategoryItem }) {
  const [childCategories, setChildCategories] = useState < any > [];
  const [isHover, setIsHover] = useState < any > false;
  const [activeItem, setActiveItem] = useState < any > "";

  useEffect(() => {
    const filterItems = childCategoryItem.filter(
      (item: any) => item.subcategory === subcategory.slug
    );

    setChildCategories(filterItems);
  }, [activeItem, childCategoryItem]);
  return (
    <Link
      className="hover:text-blue-800 group hover:translate-x-3 pr-10 py-2 transition-all duration-300 text-lg font-bold hover:underline relative"
      to={`/products/${subcategory.slug}`}
      onMouseOver={() => {
        setActiveItem(subcategory.slug);
      }}
    >
      {subcategory.subcategoryName}

      {childCategories?.length > 0 && (
        <ul
          className={`absolute left-full top-0 bg-white text-neutral-800 rounded-md shadow-lg z-50 px-5 py-4 space-y-3 min-w-[250px] transition-all duration-300 opacity-0 translate-x-4 invisible group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible`}
        >
          {childCategories.map((item: any, index: number) => (
            <li key={index}>
              <Link
                to={`/products/${item.slug}`}
                className=" hover:text-blue-500 "
              >
                {item.childCategoryName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

export default SubcategoryLink;
