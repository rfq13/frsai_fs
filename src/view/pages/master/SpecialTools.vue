<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Special Tools</h1>
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
              color="successLow"
              class="mr-4 text-success"
              depressed
              height="34"
              :href="templateUrl"
            >
              <v-icon color="success" class="mr-2" small>
                mdi-file-excel
              </v-icon>

              Download Template
            </v-btn>
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredSpecialTools"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-SpecialTools-${new Date()
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
                  selectedTool = null;
                  addSpecialTools = true;
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
          :items="filteredSpecialTools"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            {{ item.status == "0" ? "Elektrikal" : "Mekanikal" }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addSpecialTools" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedTool ? "Edit" : "Create" }} Special Tools
          <v-icon class="ml-auto" @click="addSpecialTools = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <SpecialTools-form
            :selectedTool="selectedTool"
            @close="addSpecialTools = false"
            @success="successSave"
          ></SpecialTools-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImport" width="750">
      <v-card>
        <v-card-title>Import Data Tools</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <base-upload-file
            @uploaded="previewFiles"
            :removeFile="removeFile"
          ></base-upload-file>
          <v-divider></v-divider>
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              height="40"
              @click="importing"
              depressed
              :loading="loadingImport"
              >Submit</v-btn
            >
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
import SpecialToolsForm from "@/view/components/SpecialTools/SpecialToolsForm.vue";
import {
  FETCH_SPECIALTOOLS,
  DELETE_SPECIALTOOL,
  IMPORT_SPECIALTOOLS,
} from "@/core/services/store/specialTools.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import BaseUploadFile from "@/view/components/base/BaseUploadFile.vue";
import { read, utils } from "xlsx";
import constant from "../../../../constant";
export default {
  components: {
    SpecialToolsForm,
    BaseUploadFile,
  },
  data() {
    return {
      templateUrl: constant.BASE_API_URL + "excels/Tools.xlsx",
      dialogImport: false,
      json_fields: {
        No: "no",
        Code: "code",
        "SpecialTools Name": "name",
        Available: "is_available",
        Status: {
          field: "status",
          callback: (value) => (value == "0" ? "Elektrikal" : "Mekanikal"),
        },
      },
      headers: [
        { text: "No", value: "no" },
        { text: "Code", value: "code" },
        {
          text: "SpecialTools Name",
          align: "start",
          value: "name",
        },
        { text: "Available", value: "is_available" },
        { text: "status", value: "status" },
        { text: "Action", value: "actions" },
      ],
      addSpecialTools: false,
      selectedTool: null,
      keyword: "",
      importData: [],
      loadingImport: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      specialTools: "getSpecialTools",
    }),
    filteredSpecialTools() {
      if (this.keyword) {
        return this.specialTools
          .filter((st) => {
            return `${st.code} ${st.name} ${st.status}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((st, i) => ({ ...st, no: i + 1 }));
      }
      return this.specialTools.map((st, i) => ({ ...st, no: i + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Special Tools");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Special Tools" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_SPECIALTOOLS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedTool = { ...item };
      this.addSpecialTools = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_SPECIALTOOL,
            item.uuid
          );
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_SPECIALTOOLS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addSpecialTools = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_SPECIALTOOLS);
      this.loading = false;
    },
    previewFiles(f) {
      var reader = new FileReader();
      const vue = this;
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        // console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        // console.log(utils.sheet_to_json(worksheet));
        const datas = utils.sheet_to_json(worksheet);
        const imports = [];
        console.log(vue.mappedTypes, "turin");
        for (let i = 0; i < datas.length; i++) {
          const data = datas[i];
          imports.push({
            code: data.Code,
            name: data.Name,
            description: data.Description,
            is_available: data.Available == "Available",
            status: data.Status == "Elektrikal" ? "0" : "1",
          });
        }
        this.importData = imports;
      };
      reader.readAsArrayBuffer(f);
    },
    mapping(data, state) {
      const temp = {};
      for (let i = 0; i < data.length; i++) {
        const type = data[i];
        temp[type.code] = type.id;
      }

      this[state] = temp;
    },
    async importing(e) {
      console.log("importing machines... ");
      // importing process
      this.loadingImport = true;
      const response = await this.$store.dispatch(
        IMPORT_SPECIALTOOLS,
        this.importData
      );
      toastResponse(response);
      this.loadingImport = false;
      this.dialogImport = false;
      this.removeFile = true;
      // and then fetch machines
      this.$store.dispatch(FETCH_SPECIALTOOLS);
    },
  },
};
</script>
