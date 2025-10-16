import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar - Static positioning */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;