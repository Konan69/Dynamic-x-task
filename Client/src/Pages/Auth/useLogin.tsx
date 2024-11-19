import { postRequest } from "../../lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const isDevelopment = process.env.NODE_ENV === "development";

const useRegisterUser = () => {
  const navigate = useNavigate();
  const registerUser = async (data: Partial<User>) => {
    const url = "auth/login";
    const response = await postRequest(url, data);
    return response;
  };

  const { mutate: loginUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Login Successful");
      console.log(data);
      Cookies.set("authToken", data.token, {
        expires: 1, // 1 day
        secure: isDevelopment,
        sameSite: "lax",
      });
      navigate("/dashboard");
      return data;
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(
        error.response.data.message || "Login failed, please try again",
      );
    },
  });

  return { loginUserMutation, isPending };
};

export default useRegisterUser;
