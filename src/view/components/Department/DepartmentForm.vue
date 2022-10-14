<template>
  <v-form ref="formDepartment" lazy-validation @submit.prevent="doSubmit">
    <!-- <b-form-group label="Department Type" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        id="radio-slots"
        v-model="form.type"
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="radio-options-slots"
      >
        <b-form-radio value="Vendor">Vendor</b-form-radio>
        <b-form-radio value="Production">Production</b-form-radio>
        <b-form-radio value="Maintenance">Maintenance</b-form-radio>
      </b-form-radio-group>
    </b-form-group> -->
    <!-- <div v-if="user.role_name === 'superadmin'">
      <p class="mb-0">Company</p>
      <v-select
        v-model="form.company_id"
        :rules="[(v) => !!v || 'This field is required']"
        :items="companies"
        item-value="id"
        item-text="name"
        outlined
        dense
        @change="getPlant"
      ></v-select>
    </div>
    <div v-if="user.role_name === 'superadmin'">
      <p class="mb-0">Plant</p>
      <v-autocomplete
        v-model="form.plant_id"
        :rules="[(v) => !!v || 'This field is required']"
        :items="plants"
        item-value="id"
        item-text="name"
        outlined
        dense
        @change="getDivision"
      ></v-autocomplete>
    </div> -->
    <div>
      <p class="mb-0">Division <span class="error--text">*</span></p>
      <v-select
        v-model="form.division_id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        item-text="name"
        item-value="id"
        :items="divisions"
      ></v-select>
    </div>
    <div>
      <p class="mb-0">Department Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedDepartment"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Department Name <span class="error--text">*</span></p>
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
const user = JSON.parse(localStorage.getItem("user"));
import { mapGetters } from "vuex";
import {
  SUBMIT_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from "@/core/services/store/department.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { FETCH_DIVISIONS } from "@/core/services/store/division.module";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { FETCH_PLANTS } from "@/core/services/store/plant.module";
export default {
  props: {
    selectedDepartment: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        // type: "",
        code: "",
        name: "",
        description: "",
        division_id: "",
        company_id: user.role_name === "superadmin" ? "" : user.company_id,
        plant_id: user.role_name === "superadmin" ? "" : user.plant_id,
      },
      loading: false,
      user,
    };
  },
  computed: {
    ...mapGetters({
      divisions: "getDivisions",
      companies: "getCompanies",
      plants: "getPlants",
    }),
  },
  watch: {
    selectedDepartment(val) {
      if (!val) {
        this.$refs.formDepartment.reset();
      }
      if (val) {
        this.form = val;
        // this.form.name = this.selectedDepartment.name;
        // this.form.description = this.selectedDepartment.description;
        // this.form.division_id = this.selectedDepartment.division_id;
      }
    },
  },
  async mounted() {
    // console.log(user);
    // this.$store.dispatch(FETCH_COMPANIES);
    if (this.selectedDepartment?.id) {
      // this.getPlant(this.selectedDepartment.company_id);
      // this.getDivision(this.selectedDepartment.plant_id);

      this.form.code = this.selectedDepartment.code;
      this.form.name = this.selectedDepartment.name;
      this.form.description = this.selectedDepartment.description;
      this.form.company_id = this.selectedDepartment.company_id;
      this.form.plant_id = this.selectedDepartment.plant_id;
      this.form.division_id = this.selectedDepartment.division_id;
    } else {
      this.$refs.formDepartment.reset();
    }
  },

  methods: {
    async doSubmit() {
      if (this.$refs.formDepartment.validate()) {
        this.loading = true;
        let response;
        if (this.selectedDepartment?.id) {
          response = await this.$store.dispatch(UPDATE_DEPARTMENT, {
            id: this.selectedDepartment.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_DEPARTMENT, this.form);
        }
        this.loading = false;
        toastResponse(response);
        this.$refs.formDepartment.reset();
        this.$emit("success");
      }
    },
    getPlant(evt) {
      this.$store.dispatch(FETCH_PLANTS, evt);
    },
    getDivision(evt) {
      this.$store.dispatch(FETCH_DIVISIONS, evt);
    },
  },
};
</script>
