<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master User</h1>
          <div class="ml-auto">
            <v-btn
              color="successLow"
              class="mr-4 text-success"
              depressed
              height="34"
              @click="dialogImport = true"
            >
              <v-icon color="success" class="mr-2" small>
                mdi-inbox-arrow-up
              </v-icon>

              import Data
            </v-btn>
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="usersWithNumber"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Users-${new Date()
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
                  selectedUser = null;
                  addUser = true;
                  editUser = false;
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
          :items="users"
          :headers="headers"
          :loading="loading"
          loading-text="Loading..."
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addUser" width="650">
      <v-card>
        <v-card-title>
          {{ editUser ? "Edit" : "Create" }} User
          <v-icon
            class="ml-auto"
            @click="
              addUser = false;
              editUser = false;
            "
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <user-form
            :selectedUser="selectedUser"
            @close="
              addUser = false;
              editUser = false;
            "
            @success="successSave"
            :onYes="successSave"
            :editPlant="true"
            :editDiv="true"
            :editCompany="true"
          ></user-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImport" width="750">
      <v-card>
        <v-card-title>Import Data user</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <base-upload-file></base-upload-file>
          <v-divider></v-divider>
          <div class="d-flex justify-end">
            <v-btn color="primary" height="40" depressed>Submit</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { FETCH_USERS, DELETE_USER } from "@/core/services/store/user.module";
import UserForm from "@/view/components/User/form.vue";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import BaseUploadFile from "@/view/components/base/BaseUploadFile";
export default {
  components: {
    UserForm,
    BaseUploadFile,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        Name: "full_name",
        Email: "email",
        "No Reg": "registration_number",
        "Div/Dept": "departement",
        Role: "role_name",
        "Created By": "create_by",
        "Created At": "createdAt",
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
          text: "NAME",
          align: "start",
          value: "full_name",
        },
        { text: "EMAIL", value: "email" },
        {
          text: "NO REG",
          align: "start",
          value: "registration_number",
        },
        { text: "DIV/DEPT", value: "departement" },
        { text: "ROLE", value: "RoleName" },
        { text: "CREATED BY", value: "create_by" },
        { text: "CREATED AT", value: "createdAt" },
        { text: "Action", value: "actions" },
      ],
      addUser: false,
      editUser: false,
      selectedUser: {},
      keyword: "",
      dialogImport: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      users: "getUsers",
    }),
    usersWithNumber() {
      return this.users.map((user, index) => ({ ...user, no: index + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Users");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Users" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_USERS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedUser = { ...item };
      this.addUser = true;
      this.editUser = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.full_name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_USER, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_USERS);
        },
      });
    },
    successSave() {
      this.addUser = false;
      this.editUser = false;
      this.$store.dispatch(FETCH_USERS);
    },
  },
};
</script>
