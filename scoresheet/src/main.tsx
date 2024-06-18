import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Config from "./Config";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/config",
    element: <Config />,
  },
]);

const domNode = document.getElementById('root')!;
ReactDOM.createRoot(domNode).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);