<template>
  <v-form ref="formType" lazy-validation @submit.prevent="doSubmit">
    <v-row>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Line</p>
          <v-autocomplete
            v-model="form.line_id"
            :items="lines"
            :rules="[(v) => !!v || 'This field is required']"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            @change="changeLine"
          ></v-autocomplete>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Machine</p>
          <v-autocomplete
            v-model="form.machine_id"
            :items="machinesWithAll"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            :loading="loadingMachine"
          ></v-autocomplete>
        </div>
      </v-col>
      <v-col md="6">
        <p class="mb-0">Date</p>

        <base-datepicker v-model="form.date"></base-datepicker>
      </v-col>
      <v-col md="6">
        <p class="mb-0">Counter</p>
        <v-text-field
          v-model="form.count"
          :rules="[(v) => !!v || 'This field is required']"
          hide-details="auto"
          outlined
          dense
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <div class="d-flex justify-end">
      <v-btn
        type="button"
        color="#E1F0FF"
        depressed
        class="mr-3 text-capitalize primary--text body-1"
        style="font-weight: 600"
        height="48"
        width="48"
        @click="$emit('close')"
        >Close</v-btn
      >
      <v-btn
        type="submit"
        color="primary"
        depressed
        class="text-capitalize body-1"
        style="font-weight: 600"
        height="48"
        width="125"
        :loading="loading"
        >Save</v-btn
      >
    </div>
  </v-form>
</template>
<script>
import {
  SUBMIT_COUNTERBASE,
  UPDATE_COUNTERBASE,
} from "@/core/services/store/counterbase.module";
import { FETCH_MACHINES } from "@/core/services/store/machine.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { mapGetters } from "vuex";
import BaseDatepicker from "@/view/components/base/BaseDatepicker";
export default {
  props: {
    selectedCounterbase: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { BaseDatepicker },
  data() {
    return {
      form: {
        machine_id: "",
        line_id: "",
        date: "",
        count: 0,
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      machines: "getMachines",
      lines: "getLines",
      profile: "getProfile",
    }),
    machinesWithAll() {
      return [{ id: "", name: "All" }, ...this.machines];
    },
  },
  watch: {
    ["selectedCounterbase.uuid"](val) {
      if (val) {
        this.form.line_id = this.selectedCounterbase.line_id;
        this.form.machine_id = this.selectedCounterbase.machine_id;
        this.form.count = this.selectedCounterbase.count;
        this.form.date = this.selectedCounterbase.date;
      } else {
        this.$refs.formType.reset();
      }
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_LINES, this.profile.department_id);
    if (this.selectedCounterbase?.id) {
      this.form.line_id = this.selectedCounterbase.line_id;
      this.form.machine_id = this.selectedCounterbase.machine_id;
      this.form.count = this.selectedCounterbase.count;
      this.form.date = this.selectedCounterbase.date;
    }
  },
  methods: {
    async changeLine(evt) {
      this.loadingMachine = true;
      await this.$store.dispatch(FETCH_MACHINES, evt.id);
      this.loadingMachine = false;
    },
    async doSubmit() {
      if (this.$refs.formType.validate()) {
        this.loading = true;
        let response = {};
        if (this.selectedCounterbase?.id) {
          response = await this.$store.dispatch(UPDATE_COUNTERBASE, {
            id: this.selectedCounterbase.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_COUNTERBASE, this.form);
        }

        toastResponse(response);
        if (response.success) {
          this.$refs.formType.reset();
          this.$emit("success");
        }
        this.loading = false;
      }
    },
  },
};
</script>
