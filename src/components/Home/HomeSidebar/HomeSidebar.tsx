import { useRef } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { MenuToggle } from "./MenuToggle";
import { useDimensions } from "./use-dimensions";
import "./HomeSidebar.css";

interface HomeSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 40px 40px)",
    transition: {
      delay: 0,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

export const HomeSidebar: React.FC<HomeSidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      id="sidebarMenu"
      animate={isOpen ? "open" : "closed"}
      className={`fixed top-0 left-0 z-[999] h-screen menu max-w-[300px]`}
    >
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className={`relative z-[9999] h-screen menu w-full -mt-8 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-300`}
      >
        <Navigation />
      </motion.nav>
      <motion.div
        className="bg-neutral-700 w-[288px] absolute top-0 left-0 bottom-0 right-0 z-[9]"
        variants={sidebar}
      />
      <MenuToggle toggle={() => setIsOpen(!isOpen)} />
    </motion.nav>
  );
};
