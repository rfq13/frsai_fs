import api from "../api";

// action types
export const FETCH_SPAREPARTS = "fetchSpareParts";
export const SUBMIT_SPAREPART = "submitSparePart";
export const UPDATE_SPAREPART = "updateSparePart";
export const DELETE_SPAREPART = "deleteSparePart";
export const IMPORT_SPAREPARTS = "importSparePart";

// mutation types
export const SET_SPAREPART = "setSparePart";

const state = {
  spareParts: [],
};

const getters = {
  getSpareParts: (state) => state.spareParts,
};

const actions = {
  async [FETCH_SPAREPARTS]({ commit }) {
    try {
      const { data } = await api.get("/api/spare-part");
      commit(SET_SPAREPART, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_SPAREPART]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/spare-part", payload);
      return {
        success: true,
        message: "Successfully save Sparepart",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_SPAREPART]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/spare-part/${id}`, body);
      return {
        success: true,
        message: "Successfully update Sparepart",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_SPAREPART]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/spare-part/${id}`);
      return {
        success: true,
        message: "Successfully delete Sparepart",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [IMPORT_SPAREPARTS]({ commit }, body) {
    try {
      const { data } = await api.post(`/api/spare-part/import`, body);
      return {
        success: true,
        message: "Successfully Import Sparepart",
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
  [SET_SPAREPART](state, payloads) {
    state.spareParts = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
