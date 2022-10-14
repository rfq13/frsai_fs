<template>
  <div>
    <div class="d-flex">
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
      <v-btn
        color="successLow"
        class="mr-4 text-success ml-auto"
        depressed
        height="34"
        @click="dialogImport = true"
      >
        <v-icon color="success" class="mr-2" small> mdi-inbox-arrow-up </v-icon>

        import Data
      </v-btn>
      <v-btn
        type="button"
        color="#1BC5BD"
        class="title text-capitalize text-white ml-3 mb-5"
        depressed
        @click="showAddItem = true"
      >
        <v-icon>mdi-plus</v-icon> Add</v-btn
      >
    </div>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:[`item.actions`]="{ item, index }">
        <v-icon class="mr-2" @click="editItem({ ...item, id: index })">
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteItem(index)"> mdi-delete </v-icon>
      </template>
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:[`item.specialTools`]="{ item }">
        {{ item.jis_no.map((st) => st.special_tool.name).join(", ") }}
      </template>
      <template v-slot:[`item.jis_no`]="{ item }">
        {{ item.jis_no.map((st) => st.title).join(", ") }}
      </template>
    </v-data-table>
    <v-row v-if="showAction" class="mt-6">
      <v-col md="12">
        <v-divider></v-divider>
        <div class="d-flex">
          <v-btn
            type="button"
            color="#E1F0FF"
            class="title text-capitalize text-primary"
            height="48"
            width="125"
            depressed
            @click="$emit('prev')"
            >Previous</v-btn
          >
          <v-btn
            type="submit"
            color="primary"
            class="ml-auto title text-capitalize"
            height="48"
            width="125"
            depressed
            @click="doNext"
            >Next</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="showAddItem" width="1100">
      <v-card>
        <v-card-title>
          <div>
            <p class="mb-0">
              {{ step1Data.machine_id.name }} ({{
                step1Data.machine_id.description
              }})
            </p>
            <p class="text-body-1 grey--text mb-0">Add Item Check</p>
          </div>
          <v-icon class="ml-auto" @click="showAddItem = false"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <item-check-form
            :selectedItem="selectedItem"
            @update="submitItem"
            @submit="submitItem"
            @close="showAddItem = false"
            :jis="jis"
            :ledgerMethods="ledgerMethods"
            :specialTools="specialTools"
            :spareparts="spareparts"
          ></item-check-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogImport" width="750">
      <v-card>
        <v-card-title>Import Data Item Check</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <base-upload-file @uploaded="previewFiles"
            :removeFile="removeFile"></base-upload-file>
          <v-divider></v-divider>
          <div class="d-flex justify-end">
            <v-btn color="primary" height="40" @click="mergeWithImport" depressed>Submit</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ItemCheckForm from "@/view/components/Ledger/ItemCheckForm.vue";
import BaseUploadFile from "@/view/components/base/BaseUploadFile.vue";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { filterPrice } from "@/core/plugins/filters";
import { read, utils } from "xlsx";
import { mapGetters } from "vuex";
import { FETCH_SPAREPARTS } from "@/core/services/store/sparePart.module";
import { FETCH_LEDGERMETHODS } from "@/core/services/store/ledgerMethod.module";
import { FETCH_SPECIALTOOLS } from "@/core/services/store/specialTools.module";
import { FETCH_JIS } from "@/core/services/store/jis.module";
import { BASE_API_URL } from "../../../../constant";

export default {
  filters: {
    filterPrice,
  },
  props: {
    showAction: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ItemCheckForm,
    BaseUploadFile,
  },
  computed: {
    ...mapGetters({
      spareparts: "getSpareParts",
      ledgerMethods: "getLedgerMethod",
      specialTools: "getSpecialTools",
      jis: "getJis",
    }),
  },
  data() {
    return {
      templateUrl: BASE_API_URL + "excels/import_item_check.xlsx",
      removeFile: false,
      dialogImport: false,
      importData: [],
      headers: [
        { text: "Action", value: "actions" },
        { text: "No", value: "index" },
        {
          text: "Item Check",
          align: "start",
          value: "name",
        },
        {
          text: "Location",
          align: "start",
          value: "location",
        },
        { text: "Method", value: "ledgerMethod.name" },
        { text: "MP", value: "mp" },
        { text: "JIS No", value: "jis_no" },
        { text: "Special Tool Support", value: "specialTools", width: "120px" },
        { text: "Std Measurement", value: "selectedStd" },
        { text: "Initial Start", value: "init" },
        { text: "Period", value: "duration" },
      ],
      showAddItem: false,
      selectedItem: null,
      keyword: "",
      items: [],
      step1Data: {},
    };
  },
  mounted() {
    this.$store.dispatch(FETCH_JIS);
    this.$store.dispatch(FETCH_SPAREPARTS);
    this.$store.dispatch(FETCH_LEDGERMETHODS);
    this.$store.dispatch(FETCH_SPECIALTOOLS);


    const dataStep1 = window.localStorage.getItem("step-1");
    if (dataStep1) {
      this.step1Data = JSON.parse(dataStep1);
      console.log(this.step1Data.machine_id.description)
    }
    const datas = window.localStorage.getItem("step-2");
    if (datas) {
      this.items = JSON.parse(datas);
    }
  },
  watch: {
    showAddItem: {
      handler: function (val) {
        const dataStep1 = window.localStorage.getItem("step-1");
        if (dataStep1) {
          this.step1Data = JSON.parse(dataStep1);
        }
      },
      deep: true,
    },
  },
  methods: {
    submitItem(data) {
      if (data.id) {
        this.items[data.id] = data;
      } else {
        this.items.push(data);
      }
      this.selectedItem = {};
      this.showAddItem = false;
    },
    editItem(item) {
      this.selectedItem = { ...item };
      this.showAddItem = true;
    },
    deleteItem(index) {
      this.items = this.items.filter((item, i) => i != index);
    },
    doNext() {
      if (this.items.length == 0) {
        toastResponse({
          success: false,
          message: "Please Input Item check",
        });
        return;
      }
      window.localStorage.setItem("step-2", JSON.stringify(this.items));
      this.$emit("next");
    },
    previewFiles(f) {
      var reader = new FileReader();
      const vue = this;
      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        
        let worksheet = workbook.Sheets[sheetName];
        
        const datas = utils.sheet_to_json(worksheet);

        vue.importData = [];
        
        const imports = [];
        for (let i = 0; i < datas.length; i++) {
          const data = datas[i];
          imports.push(vue.mappingResult(data));
        }
        // console.log(vue.mappedLines, { datas, imports });
        // console.log(imports);
        vue.importData = imports;
      };
      reader.readAsArrayBuffer(f);
    },
    mappingResult(data){

      return {
        duration: data.Duration,
        flg_periodic: data['Flag Period'],
        incharge: data['In Charge'],
        init: data['Initial Start'].replaceAll("'", ''),
        jis_no: data['JIS'].split('|').map(j=>{
          const jis = this.jis.find(ji=>ji.title.toLowerCase() == j.toLowerCase());
          return jis;
        }),
        sparepart: this.spareparts.find(s=>s.spare_part_no == data['Spare Part No'].replaceAll("'", '')),
        ledgerMethod: this.ledgerMethods.find(l=>l.code.toLowerCase() == data['Ledger Method'].toLowerCase()),
        location: data['Location'],
        lowerLimit: data['Std Measurement'].toLowerCase() == "range" ? this.fixingLimitFormat(data['lower limit']) :  null,
        mp: data['MP'],
        name: data['Item Check Name'],
        periodic: data['Period'],
        qty: data['Qty'],
        selectedStd: data['Std Measurement'],
        stdNg: data['Std Measurement'].toLowerCase() == "range" ? null :  data['std ng'],
        stdOk: data['Std Measurement'].toLowerCase() == "range" ? null :  data['std ok'],
        upperLimit: data['Std Measurement'].toLowerCase() == "range" ? this.fixingLimitFormat(data['upper limit']) :  null,
        warninUpperLimit: data['Std Measurement'].toLowerCase() == "range" ? this.fixingLimitFormat(data['warning upper limit']) :  null,
        warningLowerLimit: data['Std Measurement'].toLowerCase() == "range" ? this.fixingLimitFormat(data['warning lower limit']) : null
      }
    },
    fixingLimitFormat(str){
      
      return parseFloat((str+"").trim().replace(/,/g,'.'));
    },
    mergeWithImport() {
      this.items = [...this.items, ...this.importData];
      this.removeFile = true;
      this.dialogImport = false;
      this.importData = [];
    },
  },
};
</script>
