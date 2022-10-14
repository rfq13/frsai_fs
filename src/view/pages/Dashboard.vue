<template>
  <section>
  <!-- 
    <a v-if="!!shopId" href="#/dashboard">
      <p class="mb-5">
        <b> <v-icon>mdi-chevron-left</v-icon> Back</b>
      </p>
    </a>

    <v-card class="rounded-lg mb-3">
      <v-card-title>TPM Finish Ratio </v-card-title>
    </v-card>

    <section v-if="!loading">
      <v-row v-if="!shopId">
        <v-col v-for="(achievement, key) in achievementShop" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="(achievement, key) in achievementLine" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
    </section>
    <base-loading v-else></base-loading>

    <v-card class="rounded-lg mt-8 mb-3">
      <v-card-title> TPM Finding Finish Ratio </v-card-title>
    </v-card>

    <section v-if="!loading">
      <v-row v-if="!shopId">
        <v-col v-for="(achievement, key) in findingShop" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="(achievement, key) in findingLine" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
    </section>
    <base-loading v-else></base-loading>

    <v-card class="rounded-lg mt-8 mb-3">
      <v-card-title> Man Hours Graphic </v-card-title>
    </v-card>

    <section v-if="!loading">
      <v-row v-if="!shopId">
        <v-col v-for="(achievement, key) in mhShop" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="(achievement, key) in mhLine" :key="key" md="12">
          <chart-ratio :achievement="achievement"></chart-ratio>
        </v-col>
      </v-row>
    </section>
    <base-loading v-else></base-loading> -->
  </section>
</template>

<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { getToken } from "@/core/services/auth.service";
import {
  ACHIEVEMENT_SHOP,
  ACHIEVEMENT_LINE,
  MH_SHOP,
  MH_LINE,
  FINDING_SHOP,
  FINDING_LINE,
} from "@/core/services/store/tpmAchievement.module";
import { mapGetters } from "vuex";
// import ChartRatio from "@/view/components/Finish/ChartRatio";
// import BaseLoading from "@/view/components/base/BaseLoading.vue";
export default {
  name: "dashboard",
  // components: { ChartRatio, BaseLoading },
  computed: {
    ...mapGetters({
      achievementShop: "getAchievementShop",
      achievementLine: "getAchievementLine",
      mhShop: "getMhShop",
      mhLine: "getMhLine",
      findingShop: "getFindingShop",
      findingLine: "getFindingLine",
    }),
    shopId() {
      return this.$route.query.shop;
    },
  },
  watch: {
    shopId() {
      this.$nextTick(() => {
        this.refreshData();
      });
    },
  },
  async mounted() {
    if (!getToken()) {
      this.$router.push({ name: "login" });
    }
    // await this.$store.dispatch(FETCH_SHOPS);

    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);
    this.$store.dispatch(SET_PAGE_TITLE, "Dashboard");
    this.refreshData();
  },
  methods: {
    async refreshData() {
      this.loading = true;
      if (this.$route.query.shop) {
        await this.$store.dispatch(ACHIEVEMENT_LINE, this.$route.query.shop);
        await this.$store.dispatch(MH_LINE, this.$route.query.shop);
        await this.$store.dispatch(FINDING_LINE, this.$route.query.shop);
      } else {
        await this.$store.dispatch(ACHIEVEMENT_SHOP);
        await this.$store.dispatch(MH_SHOP);
        await this.$store.dispatch(FINDING_SHOP);
      }
      this.loading = false;
      this.$forceUpdate();
    },
  },
};
</script>
