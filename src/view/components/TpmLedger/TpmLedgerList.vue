<template>
  <v-card class="shadow mt-10" rounded="lg">
    <v-card-text>
      <v-tabs v-model="active" fixed-tabs>
        <v-tab> Production </v-tab>
        <v-tab> Maintenance </v-tab>
        <v-tab> Vendor </v-tab>
      </v-tabs>
      <v-divider class="my-0 py-0"></v-divider>
      <v-tabs-items v-model="active" class="my-7">
        <v-tab-item>
          <v-data-table :headers="headers" :items="itemProduction">
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:[`item.specialTools`]="{ item }">
              {{
                item.jis_no
                  .map((st) =>
                    st.special_tool ? st.special_tool.name : st.special_tool_id
                  )
                  .join(", ")
              }}
            </template>
            <template v-slot:[`item.jis_no`]="{ item }">
              {{ item.jis_no.map((st) => st.title).join(", ") }}
            </template>
            <template v-slot:[`item.start_at`]="{ item }">
              {{ item.start_at | formatDate }}
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table :headers="headers" :items="itemMaintenance">
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:[`item.specialTools`]="{ item }">
              {{
                item.jis_no
                  .map((st) =>
                    st.special_tool ? st.special_tool.name : st.special_tool_id
                  )
                  .join(", ")
              }}
            </template>
            <template v-slot:[`item.jis_no`]="{ item }">
              {{ item.jis_no.map((st) => st.title).join(", ") }}
            </template>
            <template v-slot:[`item.start_at`]="{ item }">
              {{ item.start_at | formatDate }}
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table :headers="headers" :items="itemVendor">
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:[`item.specialTools`]="{ item }">
              {{
                item.jis_no
                  .map((st) =>
                    st.special_tool ? st.special_tool.name : st.special_tool_id
                  )
                  .join(", ")
              }}
            </template>
            <template v-slot:[`item.jis_no`]="{ item }">
              {{ item.jis_no.map((st) => st.title).join(", ") }}
            </template>
            <template v-slot:[`item.start_at`]="{ item }">
              {{ item.start_at | formatDate }}
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
      <v-divider class="mt-6"></v-divider>
      <div
        v-if="showAction && canApprove"
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
    </v-card-text>
  </v-card>
</template>
<script>
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import { DO_APPROVE, DO_REJECT } from "@/core/services/store/tpmLedger.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    showAction: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      reject: false,
      loadingApprove: false,
      loadingReject: false,
      active: 0,
      form: {
        reason: "",
      },
      headers: [
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
        { text: "Initial Start", value: "start_at" },
        { text: "Period", value: "duration" },
      ],
      addMachine: false,
      roleAccepts: ["1", "2", "9"], //only section head
    };
  },
  computed: {
    ...mapGetters({
      profile: "getProfile",
    }),
    itemProduction() {
      return this.items.filter((item) => {
        return item.in_charge == "production" || item.incharge == "production";
      });
    },
    itemMaintenance() {
      return this.items.filter((item) => {
        return (
          item.in_charge == "maintenance" || item.incharge == "maintenance"
        );
      });
    },
    itemVendor() {
      return this.items.filter((item) => {
        return item.in_charge == "vendor" || item.incharge == "vendor";
      });
    },
    canApprove() {
      return this.roleAccepts.includes(this.profile.role_id);
    },
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
  filters: {
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD");
    },
  },
};
</script>
