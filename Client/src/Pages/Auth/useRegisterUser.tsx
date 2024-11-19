import { postRequest } from "../../lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useRegisterUser = () => {
  const navigate = useNavigate();
  const registerUser = async (data: User) => {
    const url = "auth/register";
    const response = await postRequest(url, data);
    return response.data;
  };

  const { mutate: registerUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Signed up successfully, Please login to continue");
      navigate("/login");
      return data;
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message || "sign-up failed, please try again",
      );
    },
  });

  return { registerUserMutation, isPending };
};

export default useRegisterUser;
