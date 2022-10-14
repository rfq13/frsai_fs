<template>
  <v-form ref="formShop" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Shop Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedShop"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Shop Name <span class="error--text">*</span></p>
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
import { mapGetters } from "vuex";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { FETCH_PLANTS } from "@/core/services/store/plant.module";
import { FETCH_DIVISIONS } from "@/core/services/store/division.module";
import { FETCH_DEPARTMENTS } from "@/core/services/store/department.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { FETCH_CELLS } from "@/core/services/store/cell.module";
import { SUBMIT_SHOP, UPDATE_SHOP } from "@/core/services/store/shop.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedShop: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        company_id: "",
        plant_id: "",
        division_id: "",
        department_id: "",
        line_id: "",
        cell_id: "",
        code: "",
        name: "",
        description: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      companies: "getCompanies",
      plants: "getPlants",
      divisions: "getDivisions",
      departments: "getDepartments",
      lines: "getLines",
      cells: "getCells",
    }),
  },
  watch: {
    ["selectedShop.code"](val) {
      if (val) {
        this.form.name = this.selectedShop.name;
        this.form.description = this.selectedShop.description;
        this.form.code = this.selectedShop.code;
        this.form.company_id = this.selectedShop.company_id;
        this.form.plant_id = this.selectedShop.plant_id;
        this.form.division_id = this.selectedShop.division_id;
        this.form.department_id = this.selectedShop.department_id;
        this.form.line_id = this.selectedShop.line_id;
        this.form.cell_id = this.selectedShop.cell_id;
      } else {
        this.$refs.formShop.reset();
      }
    },
  },
  async mounted() {
    if (this.selectedShop?.code) {
      this.form.name = this.selectedShop.name;
      this.form.description = this.selectedShop.description;
      this.form.code = this.selectedShop.code;
      this.form.company_id = this.selectedShop.company_id;
      this.form.plant_id = this.selectedShop.plant_id;
      this.form.division_id = this.selectedShop.division_id;
      this.form.department_id = this.selectedShop.department_id;
      this.form.line_id = this.selectedShop.line_id;
      this.form.cell_id = this.selectedShop.cell_id;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formShop.validate()) {
        this.loading = true;
        let response;
        if (this.selectedShop?.id) {
          response = await this.$store.dispatch(UPDATE_SHOP, {
            id: this.selectedShop.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_SHOP, this.form);
        }
        toastResponse(response);
        this.loading = false;
        if (response.success) {
          if (!this.selectedShop) {
            this.$refs.formShop.reset();
          }
          this.$emit("success");
        }
      }
    },
  },
};
</script>
