import { Home, Logout, SportX } from "@/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Sidebar = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    try {
      toast.loading("Logged Out");
      Cookies.remove("authToken");
      nav('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <aside className="relative flex flex-col w-[121px] min-h-screen flex-shrink-0 border-r border-baseborder bg-baseform/30 ">
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full border-b px-[20px] py-8 border-baseborder ">
        <img src={SportX} />
      </section>
      <section className="flex flex-col gap-8 max-h-max overflow-scroll w-full px-[30px] py-[30px] ">
        <div className="flex rounded-lg bg-btn justify-center items-center h-[60px]">
          <img src={Home} className="w-[50%]" />
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
