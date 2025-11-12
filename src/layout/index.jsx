import Sidebar from "../components/sidebar";

const Layout = ({ role = "admin", children }) => {
  return (
    <div>
      <div className="hidden lg:block w-52 fixed top-0 left-0 h-full bg-white shadow-md z-10">
        <Sidebar role={role} />
      </div>

      <div className="lg:hidden w-full">
        <Sidebar role={role} />
      </div>

      <main className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0 bg-gray-50 min-h-screen">
        <div className="w-full p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;