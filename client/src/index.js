import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

//Page paths
import Layout from "./components/Layout";
import UserProfile from "./pages/UserProfile";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import CategoryPosts from "./pages/CategoryPosts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Authors from "./pages/Authors";
import PostDetail from "./pages/PostDetail";
import Home from "./pages/Home";
import AuthorPosts from "./pages/AuthorPosts";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import Logout from "./pages/Logout";
import UserProvider from "./context/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "authors", element: <Authors /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
