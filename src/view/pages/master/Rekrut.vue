<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Rekrut</h1>
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
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="users"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Admin-${new Date()
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
                  selectedUser = null;
                  addUser = true;
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
              v-model="keyword"
            ></v-text-field>
          </div>
        </div>

        <v-data-table class="mt-5" :items="employees" :headers="headers" :search="keyword">
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
    <v-dialog v-model="addUser" width="650">
      <v-card>
        <v-card-title>
          {{ editUser ? "Edit" : "Create" }} Admin
          <v-icon
            class="ml-auto"
            @click="
              addUser = false;
              editUser = false;
            "
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <user-form
            :selectedUser="selectedUser"
            @close="
              addUser = false;
              editUser = false;
            "
            @success="successSave"
            :onYes="successSave"
            :editPlant="true"
            :editDiv="true"
            :editCompany="true"
            :isAdmin="true"
          ></user-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImport">
      <v-card>
        <v-card-title>Import Data Rekrut</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <template>
            <v-stepper v-model="importStep">
              <v-stepper-header>
                <v-stepper-step
                  :complete="importStep > 1"
                  step="1"
                >
                  Import Data
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :complete="importStep > 2"
                  step="2"
                >
                  Preview Data
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card-text>
                    <base-upload-file
                      @uploaded="previewFiles"
                      :removeFile="removeFile"
                    ></base-upload-file>
                  </v-card-text>
                  <v-divider></v-divider>
                  <div class="d-flex justify-end">
                    <v-btn color="primary" height="40" @click="importStep = 2" depressed>Preview</v-btn>
                  </div>

                  <div class="d-flex justify-start">
                    <v-btn text>
                      Previous
                    </v-btn>
                  </div>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card>
                    <v-card-text class="py-8 px-6" style="color: #3f4254">

                      <div class="d-flex flex-wrap my-8">
                        <div class="ml-auto d-flex" style="align-items: center">
                          Search:
                          <v-text-field
                            outlined
                            dense
                            hide-details
                            class="ml-3"
                            clearable
                            v-model="searchPreview"
                          ></v-text-field>
                        </div>
                      </div>

                      <v-data-table class="mt-5" :items="importDataValues" :headers="headerPreview" :search="searchPreview">
                        <!-- <template v-slot:[`item.no`]="{ index }">
                          {{ index + 1 }}
                        </template> -->
                        <!-- <template v-slot:[`item.actions`]="{ item }">
                          <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
                        </template> -->
                      </v-data-table>
                    </v-card-text>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="doSubmit"
                  >
                    Submit
                  </v-btn>

                  <v-btn text @click="importStep = 1">
                    Prev
                  </v-btn>
                  <v-btn text @click="cancelImport">
                    Cancel
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </template>
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
import { IMPORT_EMPLOYEES,FETCH_EMPLOYEES, DELETE_EMPLOYEE } from "@/core/services/store/employee.module";
import UserForm from "@/view/components/User/form.vue";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import BaseUploadFile from "@/view/components/base/BaseUploadFile";
import { read, utils } from "xlsx";
import dayjs from "dayjs";
export default {
  components: {
    UserForm,
    BaseUploadFile,
  },
  data() {
    return {
      importStep: 1,
      importData: {},
      importDataValues: [],
      importDataKeys: [],
      removeFile:false,
      headers: [
        // header is No KTP, Nama, NPWP, Tempat, Tgl Lahir, Kewarganegaraan, Kebangsaan, No Telp 1, No Telp 2, Email, Difabel, Jenis Kelamin, Agama, Status Pernikahan, Tinggi Badan, Training/Kursus, Bahasa Asing, Nama Kerabat, No. Kerabat, Hubungan Kekerabatan, Tanggal Tes, Tempat Tes, Tanggal Pengumuman, Hasil Tangan Basah, Catatan Tangan Basah, Hasil Tes Tulis, Catatan Tes Tulis, Hasil Mcu, Catatan Hasil Mcu, Interview Hr, Catatan Interview Hr, Interview User, Catatan Interview User, Rapid Tes, Status, Catatan Status, Posisi, Desa, RT/RW, Kelurahan, Kecamatan, Kabupaten, Provinsi, Kode pos, Tingkat, Institusi, Jurusan, Tahun Mulai, Tahun Selesai, Nama Pasangan, Tanggal Pernikahan, Tempat lahir pasangan, Tanggal Lahir Pasangan, Nama Ibu, Nama Ayah, Nama Ibu Mertua, Nama ayah mertua, Nama Anak, Anak ke, Tempat Lahir, Tanggal lahir, Keterangan

        { text: "no", value:"no"},
        { text: "", value:"actions", sortable: false },
        { text: "No KTP", value: "no_ktp" },
        { text: "Nama", value: "nama" },
        { text: "NPWP", value: "npwp" },
        { text: "Tempat", value: "tempat" },
        { text: "Tgl Lahir", value: "tgl_lahir" },
        { text: "Kewarganegaraan", value: "kewarganegaraan"},
        { text: "Kebangsaan", value: "kebangsaan" },
        { text: "No Telp 1", value: "no_telp_1" },
        { text: "No Telp 2", value: "no_telp_2" },
        { text: "Email", value: "email" },
        { text: "Difabel", value: "difabel" },
        { text: "Jenis Kelamin", value: "jenis_kelamin" },
        { text: "Agama", value: "agama" },
        { text: "Status Pernikahan", value: "status_pernikahan" },
        { text: "Tinggi Badan", value: "tinggi_badan" },
        { text: "Training/Kursus", value: "training_kursus" },
        { text: "Bahasa Asing", value: "bahasa_asing" },
        { text: "Nama Kerabat", value: "nama_kerabat" },
        { text: "No. Kerabat", value: "no_kerabat" },
        { text: "Hubungan Kekerabatan", value: "hubungan_kekerabatan" },
        { text: "Tanggal Tes", value: "tanggal_tes" },
        { text: "Tempat Tes", value: "tempat_tes" },
        { text: "Tanggal Pengumuman", value: "tanggal_pengumuman" },
        { text: "Hasil Tangan Basah", value: "hasil_tangan_basah" },
        { text: "Catatan Tangan Basah", value: "catatan_tangan_basah" },
        { text: "Hasil Tes Tulis", value: "hasil_tes_tulis" },
        { text: "Catatan Tes Tulis", value: "catatan_tes_tulis" },
        { text: "Hasil Mcu", value: "hasil_mcu" },
        { text: "Catatan Hasil Mcu", value: "catatan_hasil_mcu" },
        { text: "Interview Hr", value: "interview_hr" },
        { text: "Catatan Interview Hr", value: "catatan_interview_hr" },
        { text: "Interview User", value: "interview_user"},
        { text: "Catatan Interview User", value: "catatan_interview_user" },
        { text: "Rapid Tes", value: "rapid_tes" },
        { text: "Status", value: "status" },
        { text: "Catatan Status", value: "catatan_status" },
        { text: "Posisi", value: "posisi" },
        { text: "Desa", value: "desa" },
        { text: "RT/RW", value: "rt_rw" },
        { text: "Kelurahan", value: "kelurahan" },
        { text: "Kecamatan", value: "kecamatan" },
        { text: "Kabupaten", value: "kabupaten" },
        { text: "Provinsi", value: "provinsi" },
        { text: "Kode pos", value: "kode_pos" },
        { text: "Tingkat", value: "tingkat" },
        { text: "Institusi", value: "institusi" },
        { text: "Jurusan", value: "jurusan" },
        { text: "Tahun Mulai", value: "tahun_mulai" },
        { text: "Tahun Selesai", value: "tahun_selesai" },
        { text: "Nama Pasangan", value: "nama_pasangan" },
        { text: "Tanggal Pernikahan", value: "tanggal_pernikahan" },
        { text: "Tempat lahir pasangan", value: "tempat_lahir_pasangan" },
        { text: "Tanggal Lahir Pasangan", value: "tanggal_lahir_pasangan" },
        { text: "Nama Ibu", value: "nama_ibu" },
        { text: "Nama Ayah", value: "nama_ayah" },
        { text: "Nama Ibu Mertua", value: "nama_ibu_mertua" },
        { text: "Nama ayah mertua", value: "nama_ayah_mertua" },
        { text: "Nama Anak", value: "nama_anak" },
        { text: "Anak ke", value: "anak_ke" },
        { text: "Tempat Lahir", value: "tempat_lahir" },
        { text: "Tanggal lahir", value:"tanggal_lahir"},
        { text: "Keterangan", value:"keterangan"},
      ],
      headerPreview:[],
      addUser: false,
      editUser: false,
      selectedUser: null,
      keyword: "",
      dialogImport: false,
      json_fields: {
        Name: "full_name",
        Email: "email",
        "No Reg": "registration_number",
        "Div/Dept": "departement",
        Role: "role_name",
        "Created By": "create_by",
        "Created At": "createdAt",
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
    };
  },
  computed: {
    ...mapGetters({
      employees: "employees",
    }),
  },
  watch: {
    employees: {
      handler: function (val) {
        console.log("employees", val);
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Rekrut");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Rekrut" }]);
    this.$store.dispatch(FETCH_EMPLOYEES);
  },
  methods: {
    editItem(item) {
      this.selectedUser = { ...item };
      this.addUser = true;
      this.editUser = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.full_name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_EMPLOYEE, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_EMPLOYEES);
        },
      });
    },
    successSave() {
      this.addUser = false;
      this.editUser = false;
      this.$store.dispatch(FETCH_EMPLOYEES);
    },
    previewFiles(f) {
      var reader = new FileReader();
      const vue = this;
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = read(data, { type: "array" });
        let keys = ["No KTP"];
        let importData = {};

        workbook.SheetNames.forEach(function (sheetName) {
          let worksheet = workbook.Sheets[sheetName];
          const datas = utils.sheet_to_json(worksheet);
          if(datas.length) keys = keys.concat(Object.keys(datas[0]).filter(k=>k!=='No KTP'));

          datas.forEach((d, i) => {
            console.log("row ===>", d);

            if (!importData[d["No KTP"]]){
              importData[d["No KTP"]] = d;
              console.log("tarkatulatan ===");
            }else{
              console.log("importData ===");
            }

            const newData = {
              ...importData[d["No KTP"]],
              ...d,
            }

            keys.forEach(k => {
              if(!newData[k]) newData[k] = '';
            })
            importData[d["No KTP"]] = newData;
          });

        });

        // remove duplicate keys
        keys = keys.filter((v, i, a) => a.indexOf(v) === i);

        const dk = keys;//Object.keys(importData);
        const dv = Object.values(importData);
        const hp = keys.map((k) => {
          return {
            text: k,
            value: k,
          };
        });

        console.log({
          // keys,
          importData,
          // dk,
          dv,
          // hp,
        })

        vue.importData = importData;
        vue.importDataKeys = dk;
        vue.importDataValues = dv;
        vue.headerPreview = hp;
      };
      reader.readAsArrayBuffer(f);
    },
    doSubmit(e){
      const mappedSubmit = [];
      Object.keys(this.importData).forEach(e => {
        const data = this.importData[e];
        const process = {};
        Object.keys(data).forEach(k => {
          // fixedKey is k to lower case, remove space, point, slash, dash and comma and replace with underscore
          const fixedKey = k.toLowerCase().replace(/[\s\.\-\/,]/g, '_').replace(/__/g, '_');
          process[fixedKey] = data[k];
        })
        process.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
        process.updated_at = process.created_at;
        mappedSubmit.push(process);
      });
      console.log("import data",mappedSubmit);
      this.$store.dispatch(IMPORT_EMPLOYEES, mappedSubmit).then((response) => {
        console.log("response", response);
        toastResponse(response);
        this.cancelImport();
      });
    },
    cancelImport(){
      this.importData= {};
      this.importDataValues= [];
      this.importDataKeys= [];
      this.importStep = 1;
      this.dialogImport = false;
      this.removeFile = true;
    }
  },
};
</script>
