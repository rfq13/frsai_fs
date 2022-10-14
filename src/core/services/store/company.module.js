import api from "../api";

// action types
export const FETCH_COMPANIES = "fetchCompanies";
export const SUBMIT_COMPANY = "submitCompany";
export const UPDATE_COMPANY = "updateCompany";
export const DELETE_COMPANY = "deleteCompany";

// mutation types
export const SET_COMPANY = "setCompanies";

const state = {
  companies: [],
};

const getters = {
  getCompanies: (state) => state.companies,
};

const actions = {
  async [FETCH_COMPANIES]({ commit }) {
    try {
      const { data } = await api.get("/api/company");
      commit(SET_COMPANY, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_COMPANY]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/company", payload);
      return {
        success: true,
        message: "Successfully save company",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_COMPANY]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/company/${id}`, body);
      return {
        success: true,
        message: "Successfully update company",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_COMPANY]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/company/${id}`);
      return {
        success: true,
        message: "Successfully delete company",
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
  [SET_COMPANY](state, payloads) {
    state.companies = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
