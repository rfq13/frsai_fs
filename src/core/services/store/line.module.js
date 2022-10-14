import api from "../api";

// action types
export const FETCH_LINES = "fetchLines";
export const SUBMIT_LINE = "submitLine";
export const UPDATE_LINE = "updateLine";
export const DELETE_LINE = "deleteLine";

// mutation types
export const SET_LINE = "setLines";

const state = {
  lines: [],
};

const getters = {
  getLines: (state) => state.lines,
};

const actions = {
  async [FETCH_LINES]({ commit }, id) {
    try {
      const { data } = await api.get("/api/line", {
        params: { department_id: id },
      });
      commit(SET_LINE, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_LINE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/line", payload);
      return {
        success: true,
        message: "Successfully save Line",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_LINE]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/line/${id}`, body);
      return {
        success: true,
        message: "Successfully update Line",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_LINE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/line/${id}`);
      return {
        success: true,
        message: "Successfully delete Line",
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
  [SET_LINE](state, payloads) {
    state.lines = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
