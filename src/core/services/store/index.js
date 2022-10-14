import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";
import company from "./company.module";
import plant from "./plant.module";
import division from "./division.module";
import department from "./department.module";
import line from "./line.module";
import cell from "./cell.module";
import shop from "./shop.module";
import machine from "./machine.module";
import user from "./user.module";
import specialTools from "./specialTools.module";
import jis from "./jis.module";
import sparePart from "./sparePart.module";
import ledgerMethod from "./ledgerMethod.module";
import tpmLedger from "./tpmLedger.module";
import tpmFinding from "./tpmFinding.module";
import tpmPlanning from "./tpmPlanning.module";
import role from "./role.module";
import productType from "./productType.module";
import CounterBase from "./counterbase.module";
import tpmAchievement from "./tpmAchievement.module";
import employee from "./employee.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    htmlClass,
    config,
    breadcrumbs,
    profile,
    company,
    plant,
    division,
    department,
    line,
    cell,
    shop,
    machine,
    user,
    jis,
    specialTools,
    sparePart,
    ledgerMethod,
    tpmLedger,
    tpmFinding,
    tpmPlanning,
    role,
    productType,
    CounterBase,
    tpmAchievement,
    employee,
  },
});
