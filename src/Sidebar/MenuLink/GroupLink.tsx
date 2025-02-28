import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import MenuLink from "./MenuLink";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "@/providers/ContextProvider";

const GroupLink: any = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState<any>(false);
  const location = useLocation();
  const { language } = useGlobalContext();

  return (
    <Popover key={item.title} placement={"right-start"}>
      <PopoverTrigger>
        <Button
          variant="flat"
          className="capitalize justify-between w-full"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {typeof item.title === "string" ? item.title : item[language].title}
            {console.log(
              typeof item.title === "string"
                ? item.title
                : item[language].title,
              "title"
            )}
          </span>

          <FaArrowRight
            size={10}
            className={`transition-all duration-300 ${
              isOpen ? "translate-x-2" : "translate-x-0"
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 pt-2">
          {item.list &&
            item.list.map((subItem: any) => (
              <MenuLink
                key={
                  typeof subItem.title === "string"
                    ? subItem.title
                    : subItem[language].title
                }
                item={subItem}
                location={location}
              />
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GroupLink;
