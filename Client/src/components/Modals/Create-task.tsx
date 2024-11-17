import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "todo", label: "Todo" },
  { value: "inProgress", label: "In Progress" },
  { value: "done", label: "Done" },
] as const;

export const CreateTask = () => {
  const [status, setStatus] = useState<string>("Todo");
  const [title, setTitle] = useState<string>("");

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status);

  const handleSubmit = () => {
    // TODO: Implement task creation
    console.log({ title, status });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#75F94C] text-black hover:bg-[#75F94C]/90">
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-baseborder bg-black p-8">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            Create A New Task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-white">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 text-white bg-baseform"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right text-white">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3 text-white bg-baseform">
                <SelectValue>
                  {selectedStatus ? selectedStatus.label : "Select a status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-white bg-baseform">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="">
          <Button
            className="bg-btn text-black"
            onClick={handleSubmit}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
