import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import Root from "./pages/root";
import { AddTask, action as createAction } from "./pages/add-task";
import { Homepage, loader as tasksLoader } from "./pages/homepage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Homepage />} loader={tasksLoader} />
      <Route path="/add" element={<AddTask />} action={createAction} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  </StrictMode>
);
