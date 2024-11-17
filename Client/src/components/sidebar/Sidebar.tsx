import { Home, Logout, SportX } from "@/assets";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const nav = useNavigate();
  const path = location?.pathname;

  const handleLogout = () => {
    // Cookies.remove("ttk");
    toast.loading("Logging Out");
    setTimeout(() => {
      nav(0);
    }, 1000);
  };

  return (
    <aside className="relative flex flex-col w-36 min-h-screen flex-shrink-0 border-r border-[#75F94C1A] bg-baseform/30 ">
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full border-b px-[20px] py-[30px] border-[#75F94C1A] ">
        <img src={SportX} />
      </section>
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full px-[30px] py-[30px] ">
        <div className="flex rounded-lg bg-btn justify-center items-center h-[80px]">
          <img src={Home} className="w-[60%]" />
        </div>
      </section>
      <div className="mt-auto">
        <img
          src={Logout}
          className="cursor-pointer p-12"
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};
