<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Input Counterbase</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="divisions"
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
                  selectedCounterbase = null;
                  addCounterbase = true;
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
          :items="filteredCounterbase"
          :headers="headers"
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.machine`]="{ item }">
            {{ item.machine_id == 0 ? "All" : item.machine.name }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addCounterbase" width="650">
      <v-card>
        <v-card-title>
          {{ selectedCounterbase ? "Edit" : "Create" }} Counterbase
          <v-icon class="ml-auto" @click="addCounterbase = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <counterbase-form
            :selectedCounterbase="selectedCounterbase"
            @close="addCounterbase = false"
            @success="successSave"
          ></counterbase-form>
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
import CounterbaseForm from "@/view/components/Counterbase/CounterbaseForm.vue";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import {
  FETCH_COUNTERBASES,
  DELETE_COUNTERBASE,
} from "@/core/services/store/counterbase.module";
export default {
  components: {
    CounterbaseForm,
  },
  data() {
    return {
      json_fields: {
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
          text: "Machine",
          align: "start",
          value: "machine",
        },
        {
          text: "Line",
          align: "start",
          value: "line.name",
        },
        { text: "Date", value: "date" },
        { text: "count", value: "count" },
        { text: "Action", value: "actions" },
      ],
      addCounterbase: false,
      selectedCounterbase: null,
      keyword: "",
    };
  },
  computed: {
    ...mapGetters({
      counterbases: "getCounterbases",
    }),
    filteredCounterbase() {
      if (this.keyword) {
        return this.counterbases.filter((div) => {
          return `${div.machine.name} ${div.line.name}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.counterbases;
    },
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Counterbase");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Input Counterbase" }]);

    this.$store.dispatch(FETCH_COUNTERBASES);
  },
  methods: {
    editItem(item) {
      this.selectedCounterbase = { ...item };
      this.addCounterbase = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_COUNTERBASE,
            item.uuid
          );
          toastResponse(response);
          this.$store.dispatch(FETCH_COUNTERBASES);
        },
      });
    },
    successSave() {
      this.addCounterbase = false;
      this.selectedCounterbase = null;
      this.$store.dispatch(FETCH_COUNTERBASES);
    },
  },
};
</script>
