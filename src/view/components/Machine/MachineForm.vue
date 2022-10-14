<template>
  <v-form ref="formMachine" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Line <span class="error--text">*</span></p>
      <v-select
        v-model="form.line_id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :items="lines"
        :item-text="(v) => `${v.code} - ${v.name}`"
        item-value="id"
      ></v-select>
    </div>
    <div v-if="form.line_id || form.cell_id">
      <p class="mb-0">Cell <span class="error--text">*</span></p>
      <v-select
        v-model="form.cell_id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :items="cells"
        :item-text="(v) => `${v.code} - ${v.name}`"
        item-value="id"
      ></v-select>
    </div>
    <div class="d-flex justify-space-between">
      <div style="width: 48%">
        <p class="mb-0">Machine Code <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.code"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          :disabled="!!selectedMachine"
        ></v-text-field>
      </div>
      <div style="width: 48%">
        <p class="mb-0">Machine Name <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.name"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </div>
    </div>
    <div>
      <p class="mb-0">Description</p>
      <v-textarea
        v-model="form.description"
        outlined
        dense
        rows="2"
      ></v-textarea>
    </div>
    <div class="d-flex justify-space-between">
      <div style="width: 48%">
        <p class="mb-0">Operation Number <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.operation_number"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </div>
      <div style="width: 48%">
        <p class="mb-0">Serial Number <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.serial_number"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </div>
    </div>
    <div class="d-flex justify-space-between">
      <div style="width: 48%">
        <p class="mb-0">Process Name <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.process_name"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </div>
      <div style="width: 48%">
        <p class="mb-0">Type Machine <span class="error--text">*</span></p>
        <v-select
          v-model="form.machine_type_id"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          :items="types"
          item-text="name"
          item-value="id"
        ></v-select>
      </div>
    </div>
    <div class="d-flex justify-space-between">
      <div style="width: 48%">
        <p class="mb-0">Maker <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.maker"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </div>
      <div style="width: 48%">
        <p class="mb-0">Release Year <span class="error--text">*</span></p>
        <v-select
          v-model="form.release_year"
          :rules="[(v) => !!v || 'This field is required']"
          :items="years"
          outlined
          dense
        ></v-select>
      </div>
    </div>

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
import { mapGetters } from "vuex";
import {
  SUBMIT_MACHINE,
  UPDATE_MACHINE,
} from "@/core/services/store/machine.module";

import { FETCH_CELLS } from "@/core/services/store/cell.module";
import { FETCH_LINES } from "@/core/services/store/line.module";

import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedMachine: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        code: "",
        name: "",
        description: "",
        operation_number: "",
        serial_number: "",
        process_name: "",
        maker: "",
        machine_type_id: "",
        release_year: "",
        line_id: "",
        cell_id: "",
      },
      loading: false,
      years: [],
    };
  },
  computed: {
    ...mapGetters({
      types: "getTypes",
      cells: "getCells",
      lines: "getLines",
    }),
  },
  watch: {
    selectedMachine(val) {
      if (val) {
        this.$store.dispatch(FETCH_LINES);
        this.$store.dispatch(FETCH_CELLS, this.selectedMachine.line_id);
        this.form.name = this.selectedMachine.name;
        this.form.description = this.selectedMachine.description;
        this.form.code = this.selectedMachine.code;
        this.form.operation_number = this.selectedMachine.operation_number;
        this.form.serial_number = this.selectedMachine.serial_number;
        this.form.release_year = parseInt(this.selectedMachine.release_year);
        this.form.process_name = this.selectedMachine.process_name;
        this.form.maker = this.selectedMachine.maker;
        this.form.machine_type_id = this.selectedMachine.machine_type_id;
        this.form.cell_id = this.selectedMachine.cell_id;
        this.form.line_id = this.selectedMachine.line_id;
      } else {
        this.$refs.formMachine.reset();
      }
    },
    ["form.line_id"](val) {
      this.$store.dispatch(FETCH_CELLS, val);
    },
  },
  async mounted() {
    this.$store.dispatch(FETCH_LINES);
    this.$store.dispatch(FETCH_CELLS, this.selectedMachine?.line_id);
    for (
      let index = new Date().getFullYear();
      index > new Date().getFullYear() - 20;
      index--
    ) {
      this.years.push(index);
    }
    if (this.selectedMachine?.id) {
      this.form.name = this.selectedMachine.name;
      this.form.description = this.selectedMachine.description;
      this.form.code = this.selectedMachine.code;
      this.form.operation_number = this.selectedMachine.operation_number;
      this.form.serial_number = this.selectedMachine.serial_number;
      this.form.release_year = this.selectedMachine.release_year;
      this.form.process_name = this.selectedMachine.process_name;
      this.form.maker = this.selectedMachine.maker;
      this.form.machine_type_id = this.selectedMachine.machine_type_id;
      this.form.cell_id = this.selectedMachine.cell_id;
      this.form.line_id = this.selectedMachine.line_id;
    }

    // console.log(this.selectedMachine, "selectedMachine");
    // console.log(this.form, "form");
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formMachine.validate()) {
        this.loading = true;
        let response;
        if (this.selectedMachine?.id) {
          response = await this.$store.dispatch(UPDATE_MACHINE, {
            id: this.selectedMachine.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_MACHINE, this.form);
        }
        toastResponse(response);
        this.loading = false;
        if (response.success) {
          this.$refs.formMachine.reset();
          this.$emit("success");
        }
      }
    },
  },
};
</script>
