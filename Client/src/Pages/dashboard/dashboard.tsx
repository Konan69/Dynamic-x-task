import { Sidebar } from "@/components/sidebar";
import { Todo } from "../todo";

export const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Todo />
      </main>
    </div>
  );
};
