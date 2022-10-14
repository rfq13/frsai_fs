import dayjs from "dayjs";
import api from "../api";

// action types
export const FETCH_TPMFINDINGS = "fetchTPMFindings";
export const SUBMIT_TPMFINDING = "submitTPMFinding";
export const UPDATE_TPMFINDING = "updateTPMFinding";
export const UPDATE_PROGRESS_TPMFINDING = "updateProgressTPMFinding";
export const DELETE_TPMFINDING = "deleteTPMFinding";
export const GET_TPMFINDING = "fetchPMLedger";
export const FETCH_TPMFINDING_APPROVALS = "fetchTPMApproval";

// mutation types
export const SET_TPMFINDINGS = "setTPMFindings";
export const SET_TPMFINDING = "setTPMFinding";

const state = {
  TPMFindings: [],
  TPMFinding: [],
};

const getters = {
  getTPMFindings: (state) => state.TPMFindings,
  getTPMFinding: (state) => state.TPMFinding,
};

const actions = {
  async [FETCH_TPMFINDINGS]({ commit }, { year, line }) {
    try {
      console.log(year);
      console.log(line);
      const { data } = await api.get(`/api/tpm-finding/${year}/${line}`);
      commit(
        SET_TPMFINDINGS,
        data.data.map((aData) => ({
          ...aData,
          planning_at: dayjs(aData.planning_at).format("YYYY-MM-DD HH:mm"),
          actual_at: dayjs(aData.actual_at).format("YYYY-MM-DD HH:mm"),
          created_at: dayjs(aData.created_at).format("YYYY-MM-DD HH:mm"),
        }))
      );
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_TPMFINDING]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/tpm-finding/${id}`);
      commit(SET_TPMFINDING, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_TPMFINDING]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/tpm-finding", payload);
      return {
        success: true,
        message: "Successfully save Finding",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_TPMFINDING]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/tpm-finding/${id}`, body);
      return {
        success: true,
        message: "Successfully update Finding",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_PROGRESS_TPMFINDING]({ commit }, { type, id, body }) {
    try {
      let url = `/api/tpm-finding/progress/${id}`;
      if (type == "done") {
        url = `/api/tpm-finding/done/${id}`;
      }
      const { data } = await api.put(url, body);
      return {
        success: true,
        message: "Successfully update Finding",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_TPMFINDING]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/tpm-finding/${id}`);
      return {
        success: true,
        message: "Successfully delete TPM Finding",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FETCH_TPMFINDING_APPROVALS]({ commit }) {
    try {
      const { data } = await api.get("/api/tpm-finding");
      commit(
        SET_TPMFINDINGS,
        data.data.map((aData) => ({
          ...aData,
          modified_at: dayjs(aData.modified_at).format("YYYY-MM-DD HH:mm"),
        }))
      );
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
};

const mutations = {
  [SET_TPMFINDINGS](state, payloads) {
    state.TPMFindings = payloads;
  },
  [SET_TPMFINDING](state, payloads) {
    state.TPMFinding = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
