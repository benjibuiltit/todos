import React from "react";
import ReactDOM from "react-dom/client";
import Todos from "@/routes/Todos";
import "@/styles/globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Login } from "./routes/Login.js";
import { SignUp } from "./routes/SignUp.js";
import { redirect } from "react-router-dom";

const authRedirect = async (isPublic: boolean = false) => {
  const token = localStorage.getItem("token");
  if (!token && !isPublic) {
    return redirect("/login");
  }
  if (token && isPublic) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Todos />,
    errorElement: <ErrorPage />,
    loader: () => authRedirect(),
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
    loader: () => authRedirect(true),
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
    loader: () => authRedirect(true),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <main className="h-screen content-center">
        <RouterProvider router={router} />
      </main>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
