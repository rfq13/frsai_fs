<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Company</h1>
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
              :data="companiesWithNumber"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Company-${new Date()
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
                  selectedCompany = null;
                  addCompany = true;
                  editCompany = false;
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
    <v-dialog v-model="addCompany" width="650">
      <v-card>
        <v-card-title>
          {{ editCompany ? "Edit" : "Create" }} Company
          <v-icon class="ml-auto" @click="addCompany = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <company-form
            :selectedCompany="selectedCompany"
            @close="addCompany = false"
            @success="successSave"
          ></company-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_COMPANIES,
  DELETE_COMPANY,
} from "@/core/services/store/company.module";
import CompanyForm from "@/view/components/Company/CompanyForm.vue";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
export default {
  components: {
    CompanyForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Company Code": "code",
        "Company Name": "name",
        Website: "website",
        Phone: "phone",
        Description: "description",
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
          text: "Company Code",
          align: "start",
          value: "code",
        },
        {
          text: "Company Name",
          align: "start",
          value: "name",
        },
        { text: "Website", value: "website" },
        { text: "Phone", value: "phone" },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addCompany: false,
      editCompany: false,
      selectedCompany: null,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      companies: "getCompanies",
    }),
    companiesWithNumber() {
      return this.companies.map((comp, index) => ({ ...comp, no: index + 1 }));
    },
    filteredCompanies() {
      if (!this.keyword) {
        return this.companies;
      }
      return this.companies.filter((company) => {
        return `${company.name} ${company.phone}`
          .toLowerCase()
          .includes(this.keyword.toLowerCase());
      });
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Company");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Company" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_COMPANIES);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedCompany = { ...item };
      this.addCompany = true;
      this.editCompany = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_COMPANY, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_COMPANIES);
        },
      });
    },
    successSave() {
      this.addCompany = false;
      this.editCompany = false;
      this.selectedCompany = {};
      this.$store.dispatch(FETCH_COMPANIES);
    },
  },
};
</script>
