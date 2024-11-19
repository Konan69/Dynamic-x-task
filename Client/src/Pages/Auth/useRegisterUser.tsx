import { postRequest } from "../../lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import toast from "react-hot-toast";

const useRegisterUser = () => {
  const registerUser = async (data: User) => {
    const url = "register";
    const response = await postRequest(url, data);
    return response.data;
  };

  const { mutate: registerUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("sign-up successful");
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "sign-up failed, please try again");
    },
  });

  return { registerUserMutation, isPending };
};

export default useRegisterUser;
