import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import "./demos/ipc";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div></div>
);

postMessage({ payload: "removeLoading" }, "*");
