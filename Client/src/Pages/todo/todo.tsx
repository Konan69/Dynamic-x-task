import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Todo = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b">
        <div className="flex-1" /> {/* Spacer */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg">Konan</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 flex flex-col gap-6">
        {/* Create Task Button */}
        <div className="flex justify-end">
          <Button className="bg-[#75F94C] text-black hover:bg-[#75F94C]/90">
            Create Task
          </Button>
        </div>

        {/* Tasks Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* To-do Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">To-do</h2>
              <button className="p-1">⋮</button>
            </div>
            <div className="space-y-2">
              {/* Task Items */}
              <div className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border" />
                  <span>Buy Bitcoin.</span>
                </div>
                <button className="p-1">⋮</button>
              </div>
              {/* More task items... */}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Completed</h2>
              <button className="p-1">⋮</button>
            </div>
            <div className="space-y-2">
              {/* Completed Task Items */}
              <div className="p-3 bg-black/20 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#75F94C]" />
                  <span>Sell ETH.</span>
                </div>
                <button className="p-1">⋮</button>
              </div>
              {/* More completed items... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
