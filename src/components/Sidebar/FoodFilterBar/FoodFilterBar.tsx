import useGetAllMenuSubcategory from "@/hooks/GetDataHook/useGetAllMenuSubcategory";
import useGetAllMenuCategory from "@/hooks/GetDataHook/useGetAllMenuCategory";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Chip } from "@nextui-org/chip";
import { LuMoveRight } from "react-icons/lu";

import {
  Input,
  Listbox,
  ListboxItem,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { set } from "mongoose";
import { IoFastFoodSharp } from "react-icons/io5";

export default function FoodFilterBar({
  isShowFilter,
  searchText,
  setSearchText,
  category,
  setCategory,
  subcategory,
  setSubcategory,
}: any) {
  const [selectedKey, setSelectedKey] = useState("");
  const [categories, setCategories] = useState([]);

  const [isSearch, setIsSearch] = useState<any>(false);

  const menuCategories = useGetAllMenuCategory({});
  const menuSubcategories = useGetAllMenuSubcategory({});
  useEffect(() => {
    const categoryItems: any = menuCategories.map((item: any) => {
      const filterItems: any = menuSubcategories.filter((item2: any) => {
        return item2?.category == item.slug;
      });
      item.subcategories = filterItems;
      return item;
    });

    setCategories(categoryItems);

    console.log(categoryItems, "debouncedValue");

    // setSubcategories(filterItems);
  }, [menuSubcategories, menuCategories]);
  return (
    <nav
      className={`fixed top-10 transition-all duration-200 ${
        isShowFilter ? "right-0" : "-right-full"
      } py-3 bg-neutral-700 px-6   h-[96%] z-[8] `}
    >
      <div className="flex items-center space-x-2 w-full bg-green-300 px-1 py-1 rounded-md border border-black">
        <Input
          size="sm"
          placeholder="Search"
          className={`w-full `}
          id="search"
          value={searchText}
          onChange={(e: any) => setSearchText(e.target.value)}
        />
        <label
          className="bg-white hover:bg-neutral-700 hover:text-white w-10 h-8 rounded flex items-center justify-center"
          onClick={() => {
            setIsSearch(true);
          }}
        >
          <CiSearch size={20} />
        </label>
      </div>
      <div className="w-full h-[95%] overflow-auto">
        <Tabs
          key={"success"}
          // color={"success"}
          aria-label="Tabs colors"
          // radius="full"
          variant="light"
          selectedKey={selectedKey}
          defaultSelectedKey={"cart"}
          className="overflow-auto "
          fullWidth={true}
          isVertical={true}
          // onSelectionChange={(key) => {
          //   console.log(key, "debouncedValue");
          //   setCategory(key);
          // }}
        >
          <Tab
            key={""}
            className=" rounded-none focus:border-none focus:outline-none py-2 h-full px-3 hover:scale-110 duration-200 transition-all"
            title={
              <div
                className="flex items-center gap-3 min-w-[130px] justify-between w-full"
                onClick={() => {
                  setCategory("");
                  setSubcategory("");
                  setSearchText("");
                }}
              >
                <img src={"/diet.png"} width={20} height={20} alt="image" />
                {/* <IoFastFoodSharp className="text-lg" /> */}
                <span className="text-lg font-bold">All</span>
                <Chip size="sm" variant="faded">
                  {categories?.length}
                </Chip>
              </div>
            }
          />
          {categories.map((item: any) => (
            <Tab
              key={""}
              className=" rounded-none focus:border-none focus:outline-none py-2 h-full px-3 hover:scale-110 duration-200 transition-all"
              title={
                item.subcategories.length > 0 ? (
                  <Tooltip
                    content={
                      <Listbox
                        aria-label="Actions"
                        onAction={(key) => setSubcategory(key)}
                      >
                        {item.subcategories.map((item: any) => (
                          <ListboxItem key={item.slug} className="py-1 my-0 ">
                            <span className="text-sm font-bold flex gap-2">
                              <LuMoveRight /> {item.name}
                            </span>
                          </ListboxItem>
                        ))}
                      </Listbox>
                    }
                    placement="left"
                  >
                    <div
                      className="flex items-center gap-3 min-w-[130px] justify-between w-full rounded-sm "
                      onClick={() => setCategory(item.slug)}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          width={20}
                          height={20}
                          alt="image"
                        />
                      )}
                      <span className="text-lg font-bold">
                        {item.name.length > 14
                          ? `${item.name.slice(0, 15)}...`
                          : item.name}
                      </span>
                      <Chip size="sm" variant="faded">
                        {item?.subcategories?.length}
                      </Chip>
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    className="flex items-center gap-3 min-w-[130px] justify-between w-full "
                    onClick={() => setCategory(item.slug)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        width={20}
                        height={20}
                        alt="image"
                      />
                    )}
                    <span className="text-lg font-bold">
                      {item.name.length > 14
                        ? `${item.name.slice(0, 15)}...`
                        : item.name}
                    </span>
                    <Chip size="sm" variant="faded">
                      {item?.subcategories?.length}
                    </Chip>
                  </div>
                )
              }
            />
          ))}
        </Tabs>
      </div>
    </nav>
  );
}
