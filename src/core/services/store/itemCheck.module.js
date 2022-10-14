import dayjs from "dayjs";
import api from "../api";

// action types
export const GET_ITEMCHECKS = "getItemChecks";
export const GET_ITEMCHECK = "getItemCheck";
export const SUBMIT_ITEMCHECK = "submitItemCheck";

// mutation types
export const SET_ITEMCHECKS = "setItemChecks";
export const SET_ITEMCHECK = "setItemCheck";

const state = {
  ItemCheck: {},
  ItemChecks: [],
};

const getters = {
  getItemChecks: (state) => state.ItemChecks,
  getItemCheck: (state) => state.ItemCheck,
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
  async [GET_ITEMCHECKS]({ commit }, params = {}) {
    try {
      const { data } = await api.get(
        `/api/item-check/${objectToQueryString(params)}`
      );
      commit(SET_ITEMCHECKS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_ITEMCHECK]({ commit }, item_check_id) {
    try {
      const { data } = await api.get(`/api/item-check/${item_check_id}`);
      commit(SET_ITEMCHECK, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },

  async [SUBMIT_ITEMCHECK]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/item-check/", payload);
      return {
        success: true,
        message: "Successfully submit item check",
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
  [SET_ITEMCHECKS](state, payloads) {
    state.ItemChecks = payloads;
  },
  [SET_ITEMCHECK](state, payload) {
    state.ItemCheck = payload;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
