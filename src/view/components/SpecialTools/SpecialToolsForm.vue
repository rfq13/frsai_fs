<template>
  <v-form ref="formTools" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedTool"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Name <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <v-row>
      <v-col md="6">
        <p class="mb-0">Availability <span class="error--text">*</span></p>
        <v-select
          v-model="form.is_available"
          :items="[
            { text: 'Available', value: true },
            { text: 'Not Available', value: false },
          ]"
          outlined
          dense
        ></v-select
      ></v-col>
      <v-col md="6">
        <p class="mb-0">Status <span class="error--text">*</span></p>
        <v-select
          v-model="form.status"
          :items="[
            { text: 'Elektrikal', value: '0' },
            { text: 'Mekanikal', value: '1' },
          ]"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-select
      ></v-col>
    </v-row>
    <div>
      <p class="mb-0">Description</p>
      <v-textarea v-model="form.description" outlined dense></v-textarea>
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
import {
  SUBMIT_SPECIALTOOL,
  UPDATE_SPECIALTOOL,
} from "@/core/services/store/specialTools.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedTool: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        code: "",
        name: "",
        description: "",
        status: "",
        is_available: true,
      },
      loading: false,
    };
  },
  watch: {
    selectedTool(val) {
      if (val) {
        this.form.code = this.selectedTool.code;
        this.form.name = this.selectedTool.name;
        this.form.description = this.selectedTool.description;
        this.form.status = this.selectedTool.status;
        this.form.is_available = this.selectedTool.is_available;
      } else {
        this.$refs.formTools.reset();
      }
    },
  },
  mounted() {
    if (this.selectedTool?.id) {
      this.form.code = this.selectedTool.code;
      this.form.name = this.selectedTool.name;
      this.form.description = this.selectedTool.description;
      this.form.status = this.selectedTool.status;
      this.form.is_available = this.selectedTool.is_available;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formTools.validate()) {
        this.loading = true;
        let response = {};
        if (this.selectedTool?.id) {
          response = await this.$store.dispatch(UPDATE_SPECIALTOOL, {
            body: this.form,
            id: this.selectedTool.uuid,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_SPECIALTOOL, this.form);
        }

        this.loading = false;
        toastResponse(response);
        if (response.success) {
          this.$emit("success");
        }
      }
    },
  },
};
</script>
