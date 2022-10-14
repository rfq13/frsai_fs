<template>
  <v-form ref="formDivision" lazy-validation @submit.prevent="doSubmit">
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
      ></v-autocomplete>
    </div> -->
    <div>
      <p class="mb-0">Division Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedDivision"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Division Name <span class="error--text">*</span></p>
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
import {
  SUBMIT_DIVISION,
  UPDATE_DIVISION,
} from "@/core/services/store/division.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { FETCH_PLANTS } from "@/core/services/store/plant.module";
import { mapGetters } from "vuex";
export default {
  props: ["selectedDivision"],
  data() {
    return {
      form: {
        company_id: user.role_name === "superadmin" ? "" : user.company_id,
        plant_id: user.role_name === "superadmin" ? "" : user.plant_id,
        code: "",
        name: "",
        description: "",
      },
      loading: false,
      user,
    };
  },
  computed: {
    ...mapGetters({
      companies: "getCompanies",
      plants: "getPlants",
    }),
  },
  watch: {
    selectedDivision(val) {
      if (!val) {
        this.$refs.formDivision.reset();
      }
      if (val) {
        this.getPlant(this.selectedDivision.company_id);
        this.form = this.selectedDivision;
      }
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_COMPANIES);
    if (this.selectedDivision?.id) {
      this.getPlant(this.selectedDivision.company_id);
      this.form = this.selectedDivision;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formDivision.validate()) {
        this.loading = true;
        let response;
        if (this.selectedDivision?.id) {
          response = await this.$store.dispatch(UPDATE_DIVISION, {
            id: this.selectedDivision.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_DIVISION, this.form);
        }
        this.loading = false;
        toastResponse(response);
        this.$refs.formDivision.reset();
        this.$emit("success");
      }
    },
    getPlant(evt) {
      this.$store.dispatch(FETCH_PLANTS, evt);
    },
  },
};
</script>
