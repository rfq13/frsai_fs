<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Ledger TPM List Approval</h1>
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
              outlined
              dense
              hide-details
              class="ml-3"
              clearable
            ></v-text-field>
          </div>
        </div>

        <v-data-table class="mt-5" :items="items" :headers="headers">
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :class="`text-capitalize ${getStatus(item.status).color}--text`"
              :style="getStatus(item.status).backgroud"
              small
              >{{ getStatus(item.status).text }}</v-chip
            >
          </template>
          <template v-slot:[`item.flg_approve_sect_head_mte`]="{ item }">
            <v-icon v-if="item.flg_approve_sect_head_mte == 1" color="success"
              >mdi-check-circle</v-icon
            >
            <v-icon
              v-if="item.flg_approve_sect_head_mte == null"
              color="grey"
              size="32"
              >mdi-record</v-icon
            >
            <v-icon v-if="item.flg_approve_sect_head_mte == 2" color="error"
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
          <template v-slot:[`item.flg_approve_manager_mte`]="{ item }">
            <v-icon v-if="item.flg_approve_manager_mte == 1" color="success">
              mdi-check-circle
            </v-icon>
            <v-icon v-if="!item.flg_approve_manager_mte" color="grey" size="32"
              >mdi-record</v-icon
            >
            <v-icon v-if="item.flg_approve_manager_mte == 2" color="error"
              >close-close-circle</v-icon
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
                  :to="`/master/ledger-tpm/approval/detail/${item.uuid}`"
                  >Detail</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>

                <v-list-item
                  style="width: 122px"
                  :to="`/master/ledger-tpm/approval/revision/${item.uuid}`"
                  >View Revision</v-list-item
                >
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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

import { FETCH_TPMAPPROVAL } from "@/core/services/store/tpmLedger.module";
import { mapGetters } from "vuex";
export default {
  components: {
    MachineForm,
  },
  data() {
    return {
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
    };
  },
  computed: {
    ...mapGetters({
      items: "getTpmApprovals",
    }),
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Ledger TPM List Approval");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Ledger TPM List Approval" },
    ]);
    this.$store.dispatch(FETCH_TPMAPPROVAL);
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
  },
};
</script>
