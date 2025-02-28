import { createBrowserRouter, RouteObject } from "react-router-dom";

import Home from "@/Home/Home";
import QuestionsRoot from "../components/QuestionsRoot";
import Root from "@/components/Root";
import JavaScriptQuestions from "@/pages/JavaScript/JavaScriptQuestions";

// Define the type for AllRoutes
const AllRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Home />,
        },

        {
          path: "/javascript",
          element: <JavaScriptQuestions />,
        },
      ],
    },
  ] as RouteObject[]); // Explicitly define the route object type

  return routes;
};

const router = AllRoutes();

export default router;
