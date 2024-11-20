import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useUserStore from "@/store/UserStore";

export const Header = () => {
  const { user } = useUserStore();
  return (
         <header className=" w-full flex justify-between px-[20px] py-6 items-center border-b border-baseborder">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span className="font-medium text-lg text-white">{user?.username}</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
  )
}

