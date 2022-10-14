<template>
  <v-form ref="formType" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Product Type Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedType"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Product Type Name <span class="error--text">*</span></p>
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
  SUBMIT_PRODUCT_TYPE,
  UPDATE_PRODUCT_TYPE,
} from "@/core/services/store/productType.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedType: {
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
      },
      loading: false,
    };
  },
  watch: {
    selectedType(val) {
      if (val) {
        this.form.code = this.selectedType.code;
        this.form.name = this.selectedType.name;
        this.form.description = this.selectedType.description;
      } else {
        this.$refs.formType.reset();
      }
    },
  },
  mounted() {
    if (this.selectedType?.code) {
      this.form.code = this.selectedType.code;
      this.form.name = this.selectedType.name;
      this.form.description = this.selectedType.description;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formType.validate()) {
        this.loading = true;
        let response = {};
        if (this.selectedType?.id) {
          response = await this.$store.dispatch(UPDATE_PRODUCT_TYPE, {
            id: this.selectedType.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_PRODUCT_TYPE, this.form);
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
