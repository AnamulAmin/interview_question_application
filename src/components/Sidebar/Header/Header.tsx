"use client";
import { useGlobalContext } from "@/providers/ContextProvider";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Input,
} from "@nextui-org/react";
import { Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { AiOutlineTransaction } from "react-icons/ai";

// import Link from "next/link";

export default function Header() {
  const { language, setLanguage } = useGlobalContext();

  console.log(language, "language");

  const handleLanguageFlag = (key: any) => {
    switch (key) {
      case "en":
        return "🇬🇧";
        break;
      case "ar":
        return "🇦🇪";
        break;
      case "urdu":
        return "🇵🇰";
        break;
      case "bn":
        return "🇧🇩";
        break;
      default:
        return <Flag size={20} />;
        break;
    }
  };
  return (
    <Navbar
      shouldHideOnScroll
      className="bg-white shadow-md dark:bg-gray-900 fixed w-full z-50"
    >
      {/* Left Section */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2">
            <BookOpen size={24} className="text-primary" />
            <p className="font-bold text-inherit">Interview Prep</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Right Section */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Input
            className="w-64"
            placeholder="Search questions..."
            startContent={<Search size={18} />}
          />
        </NavbarItem>

        {/* Categories Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              icon={<BookOpen size={20} />}
              size="sm"
              className="cursor-pointer"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Categories">
            <DropdownItem key="javascript">
              <Link to="/javascript">JavaScript</Link>
            </DropdownItem>
            <DropdownItem key="react">
              <Link to="/react">React</Link>
            </DropdownItem>
            <DropdownItem key="data-structures">
              <Link to="/data-structures">Data Structures</Link>
            </DropdownItem>
            <DropdownItem key="algorithms">
              <Link to="/algorithms">Algorithms</Link>
            </DropdownItem>
            <DropdownItem key="system-design">
              <Link to="/system-design">System Design</Link>
            </DropdownItem>
            <DropdownItem key="overview">
              <Link to="/overview">Overview</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
