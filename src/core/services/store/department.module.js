import api from "../api";

// action types
export const FETCH_DEPARTMENTS = "fetchDepartments";
export const SUBMIT_DEPARTMENT = "submitDepartment";
export const UPDATE_DEPARTMENT = "updateDepartment";
export const DELETE_DEPARTMENT = "deleteDepartment";

// mutation types
export const SET_DEPARTMENT = "setDepartments";

const state = {
  departments: [],
};

const getters = {
  getDepartments: (state) => state.departments,
};

const actions = {
  async [FETCH_DEPARTMENTS]({ commit }, id) {
    try {
      let params = { division_id: id };

      if (typeof id === "object") {
        params = id;
      }

      const { data } = await api.get("/api/department", {
        params,
      });
      commit(SET_DEPARTMENT, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_DEPARTMENT]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/department", payload);
      return {
        success: true,
        message: "Successfully save Department",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_DEPARTMENT]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/department/${id}`, body);
      return {
        success: true,
        message: "Successfully update Department",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_DEPARTMENT]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/department/${id}`);
      return {
        success: true,
        message: "Successfully delete Department",
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
  [SET_DEPARTMENT](state, payloads) {
    state.departments = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
