<template>
  <section>
    <tpm-ledger-title v-if="!fetching" :title="tpmLedger"></tpm-ledger-title>
    <tpm-ledger-list
      v-if="!fetching"
      :items="itemMapped"
      :showAction="true"
    ></tpm-ledger-list>
    <base-loading v-else />
  </section>
</template>

<script>
import TpmLedgerTitle from "@/view/components/TpmLedger/TpmLedgerTitle";
import TpmLedgerList from "@/view/components/TpmLedger/TpmLedgerList";
import BaseLoading from "@/view/components/base/BaseLoading";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { GET_TPMLEDGER } from "@/core/services/store/tpmLedger.module";
import { mapGetters } from "vuex";
export default {
  components: {
    TpmLedgerTitle,
    TpmLedgerList,
    BaseLoading,
  },
  data() {
    return {
      fetching: false,
    };
  },
  computed: {
    ...mapGetters({
      tpmLedger: "getTpmLedger",
    }),
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
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Detail Ledger TPM");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Master Ledger TPM List" },
      { title: "Detail" },
    ]);
    this.fetching = true;
    await this.$store.dispatch(GET_TPMLEDGER, this.$route.params.id);
    this.fetching = false;
  },
};
</script>
