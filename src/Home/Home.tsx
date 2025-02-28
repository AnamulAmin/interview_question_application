import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  FaJs,
  FaReact,
  FaDatabase,
  FaCode,
  FaSitemap,
  FaBookOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface Category {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const Home: React.FC = () => {
  const categories: Category[] = [
    {
      title: "JavaScript",
      description:
        "List of 471 JavaScript Interview Questions for Junior (Fundamentals) and Intermediate (Advanced) Levels",
      path: "/javascript",
      icon: <FaJs className="text-4xl text-yellow-400" />,
    },
    {
      title: "React",
      description:
        "React fundamentals, hooks, state management, and best practices",
      path: "/react",
      icon: <FaReact className="text-4xl text-blue-400" />,
    },
    {
      title: "Data Structures",
      description: "Common data structures and their implementations",
      path: "/data-structures",
      icon: <FaDatabase className="text-4xl text-green-400" />,
    },
    {
      title: "Algorithms",
      description: "Popular algorithms and problem-solving techniques",
      path: "/algorithms",
      icon: <FaCode className="text-4xl text-purple-400" />,
    },
    {
      title: "System Design",
      description: "Architecture patterns, scalability, and design principles",
      path: "/system-design",
      icon: <FaSitemap className="text-4xl text-red-400" />,
    },
    {
      title: "Overview",
      description: "General interview preparation and tips",
      path: "/overview",
      icon: <FaBookOpen className="text-4xl text-gray-400" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interview Questions Hub
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={category.title}
          >
            <Link to={category.path} className="no-underline">
              <Card
                className="hover:scale-105 transition-transform duration-200 cursor-pointer h-full"
                shadow="sm"
              >
                <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                  <div className="flex items-center gap-3 w-full">
                    {category.icon}
                    <h2 className="text-xl font-bold text-primary">
                      {category.title}
                    </h2>
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible py-4">
                  <p className="text-gray-600">{category.description}</p>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
