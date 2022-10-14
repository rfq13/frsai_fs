import api from "../api";

// action types
export const FETCH_SHOPS = "fetchShops";
export const SUBMIT_SHOP = "submitShop";
export const UPDATE_SHOP = "updateShop";
export const DELETE_SHOP = "deleteShop";

// mutation types
export const SET_SHOP = "setShops";

const state = {
  shops: [],
};

const getters = {
  getShops: (state) => state.shops,
};

const actions = {
  async [FETCH_SHOPS]({ commit }, id) {
    try {
      const { data } = await api.get("/api/shop", {
        params: { cell_id: id },
      });
      commit(SET_SHOP, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_SHOP]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/shop", payload);
      return {
        success: true,
        message: "Successfully save Shop",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_SHOP]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/shop/${id}`, body);
      return {
        success: true,
        message: "Successfully update Shop",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_SHOP]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/shop/${id}`);
      return {
        success: true,
        message: "Successfully delete Shop",
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
  [SET_SHOP](state, payloads) {
    state.shops = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
