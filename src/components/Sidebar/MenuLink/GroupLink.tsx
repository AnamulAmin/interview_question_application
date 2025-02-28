import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import MenuLink from "./MenuLink";
import { useLocation } from "react-router-dom";

const GroupLink: any = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState<any>(false);
  const location = useLocation();

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
            {item.title}
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
                key={subItem.title}
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
