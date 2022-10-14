<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master JIS</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredJis"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Jis-${new Date().toISOString().substr(0, 10)}.xls`"
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
                  selectedJIS = null;
                  addJis = true;
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
              v-model="search"
            ></v-text-field>
          </div>
        </div>

        <v-data-table
          class="mt-5"
          :items="filteredJis"
          :headers="headers"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addJis" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedJIS ? "Edit" : "Create" }} JIS
          <v-icon class="ml-auto" @click="addJis = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <jis-form
            :selectedJIS="selectedJIS"
            @close="addJis = false"
            @success="successSave"
          ></jis-form>
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
import { FETCH_JIS, DELETE_JIS } from "@/core/services/store/jis.module";
import JisForm from "@/view/components/Jis/JisForm.vue";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";

export default {
  components: {
    JisForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "JIS No": "number",
        "JIS Name": "title",
        "Special Tools": "special_tool_id",
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
          text: "Jis No",
          align: "start",
          value: "number",
        },
        { text: "JIS Name", value: "title" },
        { text: "Special Tools", value: "special_tool_id" },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addJis: false,
      selectedJIS: null,
      search: "",
    };
  },
  computed: {
    ...mapGetters({
      jis: "getJis",
    }),
    filteredJis() {
      if (!this.search) {
        return this.jis.map((jis, index) => ({ ...jis, no: index + 1 }));
      }
      return this.jis.filter((jis) => {
        return `${jis.title}`
          .toLowerCase()
          .includes(this.search.toLowerCase())
          .map((jis, index) => ({ ...jis, no: index + 1 }));
      });
    },
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "JIS");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master JIS" }]);
    this.$store.dispatch(FETCH_JIS);
  },
  watch: {
    jis(v) {
      // console.log(v);
    },
  },
  methods: {
    editItem(item) {
      this.selectedJIS = { ...item };
      this.addJis = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.title}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_JIS, item.uuid);
          toastResponse(response);
          this.$store.dispatch(FETCH_JIS);
        },
      });
    },
    successSave() {
      this.addJis = false;
      this.$store.dispatch(FETCH_JIS);
    },
  },
};
</script>
