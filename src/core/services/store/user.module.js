import api from "../api";

// action types
export const FETCH_USERS = "fetchUsers";
export const SUBMIT_USER = "submitUser";
export const UPDATE_USER = "updateUser";
export const DELETE_USER = "deleteUser";
export const SUBMIT_NOTIF = "setNotifUser";

// mutation types
export const SET_USER = "setUsers";
export const SET_ALLUSER = "setAllUsers";
export const SET_ADMIN = "setAdmins";
export const SET_NOTIF = "setNotifs";

const state = {
  users: [],
  admins: [],
  all: [],
};

const getters = {
  getUsers: (state) => state.users,
  getAdmins: (state) => state.admins,
  getAllUser: (state) => state.all,
};

const objectToQueryString = (obj) => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

const actions = {
  async [FETCH_USERS]({ commit }, params = {}) {
    try {
      const { data } = await api.get(
        "/api/users?" + objectToQueryString(params)
      );
      commit(SET_ALLUSER, data.data);
      commit(
        SET_USER,
        data.data.filter((u) => u.RoleName != "Admin")
      );
      commit(
        SET_ADMIN,
        data.data.filter((u) => u.RoleName == "Admin")
      );
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_NOTIF]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/user/notif/setting", payload);
      return {
        success: true,
        message: "Successfully save User",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [SUBMIT_USER]({ commit }, payload) {
    try {
      let url = "/api/users";
      let method = "post";
      if (payload?.id) {
        url = `/api/users/${payload.id}`;
        method = "put";
      }
      const { data } = await api[method](url, payload);
      return {
        success: true,
        message: "Successfully save User",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_USER]({ commit }, payload) {
    try {
      const { data } = await api.put("/api/users/" + payload.id, payload);
      return {
        success: true,
        message: "Successfully update User",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_USER]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/users/${id}`);
      return {
        success: true,
        message: "Successfully delete User",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
};

const mutations = {
  [SET_USER](state, payloads) {
    state.users = payloads;
  },
  [SET_ALLUSER](state, payloads) {
    state.all = payloads;
  },
  [SET_ADMIN](state, payloads) {
    state.admins = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
