<template>
  <v-row>
    <v-col cols="2">
      <p class="mb-1 font-weight-bold body-1">From <span style="color:red">*</span></p>
      <v-select
          v-model="form.from"
          :items="['LTB', 'Improvement', 'Revision', 'New Item']"
          outlined
          dense
          hide-details="auto"
          :rules="[v => !!v || 'From is required']"
        ></v-select>
    </v-col>
    <v-col cols="2">
      <p class="mb-1 font-weight-bold body-1">JIS Plan Date <span style="color:red">*</span></p>
      <base-datepicker
      v-model="form.jis_planned_at"
      :rules="[v => !!v || 'From is required']"
      ></base-datepicker>
    </v-col>
    <v-col cols="3">
      <div>
        <p class="mb-1">Machine</p>
        <v-autocomplete
          v-model="form.machines"
          :items="machines"
          :rules="[v => !!v || 'From is required']"
          item-value="id"
          multiple
          item-text="name"
          outlined
          dense
        ></v-autocomplete>
      </div>
    </v-col>
    <v-col cols="5">
      <p class="mb-1 font-weight-bold body-1">Reason <span style="color:red">*</span></p>
      <v-textarea
        solo
        v-model="form.revision_reason"
        :rules="[v => !!v || 'From is required']"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>

import BaseDatepicker from "@/view/components/base/BaseDatepicker";
import { mapGetters } from "vuex";
import { FETCH_MACHINEREVISION } from "@/core/services/store/tpmLedger.module";

export default {
  data() {
    return {
      machine_id: [],
    }
  },
  props:{
    form:{
      type: Object,
      default:()=>{}
    },
  },
  computed: {
    ...mapGetters({
      machines: "getMachineRevisions",
    }),
  },
  watch:{
  },
  mounted() {
    this.fetchMachines();
  },
  components: {
    BaseDatepicker
  },
  methods: {
    fetchMachines(){
      console.log("fetch machines ...")
      this.$store.dispatch(FETCH_MACHINEREVISION, this.$route.params.id);
    }
  }
}
</script>