import { getAuthRequest, patchAuthRequest, postAuthRequest } from "../../lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";
import toast from "react-hot-toast";

const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getAuthRequest("tasks");
      return response.tasks;
    },
  });
};

const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const response = await postAuthRequest("tasks/create", task);
      return response.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      console.log(error);
      toast.error("Failed to create task");
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
    const {mutate: updateTaskMutation} = useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const response = await patchAuthRequest("tasks", {
        taskId: task.uuid,
        status: task.status,
        title: task.title
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
  return { updateTaskMutation };
};

export { useGetTasks, useCreateTask, useUpdateTask };
