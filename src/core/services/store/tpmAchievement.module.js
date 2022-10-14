import api from "../api";

// action types
export const ACHIEVEMENT_SHOP = "fetchAchievementShop";
export const ACHIEVEMENT_LINE = "fetchAchievementLine";

export const MH_SHOP = "fetchMHShop";
export const MH_LINE = "fetchMHLine";

export const FINDING_SHOP = "fetchFindingShop";
export const FINDING_LINE = "fetchFindingLine";

// mutation types
export const SET_DATA = "setData";

const state = {
  achievementShop: [],
  achievementLine: [],
  mhShop: [],
  mhLine: [],
  findingShop: [],
  findingLine: [],
};

const getters = {
  getAchievementShop: (state) => state.achievementShop,
  getAchievementLine: (state) => state.achievementLine,
  getMhShop: (state) => state.mhShop,
  getMhLine: (state) => state.mhLine,
  getFindingShop: (state) => state.findingShop,
  getFindingLine: (state) => state.findingLine,
};

const actions = {
  async [ACHIEVEMENT_SHOP]({ commit }, id) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(`/api/tpm-achievement-shop/${year}/10000`);
      commit(SET_DATA, { key: "achievementShop", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [ACHIEVEMENT_LINE]({ commit }, shopId) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(
        `/api/tpm-achievement-line/${year}/${shopId}`
      );
      commit(SET_DATA, { key: "achievementLine", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [MH_SHOP]({ commit }, id) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(`/api/tpm-manhour-shop/${year}/10000`);
      commit(SET_DATA, { key: "mhShop", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [MH_LINE]({ commit }, shopId) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(`/api/tpm-manhour-line/${year}/${shopId}`);
      commit(SET_DATA, { key: "mhLine", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [FINDING_SHOP]({ commit }, id) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(`/api/tpm-finding-shop/${year}/10000`);
      commit(SET_DATA, { key: "findingShop", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [FINDING_LINE]({ commit }, shopId) {
    try {
      const year = new Date().getFullYear();
      const { data } = await api.get(`/api/tpm-finding-line/${year}/${shopId}`);
      commit(SET_DATA, { key: "findingLine", data: data.data });
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
};

const mutations = {
  [SET_DATA](state, { key, data }) {
    state[key] = data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
