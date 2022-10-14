<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Users</h1>
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
            <v-btn
              color="#e1f0ff"
              class="mr-4 text-primary"
              depressed
              height="34"
              ><v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export</v-btn
            >
            <v-btn
              color="primary"
              to="/master/user/create"
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

        <v-data-table class="mt-5" :items="users" :headers="headers">
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

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
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import BaseUploadFile from "@/view/components/base/BaseUploadFile";
import { FETCH_USERS, DELETE_USER } from "@/core/services/store/user.module";
export default {
  components: {
    BaseUploadFile,
  },
  data() {
    return {
      headers: [
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
        { text: "ROLE", value: "role_name" },
        { text: "CREATED BY", value: "create_by" },
        { text: "CREATED AT", value: "createdAt" },
        { text: "Action", value: "actions" },
      ],
      addUser: false,
      selectedCompany: null,
      keyword: "",
      dialogImport: false,
    };
  },
  computed: {
    ...mapGetters({
      users: "getUsers",
    }),
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Users");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Users" }]);
    this.$store.dispatch(FETCH_USERS);
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
          const response = await this.$store.dispatch(DELETE_USER, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_USERS);
        },
      });
    },
    successSave() {
      this.addUser = false;
      this.$store.dispatch(FETCH_COMPANIES);
    },
  },
};
</script>
