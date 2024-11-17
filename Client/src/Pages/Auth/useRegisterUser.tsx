import { useState } from "react";
import { getRequest } from "../../lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";

const useRegisterUser = () => {
  const [] = useState<User>();

  const registerUser = async () => {
    const url = "";
    const response = await getRequest(url);
    return response.data;
  };

  const { mutate: registerUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      return data;
    },
    onError: () => {},
  });

  return { registerUserMutation, isPending };
};

export default useRegisterUser;
