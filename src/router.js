import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "/vuetify",
          redirect: "/dashboard",
          component: () => import("@/view/pages/vuetify/Vuetify.vue"),
          children: [
            {
              path: "/dashboard",
              name: "dashboard",
              component: () => import("@/view/pages/Dashboard.vue"),
            },
            {
              path: "/master/company",
              name: "company",
              component: () => import("@/view/pages/master/Company.vue"),
            },
            {
              path: "/master/user",
              name: "user",
              component: () => import("@/view/pages/master/User.vue"),
            },
            {
              path: "/master/rekrut",
              name: "rekrut",
              component: () => import("@/view/pages/master/Rekrut.vue"),
            },
            {
              path: "/master/user/ndexi",
              name: "i-user",
              component: () => import("@/view/pages/master/muser/index.vue"),
            },
            {
              path: "/master/user/create",
              name: "create-user",
              component: () => import("@/view/pages/master/muser/create.vue"),
            },
            {
              path: "/master/position",
              name: "position",
              component: () => import("@/view/pages/master/Position.vue"),
            },
            {
              path: "/master/role",
              name: "role",
              component: () => import("@/view/pages/master/Role.vue"),
            },
            {
              path: "/master/plant",
              name: "contact",
              component: () => import("@/view/pages/master/Plant.vue"),
            },
            {
              path: "/master/division",
              name: "division",
              component: () => import("@/view/pages/master/Division.vue"),
            },
            {
              path: "/master/department",
              name: "department",
              component: () => import("@/view/pages/master/Department.vue"),
            },
            {
              path: "/master/line",
              name: "line",
              component: () => import("@/view/pages/master/Line.vue"),
            },
            {
              path: "/master/shop",
              name: "shop",
              component: () => import("@/view/pages/master/Shop.vue"),
            },
            {
              path: "/master/cell",
              name: "cell",
              component: () => import("@/view/pages/master/Cell.vue"),
            },
            {
              path: "/master/type-machine",
              name: "typeMachine",
              component: () =>
                import("@/view/pages/master/machine/TypeMachine.vue"),
            },
            {
              path: "/master/product-type",
              name: "productType",
              component: () =>
                import("@/view/pages/master/productType/ProductType.vue"),
            },
            {
              path: "/master/machine",
              name: "machine",
              component: () =>
                import("@/view/pages/master/machine/Machine.vue"),
            },
            {
              path: "/master/sub-machine",
              name: "subMachine",
              component: () =>
                import("@/view/pages/master/machine/SubMachine.vue"),
            },
            {
              path: "/master/jis",
              name: "jis",
              component: () => import("@/view/pages/master/Jis.vue"),
            },
            {
              path: "/master/spare-part",
              name: "sparePart",
              component: () => import("@/view/pages/master/SparePart.vue"),
            },
            {
              path: "/master/ledger-method",
              name: "ledgerMethod",
              component: () => import("@/view/pages/master/LedgerMethod.vue"),
            },
            {
              path: "/master/special-tools",
              name: "specialTools",
              component: () => import("@/view/pages/master/SpecialTools.vue"),
            },
            {
              path: "/master/ledger-tpm",
              name: "ledgerTpm",
              component: () =>
                import("@/view/pages/master/ledger/LedgerTpm.vue"),
            },
            {
              path: "/notification",
              name: "notification",
              component: () => import("@/view/pages/master/Notification.vue"),
            },
            {
              path: "/master/ledger-tpm/create",
              name: "ledgerTpmCreate",
              component: () =>
                import("@/view/pages/master/ledger/LedgerTpmCreate.vue"),
            },
            {
              path: "/master/ledger-tpm/revise/:id",
              name: "ledgerTpmRevise",
              component: () =>
                import("@/view/pages/master/ledger/LedgerTpmRevise.vue"),
            },
            {
              path: "/master/ledger-tpm/detail/:id",
              name: "ledgerTpmDetail",
              component: () =>
                import("@/view/pages/master/ledger/LedgerTpmDetail.vue"),
            },
            {
              path: "/master/ledger-tpm/approval",
              name: "ledgerTpmApprove",
              component: () =>
                import("@/view/pages/master/ledger/LedgerTpmApproval.vue"),
            },
            {
              path: "/master/ledger-tpm/approval/detail/:id",
              name: "ledgerTpmApproveDetail",
              component: () =>
                import(
                  "@/view/pages/master/ledger/LedgerTpmApprovalDetail.vue"
                ),
            },
            {
              path: "/master/ledger-tpm/approval/revision/:id",
              name: "ledgerTpmApproveRevision",
              component: () =>
                import(
                  "@/view/pages/master/ledger/LedgerTpmApprovalRevision.vue"
                ),
            },
            {
              path: "/planning",
              name: "planning",
              component: () => import("@/view/pages/planning/PlanningList.vue"),
            },
            {
              path: "/monitoring",
              name: "monitoring",
              component: () => import("@/view/pages/monitoring/Monitoring.vue"),
            },
            {
              path: "/monitoring/:id",
              name: "monitoring-detail",
              component: () =>
                import("@/view/pages/monitoring/MonitoringDetail.vue"),
            },
            {
              path: "/counterbase",
              name: "input-counterbase",
              component: () =>
                import("@/view/pages/counterbase/Counterbase.vue"),
            },
            {
              path: "/tpm-judgement",
              name: "tpm-judgement",
              component: () =>
                import("@/view/pages/judgement/TPMJudgement.vue"),
            },
            {
              path: "/finding",
              name: "finding",
              component: () => import("@/view/pages/finding/Finding.vue"),
            },
            {
              path: "/tpm-finish-ratio",
              name: "FinishRatio",
              component: () => import("@/view/pages/finish/FinishRatio.vue"),
            },
            {
              path: "/setting",
              name: "Setting",
              component: () => import("@/view/pages/Setting.vue"),
            },
          ],
        },

        {
          path: "/builder",
          name: "builder",
          component: () => import("@/view/pages/Builder.vue"),
        },

        {
          path: "/custom-plugins",
          name: "plugins",
          component: () => import("@/view/pages/plugins/Plugins.vue"),
          children: [
            {
              path: "cropper",
              name: "cropper",
              component: () => import("@/view/pages/plugins/Cropper.vue"),
            },
            {
              path: "treeselect",
              name: "treeselect",
              component: () => import("@/view/pages/plugins/Treeselect.vue"),
            },
          ],
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("@/view/pages/profile/Profile.vue"),
          children: [
            {
              path: "profile-1",
              name: "profile-1",
              component: () => import("@/view/pages/profile/Profile-1.vue"),
            },
            {
              path: "profile-2",
              name: "profile-2",
              component: () => import("@/view/pages/profile/Profile-2.vue"),
            },
            {
              path: "profile-3",
              name: "profile-3",
              component: () => import("@/view/pages/profile/Profile-3.vue"),
            },
            {
              path: "profile-4",
              name: "profile-4",
              component: () => import("@/view/pages/profile/Profile-4.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/custom-error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue"),
        },
        {
          path: "error-2",
          name: "error-2",
          component: () => import("@/view/pages/error/Error-2.vue"),
        },
        {
          path: "error-3",
          name: "error-3",
          component: () => import("@/view/pages/error/Error-3.vue"),
        },
        {
          path: "error-4",
          name: "error-4",
          component: () => import("@/view/pages/error/Error-4.vue"),
        },
        {
          path: "error-5",
          name: "error-5",
          component: () => import("@/view/pages/error/Error-5.vue"),
        },
        {
          path: "error-6",
          name: "error-6",
          component: () => import("@/view/pages/error/Error-6.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/view/pages/auth/login_pages/Login-1"),
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/view/pages/auth/login_pages/Login-1"),
        },
        {
          name: "register",
          path: "/register",
          component: () => import("@/view/pages/auth/login_pages/Login-1"),
        },
      ],
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue"),
    },
  ],
});
