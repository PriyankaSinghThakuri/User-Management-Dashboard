import AxiosInstance from "@/api";

const useAPI = () => {
  const getUsers = async (endpoint: string) => {
    try {
      const response = await AxiosInstance.get(endpoint);
      return {
        data: response.data,  
        error: null,
        success: true,
        message: "Fetch users success",
      };
    } catch (error: any) {
      return {
        data: null,
        error: error?.response?.data?.message || "Fetch users failed",
        success: false,
        message: "Fetch users failed",
      };
    }
  };

  const getUserById = async (endpoint: string, id: string) => {
    try {
      const response = await AxiosInstance.get(`${endpoint}/${id}`);
      return {
        data: response.data,
        error: null,
        success: true,
        message: "Fetch user by ID success",
      };
    } catch (error: any) {
      return {
        data: null,
        error: error?.response?.data?.message || "Fetch user by ID failed",
        success: false,
        message: "Fetch user by ID failed",
      };
    }
  };

 
  const updateUser = async (endpoint: string, id: string, updateData: any) => {
    try {
      const response = await AxiosInstance.put(`${endpoint}/${id}`, updateData);
      return {
        data: response.data,
        error: null,
        success: true,
        message: "Update user success",
      };
    } catch (error: any) {
      return {
        data: null,
        error: error?.response?.data?.message || "Update user failed",
        success: false,
        message: "Update user failed",
      };
    }
  };

  return {
    getUsers,
    getUserById,
    updateUser,
  };
};

export default useAPI;
