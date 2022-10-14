<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Department</h1>
          <div class="ml-auto">
            <!-- <v-btn
              color="#e1f0ff"
              class="mr-4 text-primary"
              depressed
              height="34"
              ><v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export</v-btn
            > -->
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredDeprtments"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Departments-${new Date()
                .toISOString()
                .substr(0, 10)}.xls`"
            >
              <v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export
            </export-excel>
            <v-btn
              color="primary"
              @click="
                () => {
                  selectedDepartment = null;
                  addDepartment = true;
                }
              "
              depressed
              class="text-capitalize font-weight-medium"
              height="34"
            >
              <v-icon small class="mr-2">mdi-plus</v-icon> New Record
            </v-btn>
          </div>
        </div>

        <div class="d-flex flex-wrap my-8">
          <div class="ml-auto d-flex" style="align-items: center">
            Search:
            <v-text-field
              v-model="keyword"
              outlined
              dense
              hide-details
              class="ml-3"
              clearable
            ></v-text-field>
          </div>
        </div>

        <v-data-table
          class="mt-5"
          :items="filteredDeprtments"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.plant`]="{ item }">
            {{ item.plant ? item.plant.name : "-" }} -
            {{ item.company ? item.company.name : "-" }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addDepartment" width="650">
      <v-card>
        <v-card-title>
          {{ selectedDepartment ? "Edit" : "Create" }} Department
          <v-icon class="ml-auto" @click="addDepartment = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <department-form
            @close="addDepartment = false"
            @success="successSave"
            :selectedDepartment="selectedDepartment"
          ></department-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
const user = JSON.parse(localStorage.getItem("user"));
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import DepartmentForm from "@/view/components/Department/DepartmentForm.vue";
import {
  FETCH_DEPARTMENTS,
  DELETE_DEPARTMENT,
} from "@/core/services/store/department.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
export default {
  components: {
    DepartmentForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Department Code": "code",
        "Department Name": "name",
        "Department Type": "type",
        Description: "description",
        Division: "division.name",
        Plant: "plant.name",
        Company: "company.name",
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
      headers: [
        { text: "No", value: "no" },
        {
          text: "Department Code",
          align: "start",
          value: "code",
        },
        {
          text: "Department Name",
          align: "start",
          value: "name",
        },
        {
          text: "Department Type",
          align: "start",
          value: "type",
        },
        { text: "Description", value: "description" },
        { text: "Division", value: "division.name" },
        { text: "Plant - Company", value: "plant" },
        { text: "Action", value: "actions" },
      ],
      addDepartment: false,
      selectedDepartment: null,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      departments: "getDepartments",
    }),
    filteredDeprtments() {
      if (this.keyword) {
        return this.departments
          .filter((department) => {
            return `${department.code} ${department.name}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((dep, index) => ({ ...dep, no: index + 1 }));
      }
      return this.departments.map((dep, index) => ({ ...dep, no: index + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Department");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Department" }]);
    this.loading = true;
    if (user.role_name != "superadmin") {
      await this.$store.dispatch(FETCH_DEPARTMENTS, {
        plant_id: user.plant_id,
      });
    } else {
      await this.$store.dispatch(FETCH_DEPARTMENTS);
    }
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedDepartment = { ...item };
      this.addDepartment = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_DEPARTMENT,
            item.id
          );
          toastResponse(response);
          if (user.role_name != "superadmin") {
            this.$store.dispatch(FETCH_DEPARTMENTS, undefined, user.plant_id);
          } else {
            this.$store.dispatch(FETCH_DEPARTMENTS);
          }
        },
      });
    },
    successSave() {
      this.addDepartment = false;
      this.selectedDepartment = null;

      if (user.role_name != "superadmin") {
        this.$store.dispatch(FETCH_DEPARTMENTS, { plant_id: user.plant_id });
      } else {
        this.$store.dispatch(FETCH_DEPARTMENTS);
      }
    },
  },
};
</script>
