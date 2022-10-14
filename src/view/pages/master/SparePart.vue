<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Spare Part</h1>
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
              @click="downloadTemplate"
              :loading="loadingDownload"
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
              :data="filteredSpareparts"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-SparePart-${new Date()
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
                  selectedSparepart = null;
                  addSparePart = true;
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
          :items="filteredSpareparts"
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
    <v-dialog v-model="addSparePart" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedSparepart ? "Edit" : "Create" }} SparePart
          <v-icon class="ml-auto" @click="addSparePart = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <SparePart-form
            :selectedSparepart="selectedSparepart"
            @close="addSparePart = false"
            @success="successSave"
          ></SparePart-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImport" width="750">
      <v-card>
        <v-card-title>Import Data Spare Part</v-card-title>
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
import SparePartForm from "@/view/components/SparePart/SparePartForm.vue";

import {
  DELETE_SPAREPART,
  FETCH_SPAREPARTS,
  IMPORT_SPAREPARTS,
} from "@/core/services/store/sparePart.module";
import { mapGetters } from "vuex";

import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import api from "../../../core/services/api";
import fileDownload from "js-file-download";
import constant from "../../../../constant";
import BaseUploadFile from "@/view/components/base/BaseUploadFile.vue";
import { read, utils } from "xlsx";
export default {
  components: {
    SparePartForm,
    BaseUploadFile,
  },
  data() {
    return {
      json_fields: {},
      dialogImport: false,
      headers: [
        { text: "No", value: "no" },
        {
          text: "Spare Part No",
          align: "start",
          value: "spare_part_no",
        },
        { text: "Spare Part Name", value: "spare_part_name" },
        { text: "Machine", value: "machine.name" },
        { text: "Price per Unit", value: "price_per_unit" },
        { text: "Stock", value: "stock" },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addSparePart: false,
      selectedSparepart: null,
      keyword: "",
      loadingDownload: false,
      importData: [],
      loadingImport: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      spareParts: "getSpareParts",
    }),
    filteredSpareparts() {
      if (this.keyword) {
        return this.spareParts
          .filter((sp) => {
            return `${sp.spare_part_no} ${sp.spare_part_name} ${sp.description} ${sp.part_type}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((sp, i) => ({ ...sp, no: i + 1 }));
      }
      return this.spareParts.map((sp, i) => ({ ...sp, no: i + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Spare Part");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Spare Part" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_SPAREPARTS);
    this.loading = false;

    const jfields = {};
    const keys = Object.keys(this.headers);
    keys.forEach((key) => {
      if (this.headers[key].text != "Action")
        jfields[this.headers[key].text] = this.headers[key].value;
    });
    this.json_fields = jfields;
  },
  methods: {
    editItem(item) {
      this.selectedSparepart = { ...item };
      this.addSparePart = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.spare_part_name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_SPAREPART,
            item.uuid
          );
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_SPAREPARTS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addSparePart = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_SPAREPARTS);
      this.loading = false;
    },
    async downloadTemplate() {
      try {
        this.loadingDownload = true;
        let response = await api({
          url: `${constant.BASE_API_URL}api/spare-part/template`,
          method: "GET",
          responseType: "blob", // important
        });
        this.loadingDownload = false;

        fileDownload(response.data, `template-sparepart.xlsx`);
      } catch (error) {
        this.loadingDownload = false;
        console.log(error);
      }
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
        
        for (let i = 0; i < datas.length; i++) {
          const data = datas[i];
          imports.push({
            machine: data.Machine,
            spare_part_no: data.Sparepart_Number,
            name: data.Name,
            price: data.Price,
            stock: data.Stock,
            description: data.Description,
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
      // importing process
      this.loadingImport = true;
      const response = await this.$store.dispatch(
        IMPORT_SPAREPARTS,
        this.importData
      );

      if(!response.success){
        response.message = "Import Failed, make sure the machine is Exist";
      }
      
      toastResponse(response);
      this.loadingImport = false;
      this.dialogImport = false;
      this.removeFile = true;
      // and then fetch machines
      this.$store.dispatch(FETCH_SPAREPARTS);
    },
  },
};
</script>
