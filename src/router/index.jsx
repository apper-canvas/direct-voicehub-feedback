import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout.jsx";

// Lazy load pages
const BoardsPage = lazy(() => import("@/components/pages/BoardsPage.jsx"));
const BoardDetailPage = lazy(() => import("@/components/pages/BoardDetailPage.jsx"));
const PostDetailPage = lazy(() => import("@/components/pages/PostDetailPage.jsx"));
const AdminBoardsPage = lazy(() => import("@/components/pages/AdminBoardsPage.jsx"));
const NotFound = lazy(() => import("@/components/pages/NotFound.jsx"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<div>Loading.....</div>}><BoardsPage /></Suspense>
  },
  {
    path: "boards/:boardId",
    element: <Suspense fallback={<div>Loading.....</div>}><BoardDetailPage /></Suspense>
  },
  {
    path: "posts/:postId",
    element: <Suspense fallback={<div>Loading.....</div>}><PostDetailPage /></Suspense>
  },
  {
    path: "admin/boards",
    element: <Suspense fallback={<div>Loading.....</div>}><AdminBoardsPage /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<div>Loading.....</div>}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);