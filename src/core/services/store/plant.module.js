import api from "../api";

// action types
export const FETCH_PLANTS = "fetchPlants";
export const SUBMIT_PLANT = "submitPlant";
export const UPDATE_PLANT = "updatePlant";
export const DELETE_PLANT = "deletePlant";

// mutation types
export const SET_PLANT = "setPlants";

const state = {
  plants: [],
};

const getters = {
  getPlants: (state) => state.plants,
};

const actions = {
  async [FETCH_PLANTS]({ commit }, params) {
    try {
      const { data } = await api.get("/api/plant", {
        params: { company_id: params },
      });
      commit(SET_PLANT, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_PLANT]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/plant", payload);
      return {
        success: true,
        message: "Successfully save plant",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_PLANT]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/plant/${id}`, body);
      return {
        success: true,
        message: "Successfully update plant",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_PLANT]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/plant/${id}`);
      return {
        success: true,
        message: "Successfully delete plant",
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
  [SET_PLANT](state, payloads) {
    state.plants = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
