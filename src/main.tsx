import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Router from "./router";
import "./index.css";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #1e293b",
            fontSize: "0.85rem"
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#020617"
            }
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#020617"
            }
          }
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
