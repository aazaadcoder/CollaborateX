import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// axios interceptors are for req and res as the name suggests they itersept them before they are handelled by then and catch 
API.interceptors.response.use(
  (response) => {
    return response;
  },
  // if the reposonse if of error that is it lies outside 2XX status code
  async (error) => {
    const { data, status } = error.response;
    // if resopnse if of unathorized access redirect the user to home page that is login page 
    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }
    // then we can destructure the error data and return a promise reject which can we handled by catch 
    return Promise.reject({
      ...data,
    });
  }
);

export default API;
