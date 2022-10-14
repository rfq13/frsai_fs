<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Positions</h1>
          <div class="ml-auto">
            <export-excel
                class   = "mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
                style="height: 34px; background-color: rgb(225, 240, 255); border-color: rgb(225, 240, 255);"
                :data   = "[]"
                :fields = "json_fields"
                worksheet = "My Worksheet"
                :name    = "`Export-Position-${new Date().toISOString().substr(0, 10)}.xls`">
            
                <v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export
            </export-excel>
            <v-btn
              color="primary"
              @click="addPosition = true"
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
          :items="filteredCompanies"
          :headers="headers"
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
    <v-dialog v-model="addPosition" width="650">
      <v-card class="white">
        <v-card-title
          >Create Position
          <v-icon class="ml-auto">mdi-close</v-icon></v-card-title
        >
        <v-card-text>
          <position-form></position-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import PositionForm from "@/view/components/User/Position/PositionForm";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
export default {
  components: {
    PositionForm,
  },
  data() {
    return {
      json_fields: {
          'Position Code': 'name',
          'Position Name': 'name',
          'Description': 'description',
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
          text: "Position Code",
          align: "start",
          value: "name",
        },
        {
          text: "Position Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addPosition: false,
      selectedCompany: null,
      keyword: "",
    };
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Position");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Position" }]);
  },
  methods: {
    editItem(item) {
      this.selectedCompany = { ...item };
      this.addPosition = true;
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
    successSave() {
      this.addPosition = false;
      this.$store.dispatch(FETCH_COMPANIES);
    },
  },
};
</script>
