// import { ResponsiveSidebar } from "./ResponsiveSidebar";
import { ResponsiveSidebar } from "./ResponsiveSidebar";
import { Sidebar } from "./Sidebar";

export const Navigation = () => {
  return (
    <>
      <ResponsiveSidebar />
      <div className="hidden h-screen lg:block">
        <Sidebar />
      </div>
    </>
  );
};
