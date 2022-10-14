<template>
  <section>
    <base-loading v-if="fetching" />
    <tpm-ledger-title
      v-if="!fetching"
      :title="ledger"
      :isShowExport="false"
      :withFooter="false"
    >
      <template v-slot:right_button>
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
            @click="
              () => {
                dialogEdit = true;
                form.trans_type = 'add';
                e1 = 1;
                isEditCounter = false;
              }
            "
            depressed
            class="text-capitalize font-weight-medium"
            height="34"
          >
            <v-icon small class="mr-2">mdi-plus</v-icon> New Revision
          </v-btn>
        </div>
      </template>
    </tpm-ledger-title>

    <v-stepper v-if="!fetching" v-model="e2" class="mt-4">
      <v-stepper-items>
        <v-stepper-content step="1">
          <!-- <v-card class="rounded-lg mt-4">
            <v-card-text class="py-8 px-6" style="color: #3f4254"> -->

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
            :items="itemChecks"
            :headers="headers"
            :search="keyword"
            :loading="loading"
          >
            <template v-slot:[`item.no`]="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:[`item.specialTools`]="{ item }">
              {{ item.jises.map((st) => st.special_tool.name).join(", ") }}
            </template>
            <template v-slot:[`item.jis_no`]="{ item }">
              {{ item.jises.map((st) => st.title).join(", ") }}
            </template>
            <template v-slot:[`item.flg_std_measurement`]="{ item }">
              {{ item.flg_std_measurement == 0 ? "Range" : "Judgement", }}
            </template>
            <template v-slot:[`item.start_at`]="{ item }">
              {{ formatDate(item.start_at) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                    <v-icon size="32">
                      {{
                        !reviseItemChecks
                          .map((r) => r.item_check_id)
                          .includes(item.id)
                          ? "mdi-dots-horizontal"
                          : "mdi-check-circle"
                      }}
                    </v-icon>
                  </v-btn>
                </template>
                <v-list
                  dense
                  v-if="
                    !reviseItemChecks
                      .map((r) => r.item_check_id)
                      .includes(item.id)
                  "
                >
                  <v-list-item style="width: 122px" @click="editItem(item)"
                    >Edit</v-list-item
                  >
                  <v-divider class="my-0 py-0"></v-divider>
                  <v-list-item style="width: 122px" @click="editItem(item, 2)">
                    {{
                      item.method_check == "counter"
                        ? "To Periodic"
                        : "To Counter"
                    }}
                  </v-list-item>
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
          <div v-if="reviseItemChecks.length">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="e2 = 2"> next </v-btn>
            </div>
            <div class="d-flex justify-end">
              <small style="color: grey"
                >** klik next untuk menyimpan revisi</small
              >
            </div>
          </div>
          <!-- </v-card-text>
          </v-card> -->
        </v-stepper-content>
        <v-stepper-content step="2">
          <revision-list
            :reviseItemChecks="reviseItemChecks"
            @submitBackend="submitBackend"
          ></revision-list>
          <div class="d-flex justify-end">
            <v-btn text @click="e2 = 1"> prev </v-btn>
            <v-btn color="primary" @click="submitBackend" :loading="loading">
              submit
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <!-- dialog -->
    <v-dialog v-model="dialogEdit">
      <!-- <v-card> -->
      <!-- <v-card-header> -->
      <!-- <v-card-title class="headline">Create Item</v-card-title> -->
      <!-- <v-divider></v-divider> -->
      <!-- </v-card-header> -->
      <!-- form -->
      <!-- <v-card-text> -->

      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            {{ form.item_check_id ? "Edit Periodic" : "Create" }} Form
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">
            Reason Form
          </v-stepper-step>

          <v-divider></v-divider>

          <!-- <v-stepper-step step="3">
                Revision List
              </v-stepper-step> -->
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <revision-form
              @close="
                selectedItemCheck = null;
                dialogEdit = false;
                e1 = 1;
              "
              @doSubmit="e1 = 2"
              :form="form"
              :initMethod="init_method"
              :initPeriodic="init_periodic"
              :initIncharge="init_incharge"
            ></revision-form>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form ref="formEdit" lazy-validation>
              <revision-confirm-form :form="form"></revision-confirm-form>
            </v-form>
            <div class="d-flex justify-end">
              <v-btn v-if="!isEditCounter" text @click="e1 = 1"> Prev </v-btn>
              <v-btn color="primary" @click="submitformEdit"> Save </v-btn>
            </div>
          </v-stepper-content>

          <!-- <v-stepper-content step="3">
                  <revision-list :reviseItemChecks="reviseItemChecks" @submitBackend="submitBackend"></revision-list>
                  <div class="d-flex justify-end">
                    <v-btn text @click="e1 = 2">
                      prev
                    </v-btn>
                    <v-btn
                      color="info"
                      class="mx-2"
                      @click="dialogEdit=false;e1=1"
                    >
                      more
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="submitBackend"
                    >
                      submit
                    </v-btn>
                  </div>
  
                </v-stepper-content> -->
        </v-stepper-items>
      </v-stepper>

      <!-- </v-card-text> -->
      <!-- submit or cancel button -->

      <!-- </v-card> -->
    </v-dialog>

    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete">
      <v-card>
        <v-card-title class="headline">Delete Item</v-card-title>
        <v-card-text>
          <v-form ref="formDelete" lazy-validation>
            <revision-confirm-form :form="form"></revision-confirm-form>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialogDelete = false;
              selectedItemCheck = null;
            "
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import dayjs from "dayjs";

import BaseLoading from "@/view/components/base/BaseLoading";
import RevisionList from "@/view/components/Ledger/RevisionList";
import RevisionForm from "@/view/components/Ledger/RevisionForm";
import RevisionConfirmForm from "@/view/components/Ledger/RevisionConfirmForm";
import TpmLedgerTitle from "@/view/components/TpmLedger/TpmLedgerTitle";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { mapGetters } from "vuex";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { GET_TPMLEDGER } from "@/core/services/store/tpmLedger.module";

import { REVISE_TPMLEDGER } from "@/core/services/store/tpmLedger.module";

function initialForm() {
  return {
    item_check_id: null,
    ledger_method_id: 0,
    in_charge: "production",
    item_check_name: "",
    location: "",
    duration: 0,
    mp: 0,
    periodic: 0,
    flg_periodic: "DAY",
    flg_std_measurement: 0,
    ok_std: "",
    ng_std: "",
    lower_limit: 0,
    upper_limit: 0,
    warning_upper_limit: 0,
    warning_lower_limit: 0,
    start_at: "",
    jis_planned_at: "",
    initial_start: "",
    spare_part_id: 0,
    qty_part: 0,
    revision_reason: "",
    revision_sequence: 0,
    from: "New Item",
    trans_type: "add",
    machines: [],
  };
}
export default {
  data() {
    return {
      init_method: null,
      init_periodic: null,
      init_incharge: null,
      fetching: false,
      e2: 1,
      e1: 1,
      showRevisies: false,
      dialogEdit: false,
      dialogDelete: false,
      keyword: "",
      keywordrevision: "",
      title: "",
      loading: false,
      itemChecks: [],
      selectedItemCheck: null,
      reviseItemChecks: [],
      payloads: [],
      form: initialForm(),
      headers: [
        { text: "In charge", value: "in_charge" },
        { text: "Name", value: "item_check_name" },
        {
          text: "Location",
          align: "start",
          value: "location",
        },
        { text: "Method", value: "ledger_method.name" },
        { text: "MP", value: "mp" },
        { text: "JIS No", value: "jis_no" },
        // { text: "Special Tool Support", value: "specialTools", width: "120px" },
        { text: "Std Measurement", value: "flg_std_measurement" },
        { text: "Initial Start", value: "start_at" },
        { text: "Period", value: "duration" },
        { text: "Action", value: "actions", sortable: false },
      ],
      isEditCounter: false,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      ledger: "getTpmLedger",
    }),
  },
  async mounted() {
    this.fetching = true;
    await this.$store.dispatch(GET_TPMLEDGER, this.$route.params.id);
    this.fetching = false;

    this.$store.dispatch(SET_PAGE_TITLE, "Revise Ledger TPM");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Ledger TPM List" },
      { title: "Revise" },
    ]);
  },
  watch: {
    ["form.trans_type"](v) {
      console.log("tt", v);
    },
    ledger(val) {
      this.title = `${val.line.name} (${val.machine.name})`;
      this.itemChecks = val.item_checks;
    },
    selectedItemCheck(val) {
      if (val) {
        this.modifyForm(val, "edit");
      } else {
        const resetForm = initialForm();
        this.modifyForm(resetForm);
        this.e1 = 1;
        this.dialogEdit = false;
      }
    },
    reviseItemChecks(v) {
      console.log("revise item", v);
    },
    dialogEdit(v) {
      if (v === false) {
        this.form = initialForm();
      }
    },
    dialogDelete(v) {
      if (v === false) {
        this.form = initialForm();
        this.form.trans_type = "delete";
      }
    },
  },
  methods: {
    deleteItem(item) {
      this.dialogDelete = true;
      this.selectedItemCheck = item;
    },
    editItem(item, step) {
      console.log({ item });
      this.init_method = item.ledger_method_id;
      this.init_incharge = item.in_charge;
      this.init_periodic = item.periodic + item.flg_periodic;

      if (step) {
        this.isEditCounter = true;
        this.e1 = 2;
        this.modifyForm(item, "method_check");
      } else {
        this.isEditCounter = false;
        this.e1 = 1;
        this.modifyForm(item, "edit");
      }

      this.dialogEdit = true;
    },
    deleteItemConfirm() {
      if (this.$refs.formDelete.validate()) {
        this.reviseItemChecks.push({ ...this.form, trans_type: "delete" });
        this.dialogDelete = false;
      }
    },
    async submitformEdit() {
      if (this.$refs.formEdit.validate()) {
        const trans_type =
          this.form.trans_type == "edit" ? "add" : this.form.trans_type;

        const newIc = {
          ...this.form,
          from: this.form.from || "New Item",
          spare_part_id:
            typeof this.form.spare_part_id == "object"
              ? this.form.spare_part_id.id
              : this.form.spare_part_id,
          ledger_method_id:
            typeof this.form.ledger_method_id == "object"
              ? this.form.ledger_method_id.id
              : this.form.ledger_method_id,
          machines: undefined,
          incharge_change: this.initincharge != this.form.in_charge,
          counter: this.isEditCounter,
        };

        // remove from itemchecks where item_check_id === newIc.item_check_id
        const index = this.reviseItemChecks.findIndex(
          (ic) => ic.item_check_id === newIc.item_check_id
        );

        if (index > -1) {
          this.reviseItemChecks.splice(index, 1);
        }

        this.reviseItemChecks.push(newIc);

        this.form.machines.forEach((m) => {
          if (m != this.ledger.machine_id) {
            this.payloads.push({
              machine_id: m,
              line_id: this.ledger.line_id,
              tpm_ledger_id: this.ledger.id,
              item_check: [newIc],
              jis_planned_at: newIc.jis_planned_at,
            });
          }
        });

        this.dialogEdit = false;
        this.e1 = 1;
      }
    },
    deleteRevision(index) {
      this.reviseItemChecks = this.reviseItemChecks.filter(
        (i) => i.item_check_id !== index
      );
    },
    submitBackend() {
      this.loading = true;

      this.payloads.push({
        machine_id: this.ledger.machine_id,
        line_id: this.ledger.line_id,
        tpm_ledger_id: this.ledger.id,
        item_check: this.reviseItemChecks,
        jis_planned_at: this.reviseItemChecks[0].jis_planned_at,
      });

      this.$store
        .dispatch(REVISE_TPMLEDGER, {
          uuid: this.$route.params.id,
          payload: this.payloads,
        })
        .then((response) => {
          toastResponse(response);
          this.loading = false;
          if (response.success) {
            this.$router.push({ name: "ledgerTpm" });
          }
        });
    },
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    modifyForm(val, tt = "add", additionals = {}) {
      const {
        item_check_name,
        location,
        duration,
        mp,
        periodic,
        flg_periodic,
        flg_std_measurement,
        ok_std,
        ng_std,
        lower_limit,
        upper_limit,
        warning_upper_limit,
        warning_lower_limit,
        qty_part,
        revision_reason,
        from,
        in_charge,
        trans_type,
        method_check,
      } = val;

      this.form = {
        in_charge,
        item_check_name,
        location,
        duration,
        mp,
        periodic,
        flg_periodic,
        flg_std_measurement,
        ok_std,
        ng_std,
        lower_limit,
        upper_limit,
        warning_upper_limit,
        warning_lower_limit,
        qty_part,
        revision_reason,
        from,
        trans_type: trans_type || tt,
        method_check:
          this.isEditCounter && method_check == "periodic"
            ? "counter"
            : "periodic",
        spare_part_id:
          val.spare_part?.id || parseInt(val.spare_part_id) || null,
        ledger_method_id: val.ledger_method_id,
        start_at: this.formatDate(val.start_at),
        item_check_id: val.id,
        revision_sequence: this.form.revision_sequence || 0,
        machines: [this.ledger.machine_id + ""],
        ...additionals,
      };
    },
  },
  components: {
    TpmLedgerTitle,
    RevisionList,
    RevisionForm,
    RevisionConfirmForm,
    BaseLoading,
  },
};
</script>
