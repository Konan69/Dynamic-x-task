import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "./toast-config";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(

    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster
        toastOptions={{
          ...toastConfig,
          className: " bg-black text-white ",
          duration: 2500,
          icon: null,
        }}
        position="top-center"
        reverseOrder={false}
      />
    </QueryClientProvider>

);
