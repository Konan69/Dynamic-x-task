import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useUserStore from "@/store/UserStore"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar/"

export const Header = () => {
  const { user } = useUserStore();
  return (
    <header className="w-full flex justify-between px-3 md:px-[20px] py-4 md:py-6 items-center border-b border-baseborder">
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-baseform/30">
              <Menu className=" w-12 h-12 text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[100px] p-0 bg-baseform/30 border-r-0 border-baseborder">
            <Sidebar isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 md:gap-4">
        <span className="font-medium text-sm md:text-lg text-white truncate max-w-[120px] md:max-w-none">
          {user?.username}
        </span>
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

