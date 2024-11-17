import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "./toast-config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster
      toastOptions={{
        ...toastConfig,
        className: "toastClass",
        duration: 2500,
        icon: "null",
      }}
      position="top-center"
      reverseOrder={false}
    />
  </StrictMode>,
);
