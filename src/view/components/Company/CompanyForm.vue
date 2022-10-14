<template>
  <v-form ref="formCompany" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Company Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedCompany"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Company Name <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Website <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.website"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Phone Number <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.phone"
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
  SUBMIT_COMPANY,
  UPDATE_COMPANY,
} from "@/core/services/store/company.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedCompany: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        website: "",
        phone: "",
        description: "",
      },
      loading: false,
    };
  },
  watch: {
    selectedCompany(val) {
      if (!val) {
        this.$refs.formCompany.reset();
      }
      if (val) {
        this.form = this.selectedCompany;
      }
    },
  },
  mounted() {
    if (this.selectedCompany?.id) {
      this.form = this.selectedCompany;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formCompany.validate()) {
        let result = {};
        this.loading = true;
        if (this.selectedCompany?.id) {
          result = await this.$store.dispatch(UPDATE_COMPANY, {
            id: this.selectedCompany.id,
            body: this.form,
          });
        } else {
          result = await this.$store.dispatch(SUBMIT_COMPANY, this.form);
        }
        this.loading = false;
        toastResponse(result);
        this.$refs.formCompany.reset();
        this.$emit("success");
      }
    },
  },
};
</script>
