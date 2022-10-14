import dayjs from "dayjs";
import api from "../api";

// action types
export const FETCH_TPMLEDGERS = "fetchTPMLedgers";
export const FETCH_TPMAPPROVAL = "fetchTPMApproval1";
export const FETCH_MACHINEREVISION = "fetchMachineRevisions";
export const SUBMIT_TPMLEDGER = "submitTPMLedger";
export const REVISE_TPMLEDGER = "reviseTPMLedger";
export const UPDATE_TPMLEDGER = "updateTPMLedger";
export const DELETE_TPMLEDGER = "deleteTPMLedger";
export const GET_TPMLEDGER = "fetchPMLedger";
export const FETCH_TPMLEDGER_APPROVALS = "fetchTPMApproval";
export const FETCH_TPM_REVISION = "fetchTPMRevision";
export const DO_APPROVE = "submitApprove";
export const DO_REJECT = "submitReject";
export const UPLOAD_WRAS = "uploadWras";
export const UPLOAD_JIS = "uploadJis";

// mutation types
export const SET_TPMLEDGERS = "setTPMLedgers";
export const SET_TPMAPPROVALS = "setTPMApprovals";
export const SET_TPMLEDGER = "setTPMLedger";
export const SET_MACHINEREVISIONS = "setMachineRevisions";
export const SET_REVISIONS = "setTPMRevisions";

const state = {
  tpmLedgers: [],
  tpmApprovals: [],
  tpmLedger: [],
  machineRevisions: [],
  revisions: [],
};

const getters = {
  getTpmLedgers: (state) => state.tpmLedgers,
  getTpmApprovals: (state) => state.tpmApprovals,
  getTpmLedger: (state) => state.tpmLedger,
  getMachineRevisions: (state) => state.machineRevisions,
  getRevisions: (state) => state.revisions,
};

const actions = {
  async [FETCH_TPMLEDGERS]({ commit }) {
    try {
      const { data } = await api.get("/api/tpm-ledger");
      commit(
        SET_TPMLEDGERS,
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
  async [FETCH_TPMAPPROVAL]({ commit }) {
    try {
      const { data } = await api.get("/api/tpm-ledger-approval");
      commit(
        SET_TPMAPPROVALS,
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
  async [FETCH_MACHINEREVISION]({ commit }, uuid) {
    try {
      const { data } = await api.get("/api/machines-tpm-ledger/" + uuid);
      commit(SET_MACHINEREVISIONS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_TPMLEDGER]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/tpm-ledger/${id}`);
      commit(SET_TPMLEDGER, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_TPMLEDGER]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/tpm-ledger", payload);
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
  async [REVISE_TPMLEDGER]({ commit }, { uuid, payload }) {
    try {
      const { data } = await api.post(`/api/tpm-ledger-revision`, payload);
      return {
        success: true,
        message: "Successfully revise Ledger Methods",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_TPMLEDGER]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/tpm-ledger/${id}`, body);
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
  async [DELETE_TPMLEDGER]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/tpm-ledger/${id}`);
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
  async [FETCH_TPMLEDGER_APPROVALS]({ commit }) {
    try {
      const { data } = await api.get("/api/tpm-ledger");
      commit(
        SET_TPMLEDGERS,
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
  async [FETCH_TPM_REVISION]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/tpm-ledger-revision/${id}`);
      commit(SET_REVISIONS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [DO_APPROVE]({ commit }, data) {
    try {
      let url = `/api/tpm-ledger/sect-mte-approve/${data.id}`;
      if (data.role == "Section Head PRD") {
        url = `/api/tpm-ledger/sect-prd-approve/${data.id}`;
      }
      if (data.role == "Manager MTE") {
        url = `/api/tpm-ledger/manager-approve/${data.id}`;
      }
      const result = await api.put(url);

      return {
        success: true,
        message: `${data.role} successfully approve`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DO_REJECT]({ commit }, data) {
    try {
      let url = `/api/tpm-ledger/reject/${data.id}`;

      const result = await api.put(url, { reason: data.reason });

      return {
        success: true,
        message: `successfully reject`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPLOAD_JIS]({ commit }, data) {
    try {
      let url = `/item-check/upload-jis`;

      await api.post(url, data);

      return {
        success: true,
        message: `successfully reject`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPLOAD_WRAS]({ commit }, { uuid, body }) {
    try {
      let url = `/api/item-check/upload-wras/${uuid}`;

      const result = await api.put(url, body);

      return {
        success: true,
        message: `successfully upload wras`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};

const mutations = {
  [SET_TPMLEDGERS](state, payloads) {
    state.tpmLedgers = payloads.map((aData) => {
      let status = 0;
      if (
        aData.flg_approve_sect_head_mte == 1 &&
        aData.flg_approve_sect_head_prd == 1 &&
        aData.flg_approve_manager_mte == 1
      ) {
        status = 1;
      }

      return { ...aData, status: status };
    });
  },
  [SET_TPMAPPROVALS](state, payloads) {
    state.tpmApprovals = payloads.map((aData) => {
      let status = 0;
      if (
        aData.flg_approve_sect_head_mte == 1 &&
        aData.flg_approve_sect_head_prd == 1 &&
        aData.flg_approve_manager_mte == 1
      ) {
        status = 1;
      }

      return { ...aData, status: status };
    });
  },
  [SET_MACHINEREVISIONS](state, payloads) {
    state.machineRevisions = payloads;
  },
  [SET_TPMLEDGER](state, payloads) {
    state.tpmLedger = payloads;
  },
  [SET_REVISIONS](state, payloads) {
    state.revisions = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
