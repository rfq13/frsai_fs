<template>
  <section>
    <v-card
      class="rounded-lg"
      style="box-shadow: 0px 0px 20px rgba(56, 71, 109, 0.1) !important"
    >
      <v-divider></v-divider>
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <v-form ref="userForm" @submit.prevent="doSubmit">
          <v-row>
            <v-col md="6" cols="12">
              <div>
                <p class="mb-2">
                  No Register <span class="error--text">*</span>
                </p>
                <v-text-field
                  v-model="form.registration_number"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Required']"
                  :disabled="!!selectedUser"
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">
                  Password
                  <span v-if="!selectedUser" class="error--text">*</span>
                </p>
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  :rules="!!selectedUser ? [] : [(v) => !!v || 'Required']"
                  :append-icon="!showPassword ? `mdi-eye` : `mdi-eye-off`"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">
                  Phone Number <span class="error--text">*</span>
                </p>
                <v-text-field
                  v-model="form.phone"
                  outlined
                  dense
                  maxLength="13"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </div>
              <div>
                <p class="mb-2">Email <span class="error--text">*</span></p>
                <v-text-field
                  v-model="form.email"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </div>
            </v-col>
            <v-col md="6" cols="12">
              <div>
                <p class="mb-2">Full Name <span class="error--text">*</span></p>
                <v-text-field
                  v-model="form.full_name"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </div>
              <!-- <div>
                <p class="mb-2">Position</p>
                <v-autocomplete outlined dense></v-autocomplete>
              </div> -->
              <div v-if="!isAdmin">
                <p class="mb-2">Role <span class="error--text">*</span></p>
                <v-autocomplete
                  v-model="form.role_id"
                  outlined
                  dense
                  :items="rolesFiltered"
                  item-value="id"
                  item-text="name"
                  :rules="[(v) => !!v || 'Required']"
                ></v-autocomplete>
              </div>
              <div v-if="!isAdmin">
                <p class="mb-2">Division <span class="error--text">*</span></p>
                <v-autocomplete
                  v-model="form.division_id"
                  :rules="[(v) => !!v || 'This field is required']"
                  outlined
                  dense
                  item-text="name"
                  item-value="id"
                  :items="divisions"
                  @change="(evt) => fetchDepartment(evt)"
                  :readonly="editDiv === false"
                ></v-autocomplete>
              </div>
              <div v-if="!isAdmin">
                <p class="mb-2">Dept <span class="error--text">*</span></p>
                <v-autocomplete
                  v-model="form.department_id"
                  outlined
                  dense
                  item-text="name"
                  :rules="[(v) => !!v || 'This field is required']"
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
                :loading="loading"
                >Save</v-btn
              >
              <v-btn
                depressed
                height="48"
                width="125"
                class="text-primary title text-capitalize"
                color="#E1F0FF"
                @click="$emit('close')"
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
import { SUBMIT_USER, UPDATE_USER } from "@/core/services/store/user.module";
import { FETCH_ROLES } from "@/core/services/store/role.module";
export default {
  props: {
    onYes: {
      type: Function,
      default: () => {},
    },
    selectedUser: {
      type: Object,
      default: () => null,
    },
    editCompany: {
      type: Boolean,
      default: false,
    },
    editPlant: {
      type: Boolean,
      default: false,
    },
    editDiv: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        registration_number: "",
        full_name: "",
        password: "",
        phone: "",
        division_id: "",
        department_id: "",
        role_name: this.isAdmin ? "Admin" : "User",
        id: "",
        email: "",
        role_id: null,
      },
      showPassword: false,
      showConfirm: false,
      addUser: false,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      divisions: "getDivisions",
      companies: "getCompanies",
      plants: "getPlants",
      departments: "getDepartments",
      profile: "getProfile",
      roles: "getRoles",
    }),
    rolesFiltered() {
      const role4 = ["1", "2", "3", "9", "11"];
      return this.roles.filter((role) => role4.includes(role.id));
    },
  },
  watch: {
    selectedUser(val) {
      if (val) {
        this.getDivision(this.profile.plant_id);
        this.fetchDepartment(this.selectedUser.division_id);

        this.form.id = this.selectedUser.id;
        this.form.company_id = this.selectedUser.company_id;
        this.form.plant_id = this.selectedUser.plant_id;
        this.form.division_id = this.selectedUser.division_id;
        this.form.department_id = this.selectedUser.department_id;
        this.form.role_id = this.selectedUser.role_id;
        this.form.registration_number = this.selectedUser.registration_number;
        this.form.full_name = this.selectedUser.full_name;
        this.form.email = this.selectedUser.email;
        this.form.phone = this.selectedUser.phone;
      } else {
        this.$refs.userForm.reset();
      }

      // console.log(this.form);
    },
  },
  mounted() {
    this.getDivision(this.profile.plant_id);
    this.$store.dispatch(FETCH_ROLES);

    if (this.selectedUser?.id) {
      this.fetchDepartment(this.selectedUser.division_id);

      this.form.id = this.selectedUser.id;
      this.form.company_id = this.selectedUser.company_id;
      this.form.plant_id = this.selectedUser.plant_id;
      this.form.division_id = this.selectedUser.division_id;
      this.form.department_id = this.selectedUser.department_id;
      this.form.role_id = this.selectedUser.role_id;
      this.form.registration_number = this.selectedUser.registration_number;
      this.form.full_name = this.selectedUser.full_name;
      this.form.email = this.selectedUser.email;
      this.form.phone = this.selectedUser.phone;
    }
  },
  methods: {
    editItem(item) {
      this.selectedUser = { ...item };
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
        if (this.isAdmin) {
          this.form.role_id = 5; //role admin
        }
        this.loading = true;
        const response = await this.$store.dispatch(SUBMIT_USER, this.form);
        this.loading = false;

        toastResponse(response);
        if (response.success) {
          this.form.id = "";
          this.$refs.userForm.reset();
          this.onYes();
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
