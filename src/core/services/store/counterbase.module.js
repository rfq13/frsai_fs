import dayjs from "dayjs";
import api from "../api";

// action types
export const FETCH_COUNTERBASES = "fetchCounterBases";
export const SUBMIT_COUNTERBASE = "submitCounterbase";
export const UPDATE_COUNTERBASE = "updateCounterbase";
export const DELETE_COUNTERBASE = "deleteCounterbase";

// mutation types
export const SET_COUNTERBASE = "setCounterBases";

const state = {
  counterBases: [],
};

const getters = {
  getCounterbases: (state) => state.counterBases,
};

const actions = {
  async [FETCH_COUNTERBASES]({ commit }, id) {
    try {
      let params = { division_id: id };

      if (typeof id === "object") {
        params = id;
      }

      const { data } = await api.get("/api/counterbase", {
        params,
      });
      commit(SET_COUNTERBASE, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_COUNTERBASE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/counterbase", payload);
      return {
        success: true,
        message: "Successfully save Counterbase",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_COUNTERBASE]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/counterbase/${id}`, body);
      return {
        success: true,
        message: "Successfully update Counterbase",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_COUNTERBASE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/counterbase/${id}`);
      return {
        success: true,
        message: "Successfully delete Counterbase",
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
  [SET_COUNTERBASE](state, payloads) {
    state.counterBases = payloads.map(p => ({...p, date: dayjs(p.date).format("YYYY-MM-DD")}));
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
