import axios from "axios";

export const axiosClient = (token?: string) => {
  const instance = axios.create({
    headers: {
      "content-type": "application/json",
    },
  });
  instance.interceptors.request.use(
    async function (config) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    async function (error) {
      return Promise.reject(error);
    }
  );
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
