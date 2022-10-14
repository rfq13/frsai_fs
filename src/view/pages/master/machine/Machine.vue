<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Machine</h1>
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
              :data="machines"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Machines-${new Date()
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
                  selectedMachine = null;
                  addMachine = true;
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
          :items="filteredMachines"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.maker`]="{ item }">
            {{ item.maker }} -
            {{ item.type_machine ? item.type_machine.name : "" }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                  <v-icon size="32">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item style="width: 122px" @click="editItem(item)"
                  >Edit</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item
                  style="width: 122px"
                  class="error--text"
                  @click="deleteItem(item)"
                  >Delete</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item style="width: 122px" @click="assignPIC(item)"
                  >Assign PIC</v-list-item
                >
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addMachine" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedMachine ? "Edit" : "Add" }} Machine
          <v-icon
            class="ml-auto"
            @click="
              addMachine = false;
              editMachine = false;
              selectedMachine = null;
            "
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <machine-form
            :selectedMachine="selectedMachine"
            @close="
              addMachine = false;
              editMachine = false;
              selectedMachine = null;
            "
            @success="successSave"
          ></machine-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAssignPic" width="650">
      <v-card>
        <v-card-title>
          Assign PIC
          <v-icon class="ml-auto" @click="isAssignPic = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="picForm" @submit.prevent="doSubmitPic">
            <div>
              <b-form-group label="Tipe PIC" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  id="radio-slots"
                  v-model="pic_form.type"
                  :options="options"
                  :aria-describedby="ariaDescribedby"
                  name="radio-options-slots"
                >
                  <b-form-radio value="vendor">Vendor</b-form-radio>
                  <b-form-radio value="Production">Production</b-form-radio>
                  <b-form-radio value="Maintenance">Maintenance</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
              <v-autocomplete
                v-model="pic_form.users"
                outlined
                dense
                :items="users"
                item-value="id"
                item-text="full_name"
                @change="getUser"
                multiple
                selected
              ></v-autocomplete>
            </div>
            <div>
              <v-divider></v-divider>
            </div>
            <div class="d-flex" style="width: 100%; justify-content: end">
              <v-btn
                type="submit"
                class="mr-4 title text-capitalize"
                depressed
                color="primary"
                height="48"
                width="125"
                >Save</v-btn
              >
              <v-btn
                depressed
                height="48"
                width="125"
                class="text-primary title text-capitalize"
                color="#E1F0FF"
                @click="isAssignPic = false"
                >Cancel</v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImport" width="750">
      <v-card>
        <v-card-title>Import Data Machine</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <base-upload-file
            @uploaded="previewFiles"
            :removeFile="removeFile"
          ></base-upload-file>
          <v-divider></v-divider>
          <div class="d-flex justify-end">
            <v-btn color="primary" height="40" @click="importing" depressed
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
import MachineForm from "@/view/components/Machine/MachineForm.vue";
import {
  DELETE_MACHINE,
  FETCH_MACHINES,
  ASSIGN_MACHINE_PIC,
  FETCH_TYPES,
  IMPORT_MACHINES,
} from "@/core/services/store/machine.module";
import { FETCH_CELLS } from "@/core/services/store/cell.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import { FETCH_USERS } from "@/core/services/store/user.module";
import BaseUploadFile from "@/view/components/base/BaseUploadFile.vue";
import { read, utils } from "xlsx";
import constant from "../../../../../constant";
export default {
  components: {
    MachineForm,
    BaseUploadFile,
  },
  data() {
    return {
      templateUrl: constant.BASE_API_URL + "excels/importMachine.xlsx",
      removeFile: false,
      dialogImport: false,
      json_fields: {
        No: "no",
        Code: "code",
        "Machine Name": "name",
        "Operation Number": "operation_number",
        "PIC Vendor": "pic_vendor",
        "PIC Maintenance": "pic_vendor",
        "PIC Vendor": "pic_vendor",
        "PIC Production": "pic_production",
        Maker: "maker",
        Type: "type_machine.name",
        Year: "release_year",
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
          text: "Code",
          align: "start",
          value: "code",
        },
        {
          text: "Machine Name",
          align: "start",
          value: "name",
        },
        { text: "Operation Number", value: "operation_number" },
        { text: "SN", value: "serial_number" },
        { text: "PIC Vendor", value: "pic_vendor" },
        { text: "PIC Maintenance", value: "pic_maintenance" },
        { text: "PIC Production", value: "pic_production" },
        { text: "Maker - Type", value: "maker" },
        { text: "Year", value: "release_year" },
        { text: "Action", value: "actions" },
      ],
      addMachine: false,
      editMachine: false,
      isAssignPic: false,
      selectedMachine: null,
      keyword: "",
      pic_type: "",
      pic_form: {
        users: null,
        type: null,
      },
      mappedTypes: {}, // map the types for import machine purpose
      mappedCells: {},
      mappedLines: {},
      importData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      machines: "getMachines",
      users: "getUsers",
      types: "getTypes",
      cells: "getCells",
      lines: "getLines",
    }),
    filteredMachines() {
      if (this.keyword) {
        return this.machines
          .filter((machine) => {
            return `${machine.code} ${machine.name} ${machine.operation_number} ${machine.serial_number} ${machine.maker}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((mac, i) => ({ ...mac, no: i + 1 }));
      }
      return this.machines.map((mac, i) => ({ ...mac, no: i + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Machine");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Machine" }]);
    this.loading = true;

    await this.$store.dispatch(FETCH_MACHINES);

    this.loading = false;

    this.$store.dispatch(FETCH_USERS);
    this.$store.dispatch(FETCH_TYPES);
    this.$store.dispatch(FETCH_LINES);
    this.$store.dispatch(FETCH_CELLS);
  },
  watch: {
    isAssignPic(val) {
      if (!val) {
        this.pic_form = {
          users: null,
          type: null,
        };
      }
    },
    cells(v) {
      this.mapping(v, "mappedCells");
    },
    lines(v) {
      this.mapping(v, "mappedLines");
    },
    types(v) {
      this.mapping(v, "mappedTypes");
    },
    mappedTypes(v) {
      console.log(v, "mappedTypes");
    },
    importData(v) {
      console.log(v, "importData");
    },
    ["pic_form.type"](val) {
      this.pic_form.users = this.selectedMachine?.machine_pic
        .filter(
          (mp) =>
            this.capitalizeFirstLetter(mp.type) ===
            this.capitalizeFirstLetter(val)
        )
        .map((mp) => "" + mp?.user_id);

      let params = {};
      // if(this.pic_form.users.length == 0){
      if (true) {
        params = { department: this.capitalizeFirstLetter(val) };
      }

      this.$store.dispatch(FETCH_USERS, params);
    },
  },
  methods: {
    editItem(item) {
      this.selectedMachine = { ...item };
      this.addMachine = true;
      this.editMachine = true;
      // console.log(item);
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_MACHINE, item.id);
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_MACHINES);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addMachine = false;
      this.editMachine = false;
      this.selectedMachine = null;
      this.loading = true;
      await this.$store.dispatch(FETCH_MACHINES);
      this.loading = false;
    },
    assignPIC(item) {
      this.selectedMachine = { ...item };
      this.isAssignPic = true;
    },
    async doSubmitPic() {
      if (this.$refs.picForm.validate()) {
        const response = await this.$store.dispatch(ASSIGN_MACHINE_PIC, {
          id: this.selectedMachine?.id,
          payload: this.pic_form,
        });
        toastResponse(response);
        this.loading = true;
        await this.$store.dispatch(FETCH_MACHINES);
        this.loading = false;
        this.isAssignPic = false;
      }

      // console.log(this.pic_form);
      // console.log(this.selectedMachine);
    },
    getUser() {
      this.$store.dispatch(FETCH_USERS);
    },
    capitalizeFirstLetter(string) {
      if (!string) return string;
      // capitalize first letter every word
      return string
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    },
    previewFiles(f) {
      var reader = new FileReader();
      const vue = this;
      reader.onload = function (e) {
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
            code: data.Code,
            name: data.Name,
            pic: data.PIC,
            operation_number: data["Operation Number"],
            serial_number: data["Serial Number"],
            process_name: data["Process Name"],
            release_year: data.Year,
            maker: data.Maker,
            machine_type_id: vue.mappedTypes[data["Machine Type Code"]],
            description: data.Description,
            line_id: vue.mappedLines[data["Line Code"]],
            cell_id: vue.mappedCells[data["Cell Code"]],
          });
        }
        console.log(vue.mappedLines, { datas, imports });
        vue.importData = imports;
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
      await this.$store.dispatch(IMPORT_MACHINES, this.importData);
      this.dialogImport = false;
      this.removeFile = true;
      // and then fetch machines
      console.log("importing done!");
      this.loading = true;
      await this.$store.dispatch(FETCH_MACHINES);
      this.loading = false;
    },
  },
};
</script>
