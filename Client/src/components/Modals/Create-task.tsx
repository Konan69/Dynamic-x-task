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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateTask } from "@/Pages/todo/useTodo";

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "Todo", label: "Todo" },
  { value: "In-Progress", label: "In-Progress" },
  { value: "Done", label: "Done" },
] as const;

export const CreateTask = () => {
  const [status, setStatus] = useState<string>("Todo");
  const [title, setTitle] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { mutate } = useCreateTask();

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status);
  const isFormValid = title.trim() !== "" && status !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    mutate(
      { title, status },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setStatus("Todo");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#75F94C] text-black hover:bg-[#75F94C]/90">
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[425px] border-baseborder bg-baseform/95 p-4 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            Create A New Task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="title" className="text-left sm:text-right text-white">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full sm:col-span-3 text-white bg-baseform"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="status" className="text-left sm:text-right text-white">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:col-span-3 text-white bg-baseform">
                <SelectValue>
                  {selectedStatus ? selectedStatus.label : "Select a status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-white bg-baseform">
                <SelectGroup>
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
            disabled={!isFormValid}
            style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
