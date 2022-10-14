import dayjs from "dayjs";
import api from "../api";

// action types
export const FETCH_PLANNINGS = "fetchTPMPlannings";
export const FETCH_MANHOUR = "fetchTPMMH";
export const FETCH_TPMEXEC = "fetchTPMEXEC";
export const GET_TPMEXEC_HISTORY = "fetchTPMEXECHISTORY";
export const SUBMIT_PLANNING = "submitTPMPlanning";
export const UPDATE_PLANNING = "updateTPMPlanning";
export const UPDATE_PROGRESS_PLANNING = "updateProgressTPMPlanning";
export const DELETE_PLANNING = "deleteTPMPlanning";
export const GET_PLANNING = "fetchPMLedger";
export const FETCH_PLANNING_MONITORING = "fetchTPMMonitoring";
export const START_EXEC = "StartExec";
export const STOP_EXEC = "StopExec";
export const FINISH_EXEC = "Finish";
export const ACHIEVEMENT = "AchievementOld";
export const ACHIEVEMENTSHOP = "AchievementShopOld";
export const GET_HISTORY = "fetchHistory";
export const GET_GENERATED = "fetchGenerated";
export const FETCH_PICS = "fetchPics";
export const GET_ITEMCHECKS = "fetchItemChecks";
export const GET_NOTIF = "fetchNotif";
export const FETCH_PICS_FINDING = "fetchPicFinding";

// mutation types
export const SET_PLANNINGS = "setTPMPlannings";
export const ASSIGN_PLANNING = "assignTPMPlannings";
export const SET_MANHOUR = "setTPMMH";
export const SET_TPMEXEC = "setTPMEXEC";
export const SET_TPMEXECHistory = "setTPMEXECHistory";
export const SET_PLANNING = "setTPMPlanning";
export const SET_MONITORING = "setTPMMonitoring";
export const SET_ACHIEVEMENT = "setTPMAchievement";
export const SET_ACHIEVEMENT_SHOP = "setTPMAchievementShop";
export const SET_HISTORY = "setHistories";
export const SET_GENERATED = "setGenerated";
export const SET_PICS = "SET_PICS";
export const SET_ITEMCHECKS = "setItemChecks";
export const SET_NOTIF = "setNotif";

const state = {
  TPMPlannings: [],
  TPMPlanning: [],
  TPMMonitorings: [],
  tpmAchievement: [],
  tpmAchievementShop: [],
  histories: [],
  generatedPlans: [],
  TPMMH: [],
  TPMEXEC: [],
  TPMEXECHistory: [],
  pics: [],
  ItemChecks: [],
  notif: [],
};

const getters = {
  getTPMPlannings: (state) => state.TPMPlannings,
  getTPMMH: (state) => state.TPMMH,
  getTPMEXEC: (state) => state.TPMEXEC,
  getTPMEXECHistory: (state) => state.TPMEXECHistory,
  getTPMPlanning: (state) => state.TPMPlanning,
  getTPMMonitorings: (state) => state.TPMMonitorings,
  getAchievement: (state) => state.tpmAchievement,
  getAchievementShopOld: (state) => state.tpmAchievementShop,
  getHistories: (state) => state.histories,
  getGeneratedPlans: (state) => state.generatedPlans,
  getPics: (state) => state.pics,
  getItemChecks: (state) => state.ItemChecks,
  getNotif: (state) => state.notif,
};

const objectToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    );
  }
  return keyValuePairs.join("&");
};

const actions = {
  async [GET_ITEMCHECKS]({ commit }, params = {}) {
    try {
      const { data } = await api.get(
        `/api/item-check?${objectToQueryString(params)}`
      );
      commit(SET_ITEMCHECKS, data.data);
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.errorMessage,
      };
    }
  },
  async [FETCH_TPMEXEC]({ commit }, p) {
    try {
      const { data } = await api.get(
        `/api/tpm-execution/judgement-history/${p.year}/${p.month}/${p.line_id}/${p.machine_id}`
      );
      commit(
        SET_TPMEXEC,
        data.data.map((item) => {
          const res = {
            ...item,
            actual_msr:
              item.item_check.flg_measurement == 0
                ? item.value_quantitative
                : item.value_qualitative,
          };

          return res;
        })
      );
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_TPMEXEC_HISTORY]({ commit }, item_check_id) {
    try {
      const { data } = await api.get(
        `/api/tpm-execution/history-quantitative/${item_check_id}`
      );
      commit(SET_TPMEXECHistory, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_NOTIF]({ commit }) {
    try {
      const { data } = await api.get(`/api/tpm/notification`);
      commit(SET_NOTIF, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [FETCH_PLANNINGS]({ commit }) {
    try {
      const { data } = await api.get("/api/tpm-planning");
      commit(
        SET_PLANNINGS,
        data.data.map((aData) => ({
          ...aData,
          start_time_at: aData.start_time_at
            ? dayjs(aData.start_time_at).format("YYYY-MM-DD HH:mm")
            : "-",
        }))
      );
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [FETCH_MANHOUR]({ commit }, { period, line }) {
    try {
      const { data } = await api.get(
        "/api/tpm-planning-mh/" + period + "/" + line
      );
      commit(SET_MANHOUR, data.data[0] || {});
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [GET_PLANNING]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/tpm-execution/${id}`);
      commit(SET_PLANNING, data.data);
    } catch (error) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },
  async [ASSIGN_PLANNING]({ commit }, { id, body }) {
    try {
      const { data } = await api.put("/api/tpm-planning/assign/" + id, body);
      return {
        success: true,
        message: "Successfully assign planning",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [SUBMIT_PLANNING]({ commit }, payload) {
    try {
      const { data } = await api.post("/api/tpm-planning", payload);
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
  async [UPDATE_PLANNING]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/tpm-planning/${id}`, body);
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
  async [UPDATE_PROGRESS_PLANNING]({ commit }, { type, id }) {
    try {
      let url = `/api/tpm-planning/progress/${id}`;
      if (type == "done") {
        url = `/api/tpm-planning/done/${id}`;
      }
      const { data } = await api.put(url);
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
  async [DELETE_PLANNING]({ commit }, id) {
    try {
      const { data } = await api.delete(`/api/tpm-planning/${id}`);
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
  async [FETCH_PLANNING_MONITORING]({ commit }, { year, month, line }) {
    try {
      const zeroPad = (num, places) => String(num).padStart(places, "0");
      const { data } = await api.get(
        `/api/tpm-planning/monitoring/${year}/${zeroPad(month, 2)}/${line}`
      );
      commit(
        SET_MONITORING,
        Array.isArray(data.data)
          ? data.data.map((aData) => {
              return { ...aData, my: `${year}-${zeroPad(month, 2)}-` };
            })
          : []
      );
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
  },

  async [START_EXEC]({ commit }, id) {
    try {
      const { data } = await api.put(`/api/tpm-execution/${id}`);
      return {
        success: true,
        message: "Execution Started",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [STOP_EXEC]({ commit }, id) {
    try {
      const { data } = await api.put(`/api/tpm-execution/${id}`);
      return {
        success: true,
        message: "Execution Stopped",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FINISH_EXEC]({ commit }, { id, body }) {
    try {
      const { data } = await api.put(`/api/tpm-execution/${id}`, body);
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [ACHIEVEMENT]({ commit }, shopId) {
    try {
      const { data } = await api.get(`/api/tpm-achievement/${shopId}`);
      commit(SET_ACHIEVEMENT, data.data);
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [ACHIEVEMENTSHOP]({ commit }, shopId) {
    try {
      const { data } = await api.get(`/api/tpm-achievement-shop/2022/09`);
      commit(SET_ACHIEVEMENT_SHOP, data.data);
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [GET_HISTORY]({ commit }, id) {
    try {
      const { data } = await api.get(`/api/tpm-execution/check-history/${id}`);
      commit(SET_HISTORY, data.data);
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [GET_GENERATED]({ commit }, { monthNumber, year, line, isGenerate }) {
    try {
      const zeroPad = (num, places) => String(num).padStart(places, "0");

      let url = `/api/tpm-planning/${year}/${zeroPad(monthNumber, 2)}/${
        line.id
      }`;

      if (isGenerate) {
        url = `/api/tpm-planning/generate/${year}/${zeroPad(monthNumber, 2)}/${
          line.id
        }`;
      }

      const { data } = await api.get(url);
      commit(
        SET_PLANNINGS,
        data.data.map((aData) => ({
          ...aData,
          start_time_at: aData.start_time_at
            ? dayjs(aData.start_time_at).format("YYYY-MM-DD HH:mm")
            : "-",
        }))
      );
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FETCH_PICS]({ commit }, uuid) {
    try {
      const { data } = await api.get(`/api/tpm-execution-pic/${uuid}`);
      commit(SET_PICS, data.data);
      return {
        success: true,
        message: "Execution Has Finished",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
  async [FETCH_PICS_FINDING]({ commit }, uuid) {
    try {
      const { data } = await api.get(`/api/tpm-finding-pic/${uuid}`);
      commit(SET_PICS, data.data);
      return {
        success: true,
        message: "Execution Has Finished",
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
  [SET_PLANNINGS](state, payloads) {
    state.TPMPlannings = payloads;
  },
  [SET_NOTIF](state, payloads) {
    state.notif = payloads;
  },
  [SET_MANHOUR](state, payloads) {
    state.TPMMH = payloads;
  },
  [SET_TPMEXEC](state, payloads) {
    state.TPMEXEC = payloads;
  },
  [SET_TPMEXECHistory](state, payloads) {
    state.TPMEXECHistory = payloads;
  },
  [SET_PLANNING](state, payloads) {
    state.TPMPlanning = payloads;
  },
  [SET_ACHIEVEMENT](state, payloads) {
    state.tpmAchievement = payloads;
  },
  [SET_ACHIEVEMENT_SHOP](state, payloads) {
    state.tpmAchievementShop = payloads;
  },
  [SET_HISTORY](state, payloads) {
    state.histories = payloads;
  },
  [SET_GENERATED](state, payloads) {
    state.generatedPlans = payloads;
  },
  [SET_PICS](state, payloads) {
    state.pics = payloads;
  },
  [SET_ITEMCHECKS](state, payloads) {
    state.ItemChecks = payloads;
  },
  [SET_MONITORING](state, payloads) {
    const allData = [];
    const newData = payloads.forEach((item, index) => {
      const allItem = Object.keys(item);
      let startDate = "";
      let endDate = "";
      let customClass = "";
      let done = false;

      allItem.map((key) => {
        if (key.includes("date") && item[key] != null) {
          startDate = item.my + key.replace("date", "");
          customClass =
            item[key] == 0 ? "planning" : item[key] == 1 ? "delay" : "done";

          if (item[key] != 0 && item[key] != 1) {
            done = true;
          }
        }
      });

      if (item.executed_at && item.executed_at != startDate) {
        allData.push({
          id: index + 1,
          row: index,
          name: "...",
          start: item.executed_at,
          end: item.executed_at,
          line_code: item.line_code,
          machine_code: item.machine_code,
          machine_name: item.machine_name,
          status_planning: item.status_planning,
          text: `${item.machine_code} - ${item.machine_name}`,
          description: item.item_check_name,
          progress: 0,
          custom_class:
            item.status_execution == 0
              ? "planning"
              : item.status_execution == 1
              ? "delay"
              : "done",
          method: item.ledger_method,
          duration: item.duration,
          pic: item.pic,
          inCharge: item.in_charge,
          reason: item.reason,
          independent: true,
        });
      }

      if (item.revised_at) {
        allData.push({
          id: index + 1,
          row: index,
          name: "...",
          start: item.revised_at,
          end: item.revised_at,
          line_code: item.line_code,
          machine_code: item.machine_code,
          machine_name: item.machine_name,
          status_planning: item.status_planning,
          text: `${item.machine_code} - ${item.machine_name}`,
          description: item.item_check_name,
          progress: 0,
          custom_class: "planning",
          method: item.ledger_method,
          duration: item.duration,
          pic: item.pic,
          inCharge: item.in_charge,
          reason: item.reason,
          independent: true,
        });
      }

      allData.push({
        id: index + 1,
        row: index,
        uuid: item.uuid,
        name: "",
        line_code: item.line_code,
        machine_code: item.machine_code,
        machine_name: item.machine_name,
        status_planning: item.status_planning,
        text: `${item.machine_code} - ${item.machine_name}`,
        description: item.item_check_name,
        start: startDate,
        end: startDate,
        progress: 100,
        custom_class: customClass,
        method: item.ledger_method,
        duration: item.duration,
        pic: item.pic,
        inCharge: item.in_charge,
        judge: item.status_planning == 1 ? "Finding" : "Done",
        uuid: item.uuid,
        reason: item.reason,
        done: done,
        revised_at: item.revised_at
          ? dayjs(item.revised_at).format("YYYY-MM-DD")
          : "",
      });
    });

    state.TPMMonitorings = allData.map((aData, index) => {
      let dep = {};
      if (!aData.independent && aData.revised_at != "") {
        dep = { dependencies: index - 1 };
        return { ...aData, ...dep };
      }
      return aData;
    });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
