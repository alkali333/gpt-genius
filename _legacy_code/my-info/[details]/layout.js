import Link from "next/link";
import AboutMeTopNav from "/app/components/AboutMeTopNav";

const Layout = ({ children }) => {
  return (
    <>
      <AboutMeTopNav />
      {children}
    </>
  );
};

export default Layout;
