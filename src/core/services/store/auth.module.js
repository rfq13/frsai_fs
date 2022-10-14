import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import api from "../api";
import { getToken } from "../auth.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const PROFILE = "profile";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";
export const SET_PROFILE = "setProfile";

const state = {
  errors: null,
  user: {},
  profile: {},
  isAuthenticated: !!getToken(),
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  getProfile(state) {
    return state.profile;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

const actions = {
  async [LOGIN](context, credentials) {
    try {
      const response = await api.post("/login", credentials);
      localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
      return {
        success: true,
        message: "Berhasil Login",
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [PROFILE]({ commit }) {
    try {
      const { data } = await api.get("/api/profile");
      commit(SET_AUTH, data.data);
      commit(SET_PROFILE, data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      return {
        success: true,
        message: "Berhasil Login",
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  [LOGOUT](context) {
    localStorage.removeItem("user");
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve) => {
      ApiService.post("login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [VERIFY_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.get("verify")
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiService.put("password", password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_PROFILE](state, payload) {
    state.profile = payload;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
