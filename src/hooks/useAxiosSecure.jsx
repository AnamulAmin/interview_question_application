import axios from "axios";
export const axiosSecure = axios.create({
  // baseURL: backendUrl ? backendUrl : "https://king-prawn-app-qkhg8.ondigitalocean.app/api",
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  // timeout: 30000
});
const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
