import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { Link } from "react-router-dom";
import MenuItemsList from "../../Sidebar/MenuItems";
import useGetCompanyData from "../../../hooks/GetDataHook/useGetCompanyData";

const variants: any = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const variants2: any = {
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
  onmouseenter: {},
};

export const Navigation = () => {
  const allMenuItems = MenuItemsList();
  // const navigate = useNavigate();

  console.log(allMenuItems, "allMenuItems");
  const companyData = useGetCompanyData({});
  return (
    <motion.nav
      variants={variants}
      className="h-[100vh] absolute top-0 left-0 bottom-0  overflow-auto "
    >
      <motion.div
        variants={variants2}
        className="bg-white rounded-br-3xl mt-10"
      >
        <Link to={"/"} className="mb-6 bg-white relative z-30 ">
          <img
            src={companyData?.companyLogo || "/no-image.png"}
            alt="Logo"
            className="w-[100%] max-h-[100px] my-4 object-contain"
          />
        </Link>
      </motion.div>
      {allMenuItems.map((item: any, index: number) => (
        <MenuItem key={index} item={item} />
      ))}
    </motion.nav>
  );
};
