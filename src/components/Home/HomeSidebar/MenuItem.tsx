import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext } from "@/providers/ContextProvider";

const variants: any = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
    visibility: "visible",
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
    visibility: "hidden",
  },
};

export const MenuItem: any = ({ item }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { language } = useGlobalContext();

  console.log(language, "language");

  return (
    <motion.div
      variants={variants}
      className="flex items-center text-black rounded-sm px-2 font-bold w-full"
    >
      <Accordion
        itemClasses={{
          base: `w-full my-0 mb-2 ${
            isFocused ? "bg-white" : "bg-transparent"
          } rounded-md`,
          title: "font-normal text-medium",
          trigger:
            "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
          indicator: "text-medium",
          content: "text-small px-2",
        }}
        showDivider={false}
        variant="light"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <AccordionItem
          key="1"
          aria-label={
            typeof item?.title === "string"
              ? item?.title
              : item?.title[language]
          }
          startContent={
            <span className="bg-green-300 text-black p-1 w-8 h-8 rounded-md flex justify-center items-center">
              {item.icon}
            </span>
          }
          title={
            typeof item?.title === "string"
              ? item?.title
              : item?.title[language]
          }
          className="rounded-md min-w-[250px]"
        >
          <Listbox
            aria-label="Actions"
            className="border bg-white rounded-md my-0  border-green-400"
            onAction={(key: any) => navigate(key)}
          >
            {item.list.map((listItem: any) => (
              <ListboxItem key={listItem.path} className="my-0">
                {typeof listItem?.title === "string"
                  ? listItem.title
                  : listItem?.title[language]}
                {console.log(listItem?.title[language], "title")}
              </ListboxItem>
            ))}
          </Listbox>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

// item[language].title
