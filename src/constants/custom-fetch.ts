import axios from "axios";

export const axiosClient = (token?: string) => {
  const instance = axios.create({
    headers: {
      "content-type": "application/json",
    },
  });
  
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      return error.response;
    }
  );
  return instance;
};
