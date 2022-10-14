// store module to employee
// Path: src/core/services/store/employee.module.js

import api from "../api";

// initial state
const state = {
  employees: [],
  employee: {},
};

// getters
const getters = {
  employees: (state) => state.employees,
  employee: (state) => state.employee,
};

// mutation type
export const SET_EMPLOYEES = "SET_EMPLOYEES";
export const SET_EMPLOYEE = "SET_EMPLOYEE";

// action types
export const FETCH_EMPLOYEES = "FETCH_EMPLOYEES";
export const FETCH_EMPLOYEE = "FETCH_EMPLOYEE";
export const CREATE_EMPLOYEE = "CREATE_EMPLOYEE";
export const IMPORT_EMPLOYEES = "IMPORT_EMPLOYEES";
export const UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE";
export const DELETE_EMPLOYEE = "DELETE_EMPLOYEE";

const actions = {
  async [FETCH_EMPLOYEES]({ commit }) {
    try {
      const { data } = await api.get("/api/employees");
      commit(SET_EMPLOYEES, data.data);
    } catch (error) {
      console.log(error);
    }
  },

  async [FETCH_EMPLOYEE]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/employees/${id}`);
      commit(SET_EMPLOYEE, data);
    } catch (error) {
      console.log(error);
    }
  },

  async [CREATE_EMPLOYEE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/employees", payload);
      return {
        success: true,
        message: "Successfully save Employee",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async [IMPORT_EMPLOYEES]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/employees/import", payload);
      return {
        success: true,
        message: "Successfully import Employee",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async [UPDATE_EMPLOYEE]({ commit }, payload) {
    try {
      const { data } = await api.put(`/api/employees/${payload.id}`, payload);
      return {
        success: true,
        message: "Successfully update Employee",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async [DELETE_EMPLOYEE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/employees/${id}`);
      return {
        success: true,
        message: "Successfully delete Employee",
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
  [SET_EMPLOYEES](state, payloads) {
    state.employees = payloads;
  },
  [SET_EMPLOYEE](state, payload) {
    state.employee = payload;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
