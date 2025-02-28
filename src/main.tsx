import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

import ContextProvider from "./providers/ContextProvider";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContextProvider>
      <Toaster />
      <RouterProvider router={router} />
      {/* <App /> */}
    </ContextProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
