import api from "../api";

// action types
export const FETCH_JIS = "fetchJis";
export const GET_JIS_BY_PLANNING = "fetchJisByPlan";
export const SUBMIT_JIS = "submitJis";
export const UPDATE_JIS = "updateJis";
export const DELETE_JIS = "deleteJis";

// mutation types
export const SET_JIS = "setJis";
export const SET_JIS_BY_PLANNING = "setJisByPlan";

const state = {
  jis: [],
  jisbp: [],
};

const getters = {
  getJis: (state) => state.jis,
  getJisBp: (state) => state.jisbp,
};

const actions = {
  async [FETCH_JIS]({ commit }) {
    try {
      const { data } = await api.get("/api/jis");
      commit(SET_JIS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_JIS_BY_PLANNING]({ commit }, id_tpm_planning) {
    try {
      const { data } = await api.get(
        "/api/tpm-execution-jis/" + id_tpm_planning
      );
      commit(SET_JIS_BY_PLANNING, data.data[0].item_check.jises);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_JIS]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/jis", payload);
      return {
        success: true,
        message: "Successfully save JIS",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_JIS]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/jis/${id}`, body);
      return {
        success: true,
        message: "Successfully update JIS",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_JIS]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/jis/${id}`);
      return {
        success: true,
        message: "Successfully delete JIS",
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
  [SET_JIS](state, payloads) {
    state.jis = payloads;
  },
  [SET_JIS_BY_PLANNING](state, payloads) {
    state.jisbp = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
