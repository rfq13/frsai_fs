import api from "../api";

// action types
export const FETCH_ROLES = "fetchRoles";

export const SET_ROLES = "setRoles";

const state = {
  roles: [],
};

const getters = {
  getRoles: (state) => state.roles,
};

const actions = {
  async [FETCH_ROLES]({ commit }) {
    try {
      const { data } = await api.get("/api/role");
      commit(SET_ROLES, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
};
const mutations = {
  [SET_ROLES](state, payloads) {
    state.roles = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
