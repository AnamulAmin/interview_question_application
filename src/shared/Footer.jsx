import moment from "moment/moment";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { ImLocation } from "react-icons/im";
import { Link } from "react-router-dom";
import useGetSocialLink from "../Hook/GetPublicDataHook/useGetSocialLink";
import useGetGeneralInfo from "../Hook/GetPublicDataHook/useGetGeneralInfo";

const Footer = () => {
  const currentYear = moment().format("YYYY"); // Using moment.js
  const footerContainerVariant = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        duration: 0.5,
        ease: "linear",
      },
    },
  };

  const footerItem = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.6, 0.3, 0.8],
      },
    },
  };

  const [socialLinks, setSocialLinks] = useState < any > [];

  const content = useGetSocialLink({});
  const info = useGetGeneralInfo({});

  useEffect(() => {
    let initialData = [];
    if (content) {
      for (let key in content) {
        const newObj = {};

        if (key === "_id") continue;
        if (key === "__v") continue;
        if (key === "updatedAt") continue;
        if (key === "createdAt") continue;
        if (content[key] === "") continue;

        newObj.link = content[key];
        newObj.name = key;

        console.log(newObj, "newObj");
        initialData.push(newObj);
      }
      setSocialLinks(initialData);
    }
  }, [content]);

  console.log(socialLinks, "socialLinks");

  return (
    <div className="poppins border-t mt-12">
      <footer className="flex flex-col  md:flex-row p-10  w-[96%] mx-auto justify-center md:justify-between items-start md:gap-8 gap-5  text-left">
        <aside>
          <h6 className="footer-title text-lg font-bold mb-4 text-black">
            CONTACT US
          </h6>
          <div>
            <div className="flex gap-2 items-center">
              <FaPhoneAlt className="text-slate-600" />
              <h2 className="font-normal flex gap-3 ">
                <p>{info.phone}</p>
              </h2>
            </div>
            <div className="flex  gap-2 items-start mt-3 text-lg">
              <div>
                <ImLocation className="text-base text-slate-600 mt-1" />
              </div>
              <div className="text-slate-600">
                <p className="font-semibold text-base">{info.company_name}</p>
                <p className="max-w-sm">{info.address}</p>
              </div>
            </div>
            <p className="text-slate-600 flex  gap-2 items-center mt-3 text-base">
              <span className="font-bold">
                <FiMail className="text-base text-slate-600" />
              </span>{" "}
              {info.email}
            </p>
          </div>
        </aside>
        <nav>
          <h6 className="footer-title text-lg font-bold mb-4 text-black">
            Company
          </h6>
          <div className="text-slate-600 flex flex-col gap-3 text-base">
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
              to="/aboutus/about"
            >
              About us
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
              to="/contactus"
            >
              Contact
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
              to="#"
            >
              Shop Address
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
              to="/blogs"
            >
              Blogs
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
              to="/notice"
            >
              Notice
            </Link>
          </div>
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-bold mb-4 text-black">
            Help
          </h6>
          <div className="text-slate-600 flex flex-col gap-3 text-base">
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer"
              to="#"
            >
              Frequently Asked Questions
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer"
              to="/terms"
            >
              Terms & Conditions
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer"
              to="/Privacy"
            >
              Replacement Policy
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer"
              to="/cookiePolicy"
            >
              Cookie policy
            </Link>
            <Link
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer"
              to="/refundpolicy"
            >
              EMI Terms & Conditions
            </Link>
          </div>
          {/* <Link className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300 cursor-pointer" to="/webadmin">
            Admin Login
          </Link> */}
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-bold mb-4 text-black">
            Customer
          </h6>
          <div className="flex flex-col gap-3 text-slate-600 text-base">
            <Link
              to={"#"}
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to={"#"}
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
            >
              Register
            </Link>
            <Link
              to={"#"}
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
            >
              Marketplace
            </Link>
            <Link
              to={"#"}
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
            >
              Brands
            </Link>
            <Link
              to={"#"}
              className="hover:text-blue-800 hover:translate-x-3 transition-all duration-300"
            >
              Savings for You
            </Link>
          </div>
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-bold mb-4 text-black">
            Social
          </h6>
          <div className="flex flex-col gap-3 text-slate-600 text-md">
            {socialLinks.length > 0 &&
              socialLinks.map((item: any, index: number) => {
                return (
                  <Link
                    href={`${item.link}`}
                    className=" hover:translate-x-3 hover:text-blue-500 transition-all duration-300 flex gap-2 items-center capitalize"
                    key={index}
                  >
                    {item.name}
                  </Link>
                );
              })}
          </div>
        </nav>
      </footer>

      <div className="mx-auto w-[95%]">
        <footer className="footer flex flex-col md:flex-row justify-between items-center py-3  border-t px-5 text-center text-xl">
          <p className="text-base">{info.footer_copyright}</p>
          {/* icons */}
          <nav className="flex gap-3">
            <Link
              to={content.facebook}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="text-lg" />
            </Link>
            <Link
              to={content.instagram}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-lg" />
            </Link>
            <Link
              to={content.linkedin}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-lg" />
            </Link>
            <Link
              to={content.pinterest}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="Pinterest"
            >
              <FaPinterest className="text-lg" />
            </Link>
            <Link
              to={content.tiktok}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="text-lg" />
            </Link>
            <Link
              to={content.youtube}
              target="_blank"
              className=""
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube className="text-lg" />
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
