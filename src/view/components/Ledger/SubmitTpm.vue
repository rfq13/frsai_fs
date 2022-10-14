<template>
  <div>
    <tpm-ledger-title :title="title" :isShowExport="false"></tpm-ledger-title>
    <tpm-ledger-list :items="items"></tpm-ledger-list>
    <v-divider class="mt-5"></v-divider>
    <div class="d-flex">
      <v-btn
        color="primary"
        class="ml-auto title text-capitalize"
        height="48"
        width="125"
        depressed
        :loading="loading"
        @click="doSubmitTpm"
        >Submit</v-btn
      >
    </div>
  </div>
</template>
<script>
import TpmLedgerTitle from "@/view/components/TpmLedger/TpmLedgerTitle";
import TpmLedgerList from "@/view/components/TpmLedger/TpmLedgerList";
import { SUBMIT_TPMLEDGER } from "@/core/services/store/tpmLedger.module";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
export default {
  data() {
    return {
      items: [],
      title: {},
      loading: false,
    };
  },
  components: { TpmLedgerTitle, TpmLedgerList },
  mounted() {
    const step1 = window.localStorage.getItem("step-1");
    this.title = JSON.parse(step1);
    const step2 = window.localStorage.getItem("step-2");
    this.items = JSON.parse(step2);
  },
  methods: {
    async doSubmitTpm() {
      let body = {
        machine_id: this.title.machine_id.id,
        line_id: this.title.line_id.id,
        item_check: this.items.map((item) => {
          const body = {
            ledger_method_id: item.ledgerMethod.id,
            in_charge: item.incharge,
            item_check_name: item.name,
            location: item.location,
            duration: item.duration,
            mp: item.mp,
            periodic: item.periodic,
            start_at: item.init,
            spare_part_id: item.sparepart.id,
            qty_part: item.qty,
            // item_check_jis: item.specialTools.map((st) => st.id),
            item_check_jis: item.jis_no.map((st) => st.id),
            flg_periodic: item.flg_periodic,
            flg_std_measurement: item.selectedStd == "range" ? 0 : 1,
            from:"New Item"
          };
          if (item.selectedStd == "range") {
            body.lower_limit = item.lowerLimit;
            body.upper_limit = item.upperLimit;
            body.warning_upper_limit = item.warninUpperLimit;
            body.warning_lower_limit = item.warningLowerLimit;
          } else {
            body.ok_std = item.stdOk;
            body.ng_std = item.stdNg;
          }
          return body;
        }),
      };
      this.loading = true;
      const response = await this.$store.dispatch(SUBMIT_TPMLEDGER, body);
      this.loading = false;
      toastResponse(response);
      if (response.success) {
        window.localStorage.removeItem("step-1");
        window.localStorage.removeItem("step-2");
        this.$router.push("/master/ledger-tpm");
      }
    },
  },
};
</script>
