import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load pages
const BoardsPage = lazy(() => import("@/components/pages/BoardsPage.jsx"));
const BoardDetailPage = lazy(() => import("@/components/pages/BoardDetailPage.jsx"));
const PostDetailPage = lazy(() => import("@/components/pages/PostDetailPage.jsx"));
const AdminBoardsPage = lazy(() => import("@/components/pages/AdminBoardsPage.jsx"));
const RoadmapPage = lazy(() => import("@/components/pages/RoadmapPage.jsx"));
const ChangelogPage = lazy(() => import("@/components/pages/ChangelogPage.jsx"));
const AdminChangelogsPage = lazy(() => import("@/components/pages/AdminChangelogsPage.jsx"));
const NotFound = lazy(() => import("@/components/pages/NotFound.jsx"));
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<div>Loading.....</div>}><BoardsPage /></Suspense>
  },
  {
    path: "roadmap",
    element: <Suspense fallback={<div>Loading.....</div>}><RoadmapPage /></Suspense>
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
    path: "changelog",
    element: <Suspense fallback={<div>Loading.....</div>}><ChangelogPage /></Suspense>
  },
  {
    path: "admin/changelogs",
    element: <Suspense fallback={<div>Loading.....</div>}><AdminChangelogsPage /></Suspense>
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