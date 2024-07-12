import SideBar from "../components/SideBar";
import { FaBarsStaggered } from "react-icons/fa6";

const layout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input type="checkbox" id="my-drawer-2" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-2"
          className="drawer-button lg:hidden fixed top-6 right-6"
        >
          <FaBarsStaggered className="w-8 h-8 text-primary" />
        </label>
        <div className="bg-base-100 px-8 py-12 min-h-screen">{children}</div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <SideBar />
      </div>
    </div>
  );
};

export default layout;
