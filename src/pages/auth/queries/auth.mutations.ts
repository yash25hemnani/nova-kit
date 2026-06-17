import apiClient from "@/api/apiClient";

export const loginMutation = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post("/auth/login/", data);
  return res.data;
};
