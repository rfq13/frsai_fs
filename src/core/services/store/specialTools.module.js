import api from "../api";

// action types
export const FETCH_SPECIALTOOLS = "fetchSpecialTools";
export const SUBMIT_SPECIALTOOL = "submitSpecialTool";
export const UPDATE_SPECIALTOOL = "updateSpecialTool";
export const DELETE_SPECIALTOOL = "deleteSpecialTool";
export const IMPORT_SPECIALTOOLS = "importSpecialTool";

// mutation types
export const SET_SPECIALTOOL = "setSpecialTool";

const state = {
  specialTools: [],
};

const getters = {
  getSpecialTools: (state) => state.specialTools,
};

const actions = {
  async [FETCH_SPECIALTOOLS]({ commit }) {
    try {
      const { data } = await api.get("/api/special-tool");
      commit(SET_SPECIALTOOL, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_SPECIALTOOL]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/special-tool", payload);
      return {
        success: true,
        message: "Successfully save Special Tool",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_SPECIALTOOL]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/special-tool/${id}`, body);
      return {
        success: true,
        message: "Successfully update Special Tool",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_SPECIALTOOL]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/special-tool/${id}`);
      return {
        success: true,
        message: "Successfully delete Special Tool",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [IMPORT_SPECIALTOOLS]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/special-tool/import", payload);
      return {
        success: true,
        message: "Successfully Import Special Tools",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response
          ? error.response.data.errorMessage
          : error.message,
      };
    }
  },
};

const mutations = {
  [SET_SPECIALTOOL](state, payloads) {
    state.specialTools = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
