<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Division</h1>
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
              :data="divisionWithNumber"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Divisions-${new Date()
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
                  selectedDivision = null;
                  addDivision = true;
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
          :items="filteredDivisions"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
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
    <v-dialog v-model="addDivision" width="650">
      <v-card>
        <v-card-title>
          {{ selectedDivision ? "Edit" : "Create" }} Division
          <v-icon class="ml-auto" @click="addDivision = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <division-form
            :selectedDivision="selectedDivision"
            @close="addDivision = false"
            @success="successSave"
          ></division-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
const user = JSON.parse(localStorage.getItem("user"));
import { mapGetters } from "vuex";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import DivisionForm from "@/view/components/Division/DivisionForm.vue";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import {
  FETCH_DIVISIONS,
  DELETE_DIVISION,
} from "@/core/services/store/division.module";
import { PROFILE } from "@/core/services/store/auth.module";
export default {
  components: {
    DivisionForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Divison Code": "code",
        "Divison Name": "name",
        Description: "description",
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
          text: "Division Code",
          align: "start",
          value: "code",
        },
        {
          text: "Division Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Plant - Company", value: "plant" },
        { text: "Action", value: "actions" },
      ],
      addDivision: false,
      selectedDivision: null,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      divisions: "getDivisions",
    }),
    divisionWithNumber() {
      return this.divisions.map((div, index) => ({ ...div, no: index + 1 }));
    },
    filteredDivisions() {
      if (this.keyword) {
        return this.divisions.filter((div) => {
          return `${div.code} ${div.name} ${div.description}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.divisions;
    },
  },
  watch: {
    divisions(v) {
      // console.log(v);
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Division");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Division" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_DIVISIONS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedDivision = { ...item };
      this.addDivision = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_DIVISION, item.id);
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_DIVISIONS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addDivision = false;
      this.selectedDivision = null;
      this.loading = true;
      await this.$store.dispatch(FETCH_DIVISIONS);
      this.loading = false;
    },
  },
};
</script>
