<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Ledger TPM List</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="items"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-LedgerTpm-${new Date()
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
              to="/master/ledger-tpm/create"
              depressed
              class="text-capitalize font-weight-medium"
              height="34"
            >
              <v-icon small class="mr-2">mdi-plus</v-icon> New Record
            </v-btn>
          </div>
        </div>

        <div class="d-flex flex-wrap my-8">
          <div class="d-flex items-center">
            <div class="mr-3">
              <v-icon color="grey" size="32">mdi-record</v-icon>
              Need Approval
            </div>
            <div class="mr-3 pt-1">
              <v-icon color="success">mdi-check-circle</v-icon>
              Approved
            </div>
            <div class="mr-3 pt-1">
              <v-icon color="error">mdi-close-circle</v-icon>
              Declined
            </div>
          </div>
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
          :items="filteredItems"
          :headers="headers"
          :loading="loadingPage"
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :class="`text-capitalize ${
                getStatus(item.flg_status).color
              }--text`"
              :style="getStatus(item.flg_status).backgroud"
              small
              >{{ getStatus(item.flg_status).text }}</v-chip
            >
          </template>
          <template v-slot:[`item.flg_approve_manager_mte`]="{ item }">
            <v-icon v-if="item.flg_approve_manager_mte == 1" color="success"
              >mdi-check-circle</v-icon
            >
            <v-icon v-if="!item.flg_approve_manager_mte" color="grey" size="32"
              >mdi-record</v-icon
            >
            <v-icon v-if="item.flg_approve_manager_mte == 2" color="error"
              >mdi-close-circle</v-icon
            >
          </template>
          <template v-slot:[`item.flg_approve_sect_head_prd`]="{ item }">
            <v-icon v-if="item.flg_approve_sect_head_prd == 1" color="success"
              >mdi-check-circle</v-icon
            >
            <v-icon
              v-if="!item.flg_approve_sect_head_prd"
              color="grey"
              size="32"
              >mdi-record</v-icon
            >
            <v-icon v-if="item.flg_approve_sect_head_prd == 2" color="error"
              >mdi-close-circle</v-icon
            >
          </template>
          <template v-slot:[`item.flg_approve_sect_head_mte`]="{ item }">
            <v-icon v-if="item.flg_approve_sect_head_mte == 1" color="success">
              mdi-check-circle
            </v-icon>
            <v-icon
              v-if="!item.flg_approve_sect_head_mte"
              color="grey"
              size="32"
              >mdi-record</v-icon
            >

            <v-icon v-if="item.flg_approve_sect_head_mte == 2" color="error"
              >mdi-close-circle</v-icon
            >
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                  <v-icon size="32">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  style="width: 122px"
                  :to="`/master/ledger-tpm/detail/${item.uuid}`"
                  >Detail</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item
                  style="width: 122px"
                  :to="`/master/ledger-tpm/revise/${item.uuid}`"
                  >Revise</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item style="width: 122px">Export</v-list-item>
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item
                  style="width: 122px"
                  class="error--text"
                  @click="deleteItem(item)"
                  >Delete</v-list-item
                >
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

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
                  <b-form-radio value="Vendor">Vendor</b-form-radio>
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
                to="/master/user"
                >Cancel</v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addTpm" width="650">
      <v-card>
        <v-card-title>
          Create Machine
          <v-icon class="ml-auto" @click="addTpm = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <machine-form @close="addTpm = false"></machine-form>
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
  FETCH_TPMLEDGERS,
  DELETE_TPMLEDGER,
} from "@/core/services/store/tpmLedger.module";
import { ASSIGN_MACHINE_PIC } from "@/core/services/store/machine.module";
import { FETCH_USERS } from "@/core/services/store/user.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
export default {
  components: {
    MachineForm,
  },
  data() {
    return {
      pic_form: {
        users: null,
        type: null,
      },
      keyword: "",
      json_fields: {
        No: "no",
        Line: "line.name",
        Machine: "machine.name",
        Status: {
          field: "status",
          callback: (value) => {
            return this.getStatus(value).text;
          },
        },
        "Section Head MTE": {
          field: "flg_approve_manager_mte",
          callback: (value) => {
            const res = {
              reject: "✕",
              approve: "✓",
            };
            return value ? res[value] : "-";
          },
        },
        "Section Head PRD": {
          field: "flg_approve_sect_head_prd",
          callback: (value) => {
            const res = {
              reject: "✕",
              approve: "✓",
            };
            return value ? res[value] : "-";
          },
        },
        "Manager MTE": {
          field: "flg_approve_sect_head_mte",
          callback: (value) => {
            const res = {
              reject: "✕",
              approve: "✓",
            };
            return value ? res[value] : "-";
          },
        },
        "Item Check": {
          field: "item_checks",
          callback: (value) => {
            return value.map(v=>v.item_check_name).join(", ")
          },
        },
        "PIC": {
          field: "item_checks",
          callback: (value) => {
            const pics = [];
            value.forEach(v=>{
              if(!pics.includes(v.in_charge)){
                pics.push(v.in_charge);
              }
            })
            return pics.join(", ")
          },
        },
        "Last Update": "modified_at",
      },
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
        },
        { text: "LINE", value: "line.name" },
        { text: "Machine", value: "machine.name" },

        { text: "Status", value: "status" },
        {
          text: "Section Head MTE",
          value: "flg_approve_sect_head_mte",
          align: "center",
        },
        {
          text: "Section Head PRD",
          value: "flg_approve_sect_head_prd",
          align: "center",
        },

        {
          text: "Manager MTE",
          value: "flg_approve_manager_mte",
          align: "center",
        },
        { text: "Last Update", value: "modified_at" },
        { text: "Action", value: "actions" },
      ],
      addTpm: false,
      isAssignPic: false,
      selectedMachine: {},
      loadingPage: false,
    };
  },
  computed: {
    ...mapGetters({
      items: "getTpmLedgers",
      users: "getUsers",
    }),
    filteredItems() {
      if (this.keyword) {
        return this.items.filter((item) => {
          return `${item.machine.name} ${item.line?.name.toLowerCase()}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.items;
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Ledger TPM List");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Ledger TPM List" }]);
    this.loadingPage = true;
    await this.$store.dispatch(FETCH_TPMLEDGERS);
    this.loadingPage = false;
    this.$store.dispatch(FETCH_USERS);
  },
  methods: {
    getStatus(status) {
      if (status == 1 || status == 3) {
        return {
          color: "success",
          backgroud: "background-color: #D0FCE1",
          text: "Done",
        };
      }
      if (status == 0) {
        return {
          color: "primary",
          backgroud: "background-color: rgba(91, 196, 255, 0.4);",
          text: "Need Approval",
        };
      }
      if (status == 2) {
        return {
          color: "error",
          backgroud: "background-color: rgba(255, 170, 179, 0.6);",
          text: "Rejected",
        };
      }
      if (status == 2) {
        return {
          color: "warning",
          backgroud: "background-color: rgba(247, 198, 105, 0.4);",
          text: "Need Revision",
        };
      }
      return "default";
    },

    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ledger ${item.line?.name} - ${item.machine?.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_TPMLEDGER,
            item.uuid
          );
          toastResponse(response);
          this.$store.dispatch(FETCH_TPMLEDGERS);
        },
      });
    },
    assignPIC(item) {
      // console.log(item);
      this.selectedMachine = { ...item };
      this.isAssignPic = true;
    },
    getUser() {
      this.$store.dispatch(FETCH_USERS);
    },
    async doSubmitPic() {
      if (this.$refs.picForm.validate()) {
        const response = await this.$store.dispatch(ASSIGN_MACHINE_PIC, {
          id: this.selectedMachine.machine_id,
          payload: this.pic_form,
        });
        toastResponse(response);
        this.isAssignPic = false;
        this.$store.dispatch(FETCH_TPMLEDGERS);
      }
    },
  },
};
</script>
