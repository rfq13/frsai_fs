import api from "../api";

// action types
export const FETCH_DIVISIONS = "fetchDivisions";
export const SUBMIT_DIVISION = "submitDivision";
export const UPDATE_DIVISION = "updateDivision";
export const DELETE_DIVISION = "deleteDivision";

// mutation types
export const SET_DIVISION = "setDivisions";

const state = {
  divisions: [],
};

const getters = {
  getDivisions: (state) => state.divisions,
};

const actions = {
  async [FETCH_DIVISIONS]({ commit }, params) {
    try {
      const { data } = await api.get("/api/division", {
        params: {
          plant_id: params,
        },
      });
      commit(SET_DIVISION, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_DIVISION]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/division", payload);
      return {
        success: true,
        message: "Successfully save division",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_DIVISION]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/division/${id}`, body);
      return {
        success: true,
        message: "Successfully update division",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_DIVISION]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/division/${id}`);
      return {
        success: true,
        message: "Successfully delete division",
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
  [SET_DIVISION](state, payloads) {
    state.divisions = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
