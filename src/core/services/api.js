import axios from "axios";
import constant from "../../../constant";
import { getToken, removeToken } from "./auth.service";
// 103.191.92.103:3000
const api = axios.create({
  baseURL: constant.BASE_API_URL,
});

api.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    return { ...config, headers: { "x-token": `${token}` } };
  },
  function (error) {
    return error;
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      removeToken();
      return (window.location = "#/login");
    }
    throw error; // to catch error in vuex action
  }
);

export default api;
