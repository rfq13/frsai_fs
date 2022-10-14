<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Ledger Method</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredLedger"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-LedgerMethod-${new Date()
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
                  selectedLedgerMethod = null;
                  addLedgerMethod = true;
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
          :items="filteredLedger"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addLedgerMethod" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedLedgerMethod ? "Edit" : "Create" }} LedgerMethod
          <v-icon class="ml-auto" @click="addLedgerMethod = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <LedgerMethod-form
            :selectedLedgerMethod="selectedLedgerMethod"
            @close="addLedgerMethod = false"
            @success="successSave"
          ></LedgerMethod-form>
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
import LedgerMethodForm from "@/view/components/LedgerMethod/LedgerMethodForm.vue";
import {
  FETCH_LEDGERMETHODS,
  DELETE_LEDGERMETHOD,
} from "@/core/services/store/ledgerMethod.module";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
export default {
  components: {
    LedgerMethodForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Method Code": "code",
        "Method Name": "name",
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
          text: "Method Code",
          align: "start",
          value: "code",
        },
        {
          text: "Method Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addLedgerMethod: false,
      selectedLedgerMethod: null,
      keyword: "",
      loading: true,
    };
  },
  computed: {
    ...mapGetters({
      ledgerMethods: "getLedgerMethod",
    }),
    filteredLedger() {
      if (this.keyword) {
        return this.ledgerMethods
          .filter((lm) => {
            return `${lm.code} ${lm.name} ${lm.description}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((lm, i) => ({ ...lm, no: i + 1 }));
      }
      return this.ledgerMethods.map((lm, i) => ({ ...lm, no: i + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Ledger Method");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Ledger Method" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_LEDGERMETHODS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedLedgerMethod = { ...item };
      this.addLedgerMethod = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_LEDGERMETHOD,
            item.uuid
          );
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_LEDGERMETHODS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addLedgerMethod = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_LEDGERMETHODS);
      this.loading = false;
    },
  },
};
</script>
