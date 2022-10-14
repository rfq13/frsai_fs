<template>
  <section>
    <tpm-ledger-title v-if="!fetching" :title="tpmLedger"></tpm-ledger-title>
    <revision-list
      v-if="!fetching && reviseItemChecks.length > 0"
      :reviseItemChecks="reviseItemChecks"
      :showAction="true"
    ></revision-list>
    <base-loading v-if="fetching" />

    <section
      v-if="!fetching && reviseItemChecks.length == 0"
      class="white px-4 py-3 rounded-md text-center mb-8"
    >
      Revision is not Available
    </section>

    <div
      v-if="!fetching && canApprove"
      class="d-flex white px-5 py-3 justify-end"
    >
      <v-btn
        type="button"
        color="error"
        class="title text-capitalize mr-3"
        depressed
        @click="reject = true"
        >Reject</v-btn
      >
      <v-btn
        type="submit"
        color="primary"
        class="title text-capitalize"
        depressed
        @click="doApprove"
        :loading="loadingApprove"
        >Approve</v-btn
      >
    </div>

    <v-dialog v-model="reject" width="550">
      <v-card>
        <v-card-title
          >Correction Note
          <v-icon class="ml-auto" @click="reject = false"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-card-text>
          <v-divider></v-divider>
          <v-form ref="rejectForm" @submit.prevent="doReject">
            <p class="mb-1">Note</p>
            <v-textarea v-model="form.reason" outlined> </v-textarea>
            <v-row class="mt-6">
              <v-col md="12">
                <v-divider></v-divider>
                <div class="d-flex justify-end">
                  <v-btn
                    type="button"
                    color="#E1F0FF"
                    class="title text-capitalize text-primary mr-3"
                    depressed
                    @click="reject = false"
                    >Close</v-btn
                  >
                  <v-btn
                    type="submit"
                    color="primary"
                    class="title text-capitalize"
                    depressed
                    :loading="loadingReject"
                    >Submit</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import TpmLedgerTitle from "@/view/components/TpmLedger/TpmLedgerTitle";
import RevisionList from "@/view/components/Ledger/RevisionList";
import BaseLoading from "@/view/components/base/BaseLoading";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { FETCH_TPM_REVISION } from "@/core/services/store/tpmLedger.module";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import { DO_APPROVE, DO_REJECT } from "@/core/services/store/tpmLedger.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  components: {
    TpmLedgerTitle,
    RevisionList,
    BaseLoading,
  },
  data() {
    return {
      fetching: false,
      reject: false,
      roleAccepts: ["1", "2", "9"], //only section head
      form: { reason: "" },
      loadingApprove: false,
      loadingReject: false,
    };
  },
  computed: {
    ...mapGetters({
      tpmLedger: "getRevisions",
      profile: "getProfile",
    }),
    canApprove() {
      return this.roleAccepts.includes(this.profile.role_id);
    },
    itemMapped() {
      if (!this.tpmLedger.item_checks) {
        return [];
      }
      return this.tpmLedger.item_checks.map((item) => {
        return {
          ...item,
          incharge: item.incharge,
          name: item.item_check_name,
          ledgerMethod: item.ledger_method,
          jis_no: item.jises,
          selectedStd: item.flg_std_measurement == 0 ? "range" : "judgement",
          init: "",
        };
      });
    },
    reviseItemChecks() {
      if (!this.tpmLedger) {
        return [];
      }
      if (!this.tpmLedger.item_check_histories) {
        return [];
      }
      return this.tpmLedger.item_check_histories.map((history) => ({
        ...history,
        item_check_name: history.item_check.item_check_name,
        start_at: dayjs(history.created_at).format("YYYY-MM-DD"),
      }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Detail Ledger TPM");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Ledger TPM List" },
      { title: "Detail" },
    ]);
    this.fetching = true;
    await this.$store.dispatch(FETCH_TPM_REVISION, this.$route.params.id);
    this.fetching = false;
  },
  methods: {
    async doApprove() {
      this.loadingApprove = true;
      const response = await this.$store.dispatch(DO_APPROVE, {
        role: this.profile.role.name,
        id: this.$route.params.id,
      });
      toastResponse(response);
      if (response.success) {
        this.$router.push("/master/ledger-tpm/approval");
      }
      this.loadingApprove = false;
    },
    async doReject() {
      this.loadingReject = true;
      const response = await this.$store.dispatch(DO_REJECT, {
        id: this.$route.params.id,
        reason: this.form.reason,
      });
      toastResponse(response);
      if (response.success) {
        this.$router.push("/master/ledger-tpm/approval");
      }
      this.loadingReject = false;
    },
  },
};
</script>
