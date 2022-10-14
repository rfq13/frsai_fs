<template>
  <section>
    <v-card v-if="!loading" class="shadow">
      <v-card-title>
        <div>
          <p class="mb-2 h2">{{ getItemCheckName }}</p>
          <span class="mr-3 body-2 grey--text">
            <v-icon>mdi-file-tree</v-icon> {{ getLineName }}
          </span>
          <span class="mr-3 body-2 grey--text">
            <v-icon>mdi-check-circle-outline</v-icon>
            {{ getMachineName }}
          </span>
          <span class="mr-3 body-2 grey--text">
            <v-icon>mdi-timer</v-icon>
            {{ getItemCheckDuration }} minutes
          </span>
          <span class="mr-3 body-2 grey--text">
            <v-icon>mdi-map-marker</v-icon>
            {{ getItemCheckLocation }}
          </span>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-16">
        <v-form ref="formExec" @submit.prevent="doSubmit">
          <v-row>
            <v-col v-if="isValue" md="6">
              <p class="mb-1 font-weight-bold body-1">
                Value <span class="error--text">*</span>
              </p>
              <v-text-field
                v-model="form.value"
                :rules="[(v) => !!v || 'Required']"
                type="number"
                outlined
                dense
                hide-details
                :disabled="inputed"
              ></v-text-field>
              <p class="mb-0 font-weight-bold">
                value Standard: {{ TPMPlanning.lower_limit }} -
                {{ TPMPlanning.upper_limit }}
              </p>
            </v-col>
            <v-col v-else md="6">
              <p class="mb-1 font-weight-bold body-1">
                Judge <span class="error--text">*</span>
              </p>
              <v-select
                v-model="form.judge"
                :rules="[(v) => !!v || 'Required']"
                outlined
                dense
                hide-details
                :items="itemJudges"
                :disabled="inputed"
              ></v-select>
              <p class="mb-0 font-weight-bold">
                Value Standard: {{ TPMPlanning.ok_std }}
              </p>
            </v-col>
            <v-col md="6">
              <p class="mb-1 font-weight-bold body-1">
                PIC Actual <span class="error--text">*</span>
              </p>
              <v-autocomplete
                v-model="selectedPic"
                :rules="[(v) => !!v || 'Required']"
                outlined
                dense
                hide-details
                :disabled="inputed"
                :items="pics"
                item-text="full_name"
                item-value="user_id"
                multiple
              ></v-autocomplete>
            </v-col>
            <v-col md="6">
              <p class="mb-1 font-weight-bold body-1">
                Execution Date <span class="error--text">*</span>
              </p>
              <base-datepicker
                v-model="form.executed_at"
                :rules="[(v) => !!v || 'Required']"
              ></base-datepicker>
            </v-col>
            <v-col md="6">
              <div class="d-flex">
                <span>
                  <p class="mb-1 font-weight-bold body-1">
                    Start <span class="error--text">*</span>
                  </p>
                  <v-text-field
                    outlined
                    dense
                    v-model="form.start_time_at"
                    placeholder="Start Time"
                    v-mask="'##:##'"
                  ></v-text-field>
                </span>
                <span class="ml-5">
                  <p class="mb-1 font-weight-bold body-1">
                    End <span class="error--text">*</span>
                  </p>
                  <v-text-field
                    outlined
                    dense
                    v-model="form.end_time_at"
                    placeholder="End Time"
                    v-mask="'##:##'"
                  ></v-text-field>
                </span>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div class="d-flex">
            <div class="d-flex mr-7">
              <v-icon size="32" class="mr-3">mdi-timer</v-icon>
              <div>
                <p v-if="$route.query.type == 1" class="mb-0">
                  {{ histories.length }} History Value
                </p>
                <p v-else class="mb-0">History Judgement</p>
                <p
                  class="primary--text mb-0"
                  style="cursor: pointer"
                  @click="dialogValue = true"
                >
                  View
                </p>
              </div>
            </div>
            <div class="d-flex">
              <v-icon size="32" class="mr-3">mdi-image</v-icon>
              <div>
                <p class="mb-0">{{ jises.length }} JIS</p>
                <p
                  class="primary--text mb-0"
                  style="cursor: pointer"
                  @click="dialogJis = true"
                >
                  View
                </p>
              </div>
            </div>
            <div class="ml-auto">
              <v-btn
                type="button"
                color="#E1F0FF"
                class="title text-capitalize text-primary mr-3"
                height="48"
                width="125"
                depressed
                @click="$router.go(-1)"
                >Close</v-btn
              >
              <v-btn
                type="submit"
                color="primary"
                class="title text-capitalize"
                height="48"
                width="125"
                depressed
                :disabled="inputed"
              >
                Submit
              </v-btn>
            </div>
          </div>
        </v-form>

        <v-dialog v-model="dialogHistory" width="550">
          <history-judgement @close="dialogHistory = false"></history-judgement>
        </v-dialog>
        <v-dialog v-model="dialogValue" width="1028">
          <history-value
            @close="dialogValue = false"
            :itemcheck="TPMPlanning.item_check_id"
            :dialog="dialogValue"
          ></history-value>
        </v-dialog>
        <v-dialog v-model="dialogJis" width="750">
          <detail-jis
            :jises="jises"
            :dialog="dialogJis"
            @close="dialogJis = false"
          ></detail-jis>
        </v-dialog>
        <v-dialog v-model="dialogFinding" width="750">
          <finding-form
            :selectedFinding="TPMPlanning"
            :selectedPic="selectedPic"
            @close="dialogFinding = false"
            @success="successSave"
          ></finding-form>
        </v-dialog>
      </v-card-text>
    </v-card>
    <base-loading v-else></base-loading>
  </section>
</template>
<script>
import BaseDatepicker from "@/view/components/base/BaseDatepicker";
import HistoryJudgement from "@/view/components/Monitoring/HistoryJudgement";
import HistoryValue from "@/view/components/Monitoring/HistoryValue";
import DetailJis from "@/view/components/Monitoring/DetailJis";
import FindingForm from "@/view/components/Finding/FindingForm";
import dayjs from "dayjs";
import { GET_JIS_BY_PLANNING } from "@/core/services/store/jis.module";
import BaseLoading from "@/view/components/base/BaseLoading.vue";
import { VueMaskDirective } from "v-mask";

const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
import {
  GET_PLANNING,
  START_EXEC,
  STOP_EXEC,
  FINISH_EXEC,
  GET_HISTORY,
  FETCH_PICS,
} from "@/core/services/store/tpmPlanning.module";

import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";

export default {
  components: {
    BaseDatepicker,
    HistoryJudgement,
    HistoryValue,
    DetailJis,
    FindingForm,
    BaseLoading,
  },
  data() {
    return {
      form: {
        value: "",
        judge: "",
        executed_by: [],
        executed_at: "",
        start_time_at: "",
        end_time_at: "",
      },
      dialogHistory: false,
      dialogValue: false,
      dialogJis: false,
      dialogFinding: false,
      loading: false,
      second: 0,
      timerRun: false,
      interval: null,
      time: "",
      inputed: false,
      selectedPic: [],
    };
  },
  watch: {
    TPMPlanning: function (val) {
      console.log(val);
    },
    ["form.start_time_at"](val) {
      if (!val) {
        this.form.end_time_at = "";
        return;
      }
      this.form.end_time_at = dayjs("2022-01-01 " + val)
        .add(this.getItemCheckDuration, "minute")
        .format("HH:mm");
    },
  },
  computed: {
    ...mapGetters({
      TPMPlanning: "getTPMPlanning",
      histories: "getHistories",
      jises: "getJisBp",
      pics: "getPics",
    }),
    now() {
      return dayjs().format("HH:mm");
    },
    isValue() {
      return !this.TPMPlanning.ng_std;
    },
    durationRun() {
      return dayjs.duration(this.second * 1000).format("mm:ss");
    },
    itemJudges() {
      return [this.TPMPlanning.ng_std, this.TPMPlanning.ok_std];
    },
    machinePICS() {
      return this.TPMPlanning?.machine?.machine_pic || [];
    },
    machinePicsByIncharge() {
      return this.machinePICS
        .filter((pic) => {
          return (
            pic.type.toLowerCase() ==
            this.TPMPlanning?.item_check?.in_charge?.toLowerCase()
          );
        })
        .map((pic) => pic.user);
    },
    getItemCheckName() {
      return this.TPMPlanning?.item_check?.item_check_name;
    },
    getMachineName() {
      return this.TPMPlanning?.machine?.name;
    },
    getLineName() {
      return this.TPMPlanning?.line?.name;
    },
    getItemCheckDuration() {
      return this.TPMPlanning?.item_check?.duration;
    },
    getItemCheckLocation() {
      return this.TPMPlanning?.item_check?.location;
    },
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch(GET_PLANNING, this.$route.params.id);
    await this.$store.dispatch(GET_HISTORY, this.TPMPlanning.item_check_id);
    await this.$store.dispatch(GET_JIS_BY_PLANNING, this.$route.params.id);
    await this.$store.dispatch(FETCH_PICS, this.$route.params.id);

    this.loading = false;
    const pics = this.TPMPlanning.planners || [];
    this.selectedPic = pics.map((pic) => ({ ...pic, user_id: pic.id }));
    this.form.value =
      this.TPMPlanning.value_qualitative || this.TPMPlanning.value_quantitative;

    this.form.judge =
      this.TPMPlanning.value_qualitative || this.TPMPlanning.value_quantitative;

    this.form.executed_by = this.TPMPlanning.pic;
    this.form.start_time_at = dayjs().format("HH:mm");

    this.form.end_time_at = dayjs("2022-01-01 " + this.form.start_time_at)
      .add(this.getItemCheckDuration, "minute")
      .format("HH:mm");

    this.form.executed_at = this.TPMPlanning.executed_at
      ? dayjs(this.TPMPlanning.executed_at).format("YYYY-MM-DD")
      : dayjs(this.TPMPlanning.planned_at).format("YYYY-MM-DD");

    if (
      this.TPMPlanning.value_qualitative ||
      this.TPMPlanning.value_quantitative
    ) {
      this.inputed = true;
    }
  },
  methods: {
    async doStart() {
      const response = await this.$store.dispatch(
        START_EXEC,
        this.$route.params.id
      );
      toastResponse(response);
      if (response.success) {
        this.interval = setInterval(() => {
          this.second = this.second + 1;
        }, 1000);
      }
    },
    async doStop() {
      const response = await this.$store.dispatch(
        STOP_EXEC,
        this.$route.params.id
      );
      toastResponse(response);
      if (response.success) {
        clearInterval(this.interval);
      }
    },
    async doSubmit() {
      if (this.$refs.formExec.validate()) {
        if (this.form.judge == this.TPMPlanning.ng_std) {
          this.dialogFinding = true;
          return;
        }
        if (
          parseInt(this.form.value) < this.TPMPlanning.lower_limit ||
          parseInt(this.form.value) > this.TPMPlanning.upper_limit
        ) {
          this.dialogFinding = true;
          return;
        }
        if (
          dayjs(this.form.end_time_at).diff(this.form.start_time_at, "minute") >
          this.getItemCheckDuration
        ) {
          this.dialogFinding = true;
        }
        this.submitFinish();
      }
    },
    successSave() {
      this.submitFinish();
    },
    async submitFinish() {
      let additional = {};

      if (this.form.judge) {
        additional = {
          ok_std: this.TPMPlanning.ok_std,
          flg_std_measurement: true,
        };
      } else {
        additional = {
          upper_limit: this.TPMPlanning.upper_limit,
          lower_limit: this.TPMPlanning.lower_limit,
          flg_std_measurement: false,
        };
      }

      const response = await this.$store.dispatch(FINISH_EXEC, {
        id: this.$route.params.id,
        body: {
          ...this.form,
          value: this.form.judge || this.form.value,
          user_in_charge: this.selectedPic.map((pic) => ({
            user_id: pic.user_id ? pic.user_id : pic,
          })),
          ...additional,
        },
      });
      toastResponse(response);
      if (response.success) {
        this.$router.go(-1);
      }
    },
  },
  directives: {
    mask: VueMaskDirective,
  },
};
</script>
