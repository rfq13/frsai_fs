<template>
  <v-form ref="formLedgerMethod" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Method Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedLedgerMethod"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Method Name <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>

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
  SUBMIT_LEDGERMETHOD,
  UPDATE_LEDGERMETHOD,
} from "@/core/services/store/ledgerMethod.module";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedLedgerMethod: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        code: "",
        name: "",
        description: "",
      },
      loading: false,
    };
  },
  watch: {
    selectedLedgerMethod(val) {
      if (val) {
        this.form.code = this.selectedLedgerMethod.code;
        this.form.name = this.selectedLedgerMethod.name;
        this.form.description = this.selectedLedgerMethod.description;
      } else {
        this.$refs.formLedgerMethod.reset();
      }
    },
  },
  mounted() {
    if (this.selectedLedgerMethod?.uuid) {
      this.form.code = this.selectedLedgerMethod.code;
      this.form.name = this.selectedLedgerMethod.name;
      this.form.description = this.selectedLedgerMethod.description;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formLedgerMethod.validate()) {
        this.loading = true;
        let response = {};
        if (this.selectedLedgerMethod?.uuid) {
          response = await this.$store.dispatch(UPDATE_LEDGERMETHOD, {
            body: this.form,
            id: this.selectedLedgerMethod.uuid,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_LEDGERMETHOD, this.form);
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
