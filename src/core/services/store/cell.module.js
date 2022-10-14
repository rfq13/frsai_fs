import api from "../api";

// action types
export const FETCH_CELLS = "fetchCells";
export const SUBMIT_CELL = "submitCell";
export const UPDATE_CELL = "updateCell";
export const DELETE_CELL = "deleteCell";
export const SUBMIT_CELL_PIC = "submitCellPic";

// mutation types
export const SET_CELL = "setCells";

const state = {
  cells: [],
};

const getters = {
  getCells: (state) => state.cells,
};

const actions = {
  async [FETCH_CELLS]({ commit }, id) {
    try {
      const { data } = await api.get("/api/cell", {
        params: { line_id: id },
      });
      commit(SET_CELL, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_CELL]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/cell", payload);
      return {
        success: true,
        message: "Successfully save Cell",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [SUBMIT_CELL_PIC]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/cell/assign-pic", payload);
      return {
        success: true,
        message: "Successfully save Cell PIC",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_CELL]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/cell/${id}`, body);
      return {
        success: true,
        message: "Successfully update Cell",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_CELL]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/cell/${id}`);
      return {
        success: true,
        message: "Successfully delete Cell",
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
  [SET_CELL](state, payloads) {
    state.cells = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
