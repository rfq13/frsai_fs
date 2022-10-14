import Cookies from "js-cookie";
const KEY = "hrsai_.auth";

const getToken = async function() {
  const token = await Cookies.get(KEY);
  // const token = await window.localStorage.getItem(KEY);
  if (!token || token == "undefined") {
    return "";
  }
  return token.trim();
};

const setToken = function(token) {
  Cookies.set(KEY, token.trim());
  // window.localStorage.setItem(KEY, JSON.stringify(token));
};

const removeToken = function() {
  Cookies.remove(KEY);
  // window.localStorage.removeItem(KEY);
};

export { getToken, setToken, removeToken };
