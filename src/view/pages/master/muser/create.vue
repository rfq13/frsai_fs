<template>
  <section>
    <v-card
      class="rounded-lg"
      style="box-shadow: 0px 0px 20px rgba(56, 71, 109, 0.1) !important"
    >
      <v-card-title class="title">Create User</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <v-form ref="userForm" @submit.prevent="doSubmit">
          <v-row>
            <v-col md="6" cols="12">
              <div>
                <p class="mb-2">No Register</p>
                <v-text-field
                  v-model="form.registration_number"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Password</p>
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  append-icon="mdi-eye"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Confirm Password</p>
                <v-text-field
                  v-model="form.confirm"
                  :type="showConfirm ? 'text' : 'password'"
                  outlined
                  dense
                  append-icon="mdi-eye"
                  @click:append="showConfirm = !showConfirm"
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Phone Number</p>
                <v-text-field
                  v-model="form.phone"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Email</p>
                <v-text-field
                  v-model="form.email"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Full Name</p>
                <v-text-field
                  v-model="form.full_name"
                  outlined
                  dense
                ></v-text-field>
              </div>
            </v-col>
            <v-col md="6" cols="12">
              <!-- <div>
                <p class="mb-2">Position</p>
                <v-autocomplete outlined dense></v-autocomplete>
              </div> -->
              <div>
                <p class="mb-2">Role</p>
                <v-autocomplete v-model="form.role_name"
                  outlined
                  dense
                  :items="[ {value:'Admin'} ]"
                  item-value="value"
                  item-text="value"></v-autocomplete>
              </div>
              <div>
                <p class="mb-2">Company</p>
                <v-autocomplete
                  v-model="form.company_id"
                  outlined
                  dense
                  :items="companies"
                  item-value="id"
                  item-text="name"
                  @change="getPlant"
                ></v-autocomplete>
              </div>
              <div>
                <p class="mb-2">Plant</p>
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
              </div>
              <div>
                <p class="mb-2">Division</p>
                <v-autocomplete
                  v-model="form.division_id"
                  :rules="[(v) => !!v || 'This field is required']"
                  outlined
                  dense
                  item-text="name"
                  item-value="id"
                  :items="divisions"
                  @change="(evt) => fetchDepartment(evt)"
                ></v-autocomplete>
              </div>
              <div>
                <p class="mb-2">Dept</p>
                <v-autocomplete
                  v-model="form.department_id"
                  outlined
                  dense
                  item-text="name"
                  item-value="id"
                  :items="departments"
                ></v-autocomplete>
              </div>
            </v-col>
            <div>
              <v-divider></v-divider>
            </div>
            <div class="d-flex" style="width: 100%; justify-content: end">
              <v-btn
                type="submit"
                class="mr-4 title text-capitalize"
                depressed
                color="primary"
                height="48"
                width="125"
                >Save</v-btn
              >
              <v-btn
                depressed
                height="48"
                width="125"
                class="text-primary title text-capitalize"
                color="#E1F0FF"
                to="/master/user"
                >Cancel</v-btn
              >
            </div>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import { FETCH_DIVISIONS } from "@/core/services/store/division.module";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { FETCH_PLANTS } from "@/core/services/store/plant.module";
import { FETCH_DEPARTMENTS } from "@/core/services/store/department.module";
import { SUBMIT_USER } from "@/core/services/store/user.module";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
export default {
  data() {
    return {
      form: {
        registration_number: "",
        full_name: "",
        password: "",
        confirm: "",
        phone: "",
        company_id: "",
        plant_id: "",
        division_id: "",
        department_id: "",
        role_name: "",
      },
      showPassword: false,
      showConfirm: false,
      addUser: false,
      selectedCompany: null,
      keyword: "",
    };
  },
  computed: {
    ...mapGetters({
      divisions: "getDivisions",
      companies: "getCompanies",
      plants: "getPlants",
      departments: "getDepartments",
    }),
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Create User");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Users" },
      { title: "Create User" },
    ]);
    this.$store.dispatch(FETCH_COMPANIES);
  },
  methods: {
    editItem(item) {
      this.selectedCompany = { ...item };
      this.addUser = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: "Are you sure want to delete User?",
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          // const response = await this.$store.dispatch(DELETE_COMPANY, item.id);
          // toastResponse(response);
          // this.$store.dispatch(FETCH_COMPANIES);
        },
      });
    },
    async doSubmit() {
      if (this.$refs.userForm.validate()) {
        const response = await this.$store.dispatch(SUBMIT_USER, this.form);
        toastResponse(response);
        if (response.success) {
          this.$router.push("/master/user");
        }
      }
    },
    successSave() {
      this.addUser = false;
      this.$store.dispatch(FETCH_COMPANIES);
    },
    getPlant(evt) {
      this.$store.dispatch(FETCH_PLANTS, evt);
    },
    getDivision(evt) {
      this.$store.dispatch(FETCH_DIVISIONS, evt);
    },
    fetchDepartment(id) {
      this.$store.dispatch(FETCH_DEPARTMENTS, id);
    },
  },
};
</script>
