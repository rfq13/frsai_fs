<template>
  <section>
    <v-card class="rounded-lg mb-8">
      <v-card-title> TPM Finish Ratio </v-card-title>
    </v-card>
    <a v-if="!!shopId" href="#/tpm-finish-ratio">
      <p class="mb-5">
        <b> <v-icon>mdi-chevron-left</v-icon> Back</b>
      </p>
    </a>
    <v-row v-if="!!shopId">
      <v-col v-for="(achievement, key) in achievements" :key="key" md="6">
        <chart-ratio :achievement="achievement"></chart-ratio>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="(achievement, key) in achievementsShop" :key="key" md="6">
        <chart-ratio :achievement="achievement"></chart-ratio>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { getToken } from "@/core/services/auth.service";
import {
  ACHIEVEMENT,
  ACHIEVEMENTSHOP,
} from "@/core/services/store/tpmPlanning.module";
import { mapGetters } from "vuex";
import ChartRatio from "@/view/components/Finish/ChartRatio";
export default {
  name: "finishRation",
  components: { ChartRatio },
  computed: {
    ...mapGetters({
      achievements: "getAchievement",
      achievementsShop: "getAchievementShop",
    }),
    shopId() {
      return this.$route.query.shop;
    },
  },
  watch: {
    shopId() {
      this.refreshData();
    },
  },
  async mounted() {
    if (!getToken()) {
      this.$router.push({ name: "login" });
    }
    // await this.$store.dispatch(FETCH_SHOPS);
    if (this.$route.query.shop) {
      await this.$store.dispatch(ACHIEVEMENT, this.$route.query.shop);
    } else {
      await this.$store.dispatch(ACHIEVEMENTSHOP);
    }
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "TPM Finish Ratio" }]);
    this.$store.dispatch(SET_PAGE_TITLE, "TPM Finish Ratio");
  },
  methods: {
    async refreshData() {
      if (this.$route.query.shop) {
        await this.$store.dispatch(ACHIEVEMENT, this.$route.query.shop);
      } else {
        await this.$store.dispatch(ACHIEVEMENTSHOP);
      }
    },
  },
};
</script>
