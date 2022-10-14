import api from "../api";

// action types
export const FETCH_TYPES = "fetchTypes";
export const SUBMIT_TYPES = "submitType";
export const UPDATE_TYPES = "updateType";
export const DELETE_TYPES = "deleteType";
export const FETCH_MACHINES = "fetchMachines";
export const IMPORT_MACHINES = "importMachines";
export const SUBMIT_MACHINE = "submitMachine";
export const ASSIGN_MACHINE_PIC = "assignMachinePic";
export const UPDATE_MACHINE = "updateMachine";
export const DELETE_MACHINE = "deleteMachine";
export const FETCH_SUB_MACHINES = "fetchSubMachines";
export const SUBMIT_SUB_MACHINE = "submitSubMachine";
export const UPDATE_SUB_MACHINE = "updateSubMachine";
export const DELETE_SUB_MACHINE = "deleteSubMachine";

// mutation types
export const SET_TYPES = "setTypes";
export const SET_MACHINES = "setMachines";
export const SET_SUB_MACHINES = "setSubMachines";

const state = {
  types: [],
  machines: [],
  subMachines: [],
};

const getters = {
  getTypes: (state) => state.types,
  getMachines: (state) => state.machines,
  getSubMachines: (state) => state.subMachines,
};

const actions = {
  async [FETCH_TYPES]({ commit }, id) {
    try {
      const { data } = await api.get("/api/type-machine");
      commit(SET_TYPES, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_TYPES]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/type-machine", payload);
      return {
        success: true,
        message: "Successfully save Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_TYPES]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/type-machine/${id}`, body);
      return {
        success: true,
        message: "Successfully update Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_TYPES]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/type-machine/${id}`);
      return {
        success: true,
        message: "Successfully delete Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FETCH_MACHINES]({ commit }, id) {
    try {
      let params = {};
      if (id) {
        params = {
          line_id: id,
        };

        if (typeof id === "object") {
          params = id;
        }
      }
      const { data } = await api.get("/api/machine", { params });
      let neo = data.data;
      if (!params?.nothasledger) {
        neo = neo.map((d) => {
          return {
            ...d,
            pic_vendor: d.machine_pic
              .filter((mp) => mp.type.toLowerCase() === "vendor")
              .map((mp) => mp?.user?.full_name)
              .join(", "),
            pic_production: d.machine_pic
              .filter((mp) => mp.type.toLowerCase() === "production")
              .map((mp) => mp?.user?.full_name)
              .join(", "),
            pic_maintenance: d.machine_pic
              .filter((mp) => mp.type.toLowerCase() === "maintenance")
              .map((mp) => mp?.user?.full_name)
              .join(", "),
          };
        });
      }
      commit(SET_MACHINES, neo);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_MACHINE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/machine", payload);
      return {
        success: true,
        message: "Successfully save Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [IMPORT_MACHINES]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/machine/import", payload);
      return {
        success: true,
        message: "Successfully Import Machines",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [ASSIGN_MACHINE_PIC]({ commit }, { id, payload }) {
    try {
      const { data } = await api.post("/api/machine/pic/" + id, payload);
      return {
        success: true,
        message: "Successfully save PIC Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_MACHINE]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/machine/${id}`, body);
      return {
        success: true,
        message: "Successfully update Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_MACHINE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/machine/${id}`);
      return {
        success: true,
        message: "Successfully delete Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FETCH_SUB_MACHINES]({ commit }, id) {
    try {
      const { data } = await api.get("/api/sub-machine");
      commit(SET_SUB_MACHINES, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [SUBMIT_SUB_MACHINE]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/sub-machine", payload);
      return {
        success: true,
        message: "Successfully save Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [UPDATE_SUB_MACHINE]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/sub-machine/${id}`, body);
      return {
        success: true,
        message: "Successfully update Type Machine",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [DELETE_SUB_MACHINE]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/sub-machine/${id}`);
      return {
        success: true,
        message: "Successfully delete Type Machine",
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
  [SET_TYPES](state, payloads) {
    state.types = payloads;
  },
  [SET_MACHINES](state, payloads) {
    state.machines = payloads;
  },
  [SET_SUB_MACHINES](state, payloads) {
    state.subMachines = payloads;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
