<template>
  <section>
    <v-card
      class="rounded-lg"
      style="box-shadow: 0px 0px 20px rgba(56, 71, 109, 0.1) !important"
    >
      <v-card-text class="py-8 px-10" style="color: #3f4254">
        <v-tabs v-model="active" fixed-tabs>
          <v-tab
            v-for="(step, index) in steps"
            :key="index"
            :disabled="index > active"
            class="title text-capitalize font-weight-bold"
            :style="index > active ? 'cursor: not-allowed' : ''"
            >{{ index + 1 }}. {{ step.name }}</v-tab
          >
        </v-tabs>
        <v-divider class="mt-0"></v-divider>
        <v-tabs-items v-model="active">
          <v-tab-item class="px-6 py-10">
            <setup-line @next="active = active + 1"></setup-line>
          </v-tab-item>
          <v-tab-item class="px-6 py-10">
            <item-check
              @next="active = active + 1"
              @prev="active = active - 1"
            ></item-check>
          </v-tab-item>
          <v-tab-item class="px-6 py-10">
            <submit-tpm></submit-tpm>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import SetupLine from "@/view/components/Ledger/SetupLine";
import SubmitTpm from "@/view/components/Ledger/SubmitTpm";
import ItemCheck from "../../../components/Ledger/ItemCheck.vue";
export default {
  components: {
    SetupLine,
    SubmitTpm,
    ItemCheck,
  },
  data() {
    return {
      steps: [
        { name: "Select Machine" },
        { name: "Add Item Check" },
        { name: "Submit" },
      ],
      active: 0,
      addMachine: false,
    };
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Create Ledger TPM");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Ledger TPM" },
      { title: "Create" },
    ]);
  },
};
</script>
