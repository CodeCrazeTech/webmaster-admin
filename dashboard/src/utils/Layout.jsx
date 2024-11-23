import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Layout = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="content px-8">
        <Topbar />
        <div>{<Outlet />}</div>
      </main>
    </div>
  );
};

export default Layout;