import api from "../api";

// action types
export const FETCH_PRODUCT_TYPES = "fetchProductTypes";
export const SUBMIT_PRODUCT_TYPE = "submitProductType";
export const UPDATE_PRODUCT_TYPE = "updateProductType";
export const DELETE_PRODUCT_TYPE = "deleteProductType";

// mutation types
export const SET_PRODUCT_TYPE = "setProductTypes";

const state = {
  productTypes: [],
};

const getters = {
  getProductTypes: (state) => state.productTypes,
};

const actions = {
  async [FETCH_PRODUCT_TYPES]({ commit }, id) {
    try {
      const { data } = await api.get("/api/product-type", {
        params: { line_id: id },
      });
      commit(SET_PRODUCT_TYPE, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_PRODUCT_TYPE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/product-type", payload);
      return {
        success: true,
        message: "Successfully save Product Type",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_PRODUCT_TYPE]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/product-type/${id}`, body);
      return {
        success: true,
        message: "Successfully update Product Type",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_PRODUCT_TYPE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/product-type/${id}`);
      return {
        success: true,
        message: "Successfully delete Product Type",
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
  [SET_PRODUCT_TYPE](state, payloads) {
    state.productTypes = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
