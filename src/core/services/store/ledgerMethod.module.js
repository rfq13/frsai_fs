import api from "../api";

// action types
export const FETCH_LEDGERMETHODS = "fetchLedgerMethod";
export const SUBMIT_LEDGERMETHOD = "submitLedgerMethod";
export const UPDATE_LEDGERMETHOD = "updateLedgerMethod";
export const DELETE_LEDGERMETHOD = "deleteLedgerMethod";

// mutation types
export const SET_LEDGERMETHODS = "setLedgerMethod";

const state = {
  ledgerMethods: [],
};

const getters = {
  getLedgerMethod: (state) => state.ledgerMethods,
};

const actions = {
  async [FETCH_LEDGERMETHODS]({ commit }) {
    try {
      const { data } = await api.get("/api/ledger-method");
      commit(SET_LEDGERMETHODS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_LEDGERMETHOD]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/ledger-method", payload);
      return {
        success: true,
        message: "Successfully save Ledger Methods",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_LEDGERMETHOD]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/ledger-method/${id}`, body);
      return {
        success: true,
        message: "Successfully update Ledger Methods",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_LEDGERMETHOD]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/ledger-method/${id}`);
      return {
        success: true,
        message: "Successfully delete Ledger Methods",
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
  [SET_LEDGERMETHODS](state, payloads) {
    state.ledgerMethods = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
