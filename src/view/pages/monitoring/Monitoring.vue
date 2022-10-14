<template>
  <v-card class="shadow">
    <v-card-title>
      <div>
        <p class="title mb-0">TPM Monitoring</p>
        <p class="grey--text body-2">Monthly Activities</p>
      </div>
      <v-btn
        text
        class="ml-auto font-weight-bold body-1"
        color="primary"
        @click="dialogMH = true"
        >Show MH Graph</v-btn
      >
    </v-card-title>

    <v-card-text>
      <div class="d-flex mb-7">
        <div class="ml-auto d-flex items-center">
          <v-select
            v-model="filterStatus"
            outlined
            dense
            hide-details
            class="mx-2"
            placeholder="Status"
            label="status"
            :items="statusSelection"
            style="max-width: 190px"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                :color="data.item.color"
                @click="data.select"
                @click:close="filterStatus = ''"
              >
                {{ data.item.text }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                <v-chip :color="data.item.color">
                  {{ data.item.text }}
                </v-chip>
              </template>
            </template>
          </v-select>
          <v-select
            v-model="form.month"
            outlined
            dense
            hide-details
            class="mx-2"
            placeholder="Month"
            label="Month"
            :items="months"
          ></v-select>
          <v-select
            v-model="form.year"
            outlined
            dense
            hide-details
            class="mx-2"
            :items="years"
            label="Year"
            placeholder="Year"
          ></v-select>
          <v-select
            v-model="form.line"
            outlined
            dense
            hide-details
            :items="lines"
            item-value="id"
            item-text="name"
            class="mx-2"
            placeholder="Line"
            label="Line"
          ></v-select>
          <v-btn
            color="primary"
            depressed
            @click="renderPage"
            :loading="loading"
            >Show</v-btn
          >
        </div>
      </div>

      <div
        v-if="!loading && TPMMonitorings.length > 0"
        class="d-flex justify-center my-7"
      >
        <div class="d-flex items-center mx-4">
          <v-chip style="width: 45px" class="mr-1" small color="error"></v-chip>
          Delay
        </div>
        <div class="d-flex items-center mx-4">
          <v-chip style="width: 45px" class="mr-1" small color="info"></v-chip>
          Done
        </div>
        <div class="d-flex items-center mx-4">
          <v-chip
            style="width: 45px"
            class="mr-1"
            small
            color="warning"
          ></v-chip>
          On Progress
        </div>
        <div class="d-flex items-center mx-4">
          <v-chip
            style="width: 45px"
            class="mr-1"
            small
            color="#b5b5c3"
          ></v-chip>
          Planning
        </div>
      </div>

      <v-row v-if="!loading && TPMMonitorings.length > 0" no-gutters>
        <v-col
          md="4"
          class="d-none d-md-block"
          style="border-right: 1px solid #ddd"
        >
          <table v-if="!loading" class="tb" cellpadding="2" style="width: 100%">
            <thead>
              <tr style="border-top: 0.5px solid #ddd; height: 60px">
                <th
                  class="body-1"
                  style="width: 50px; border-bottom: 0.5px solid #ddd"
                >
                  Action
                </th>
                <th class="body-1" style="border-bottom: 0.5px solid #ddd">
                  Item
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, key) in tpmTable"
                :key="key"
                :style="key % 2 == 1 ? 'background-color: #f5f5f5;' : ''"
              >
                <td class="text-center" style="border-bottom: 0.3px solid #ddd">
                  <v-icon
                    :disabled="task.done"
                    @click="toDetail(task.uuid)"
                    :style="task.done ? 'cursor: not-allowed !important' : ''"
                    >mdi-pencil-box-outline</v-icon
                  >
                </td>
                <td
                  style="height: 53.3px; border-bottom: 0.3px solid #ddd"
                  class="pr-3"
                >
                  <b>{{ task.machine_name }} </b><br />
                  {{ task.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
        <v-col md="8">
          <svg id="gantt"></svg>
        </v-col>
      </v-row>

      <v-card v-if="!loading && TPMMonitorings.length == 0" class="mb-7 mt-16">
        <v-card-text class="text-center"> Result not found </v-card-text>
      </v-card>

      <base-loading v-if="loading" />

      <v-dialog v-model="dialogMH" width="1028">
        <detail-MH></detail-MH>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script>
import Gantt from "frappe-gantt";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import DetailMH from "@/view/components/Monitoring/DetailMH";
import { FETCH_PLANNING_MONITORING } from "@/core/services/store/tpmPlanning.module";
import { mapGetters } from "vuex";
import BaseLoading from "../../components/base/BaseLoading.vue";
import { FETCH_LINES } from "@/core/services/store/line.module";
export default {
  components: {
    DetailMH,
    BaseLoading,
  },
  data() {
    return {
      form: {
        month: "",
        year: "",
        line: "",
      },
      dialogMH: false,
      loading: false,
      years: [],
      months: [
        { text: "Januari", value: 1 },
        { text: "Februari", value: 2 },
        { text: "Maret", value: 3 },
        { text: "April", value: 4 },
        { text: "Mei", value: 5 },
        { text: "Juni", value: 6 },
        { text: "Juli", value: 7 },
        { text: "Agustus", value: 8 },
        { text: "September", value: 9 },
        { text: "Oktober", value: 10 },
        { text: "November", value: 11 },
        { text: "Desember", value: 12 },
      ],
      filterStatus: "",
      statusSelection: [
        {
          value: "delay",
          text: "Delay",
          color: "error",
        },
        {
          value: "done",
          text: "Done",
          color: "info",
        },
        {
          value: "on_progress",
          text: "On Progress",
          color: "warning",
        },
        {
          value: "planning",
          text: "Planning",
          color: "#b5b5c3",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      TPMMonitorings: "getTPMMonitorings",
      lines: "getLines",
    }),
    filteredTPM() {
      if (this.filterStatus) {
        const newArr = this.TPMMonitorings.filter((tpm) => {
          return tpm.custom_class == this.filterStatus;
        });
        return newArr.map((aData, index) => ({ ...aData, row: index }));
      }
      return this.TPMMonitorings;
    },
    tpmTable() {
      return this.filteredTPM.filter((tpm) => tpm.name != "...");
    },
  },
  watch: {
    filterStatus() {
      this.$nextTick(() => {
        const gantt = new Gantt("#gantt", this.filteredTPM, {
          bar_height: 36,
          bar_corner_radius: 12,
          custom_popup_html: (task) => {
            return `
              <v-card>
              <v-card-text>
                <p class="mb-0" >Method: <b>${task.method}</b></p>
                <p class="mb-0" >Duration: <b>${task.duration}</b></p>
                <p class="mb-0" >PIC: <b>${task.pic}</b></p>
                <p class="mb-0" >In Charge: <b>${task.inCharge}</b></p>
                <p class="mb-0" >Status: <b>${
                  task.revised_at == task.start
                    ? "Revisi"
                    : task.executed_at == task.start
                    ? "Execution"
                    : "Original"
                }</b></p>
                ${
                  task.revised_at
                    ? `<p class="mb-0" >Original Date: <b>${task.start}</b></p>`
                    : ""
                }
                ${
                  task.revised_at
                    ? `<p class="mb-0" >Revise Date: <b>${task.revised_at}</b></p>`
                    : ""
                }
              </v-card-text>
              </v-card>
            `;
          },
        });
      });
    },
  },
  async mounted() {
    for (let index = 2022; index < new Date().getFullYear() + 5; index++) {
      this.years.push(index);
    }
    await this.$store.dispatch(FETCH_LINES);
    const { year, month, line } = this.$route.query;
    if (line) {
      this.form.line = line;
    } else {
      this.form.line = this.lines[0].id;
    }
    this.form.year = year || new Date().getFullYear();
    this.form.month = month || new Date().getMonth() + 1;
    if (!this.$route.query.line) {
      this.$router.push(
        `?year=${this.form.year}&month=${this.form.month}&line=${this.form.line}`
      );
    }

    this.$store.dispatch(SET_PAGE_TITLE, "Monitoring");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Monitoring" }]);

    this.$store.dispatch(SET_PAGE_TITLE, "Monitoring");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Monitoring" }]);

    // let taskData = [
    //   {
    //     row: 0,
    //     id: "some-udid-a",
    //     name: "task-A",
    //     start: "2022-09-01",
    //     end: "2022-09-01",
    //     progress: 0,
    //     dependencies: "",
    //   },
    //   {
    //     row: 0,
    //     id: "some-udid-b",
    //     name: "task-B",
    //     start: "2022-09-15",
    //     end: "2022-09-15",
    //     progress: 0,
    //     dependencies: 0,
    //   },
    //   {
    //     row: 1,
    //     id: "some-udid-c",
    //     name: "task-C",
    //     start: "2022-09-12",
    //     end: "2022-09-12",
    //     progress: 0,
    //     dependencies: "",
    //   },
    //   {
    //     row: 2,
    //     id: "some-udid-d",
    //     name: "task-D",
    //     start: "2022-09-14",
    //     end: "2022-09-14",
    //     progress: 0,
    //     dependencies: 2,
    //   },
    // ];
    // const gantt = new Gantt("#gantt", taskData, {
    //   bar_height: 31,
    //   bar_corner_radius: 12,
    // });

    await this.renderPage();
  },
  methods: {
    toDetail(uuid) {
      this.$router.push(`/monitoring/${uuid}?type=1`);
    },
    async renderPage() {
      this.loading = true;
      this.$router.push(
        `?year=${this.form.year}&month=${this.form.month}&line=${this.form.line}`
      );
      await this.$store.dispatch(FETCH_PLANNING_MONITORING, {
        line: this.form.line,
        month: this.form.month,
        year: this.form.year,
      });
      this.loading = false;
      if (this.TPMMonitorings.length == 0) {
        return false;
      }
      this.$nextTick(() => {
        const gantt = new Gantt("#gantt", this.filteredTPM, {
          bar_height: 36,
          bar_corner_radius: 12,
          custom_popup_html: (task) => {
            return `
              <v-card>
              <v-card-text>
                <p class="mb-0" >Method: <b>${task.method}</b></p>
                <p class="mb-0" >Duration: <b>${task.duration}</b></p>
                <p class="mb-0" >PIC: <b>${task.pic}</b></p>
                <p class="mb-0" >In Charge: <b>${task.inCharge}</b></p>
                <p class="mb-0" >Status: <b>${
                  task.revised_at == task.start
                    ? "Revisi"
                    : task.executed_at == task.start
                    ? "Execution"
                    : "Original"
                }</b></p>
                ${
                  task.revised_at
                    ? `<p class="mb-0" >Original Date: <b>${task.start}</b></p>`
                    : ""
                }
                ${
                  task.revised_at
                    ? `<p class="mb-0" >Revise Date: <b>${task.revised_at}</b></p>`
                    : ""
                }
                ${
                  task.reason
                    ? `<p class="mb-0" >Revise Date: <b>${task.reason}</b></p>`
                    : ""
                }
              </v-card-text>
              </v-card>
            `;
          },
        });
      });
    },
  },
};
</script>

<style>
.delay .bar-progress {
  fill: #f64e60 !important;
  border-radius: 12px !important;
}
.done .bar-progress {
  fill: #1bc5bd !important;
  border-radius: 12px !important;
}
.progress .bar-progress {
  fill: #ffa800 !important;
  border-radius: 12px !important;
}
.planning .bar-progress {
  fill: #b5b5c3 !important;
  border-radius: 12px !important;
}
.white .bar-wrapper {
  fill: #eeeeff !important;
  background: #eeeeff !important;
  color: black !important;
  border-radius: 12px !important;
}
.popup-wrapper {
  background: #ffffff !important;
  box-shadow: 0px 0px 20px -7px rgba(0, 0, 0, 0.4) !important;
  border-radius: 6px !important;
  padding: 7px 19px !important;
  width: 151px !important;
  color: #3f4254 !important;
}
.tb > .v-data-table__wrapper > tbody > tr:nth-child(even) {
  background-color: #f2f2f2 !important;
}
</style>
