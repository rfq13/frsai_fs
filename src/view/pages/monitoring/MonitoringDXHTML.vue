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
            v-model="form.month"
            outlined
            dense
            hide-details
            class="mx-2"
            placeholder="Month"
            :items="months"
          ></v-select>
          <v-select
            v-model="form.year"
            outlined
            dense
            hide-details
            class="mx-2"
            :items="years"
            placeholder="Year"
          ></v-select>
          <v-select
            v-model="form.line"
            outlined
            dense
            hide-details
            :items="lines"
            item-text="name"
            item-value="id"
            class="mx-2"
            placeholder="Line"
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

      <v-row
        :class="!loading && TPMMonitorings.length == 0 ? 'd-none' : 'd-block'"
        no-gutters
      >
        <v-col md="12">
          <div
            ref="gantt"
            style="width: 100%; height: 660px; max-height: 800px"
          ></div>
        </v-col>
      </v-row>

      <v-card
        v-if="!loading && TPMMonitorings.length == 0"
        class="mb-7 mt-16"
        flat
        elevation="0"
        style="border: 1px solid #ddd"
      >
        <v-card-text class="text-center"> Result not found </v-card-text>
      </v-card>

      <base-loading v-if="loading" />

      <div
        v-if="!loading && TPMMonitorings.length > 0"
        class="d-flex justify-center mt-7"
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

      <v-dialog v-model="dialogMH" width="1028">
        <detail-MH></detail-MH>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script>
import { gantt } from "dhtmlx-gantt";
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
    };
  },
  computed: {
    ...mapGetters({
      TPMMonitorings: "getTPMMonitorings",
      lines: "getLines",
    }),
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

    this.$store.dispatch(SET_PAGE_TITLE, "Monitoring");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Monitoring" }]);

    const columns = [
      {
        name: "action",
        label: "Action",
        width: 25,
        onrender: function (task, node) {
          return <img src="/vector.png" />;
        },
      },
      {
        name: "text",
        label: "Task name",
        width: 55,
      },
      {
        name: "description",
        label: "Description",
        width: 90,
      },
    ];
    gantt.config.scale_height = 36 * 3;
    gantt.config.scales = [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "day", step: 1, format: "%d %M" },
    ];
    gantt.attachEvent("onTaskClick", (id, e) => {
      const tpm = this.TPMMonitorings.filter((tpm) => tpm.id == id)[0];
      this.$router.push(`/monitoring/${tpm.uuid}?type=1`);
    });
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.init(this.$refs.gantt);
    gantt.config.columns = columns;
    gantt.config.min_task_grid_row_height = 78;
    gantt.plugins({
      tooltip: true,
    });
    gantt.templates.tooltip_text = function (start, end, task) {
      return `<v-card>
          <v-card-text>
            <p class="mb-0" >Method: <b>${task.method}</b></p>
            <p class="mb-0" >Duration: <b>${task.duration}</b></p>
            <p class="mb-0" >PIC: <b>${task.pic}</b></p>
            <p class="mb-0" >In Charge: <b>${task.inCharge}</b></p>
            <p class="mb-0" >Judge: <b>${task.judge}</b></p>
          </v-card-text>
          </v-card>`;
    };

    gantt.templates.task_class = function (start, end, task) {
      return task.custom_class;
    };

    await this.renderPage();
  },
  methods: {
    toDetail(uuid) {
      this.$router.push(`/monitoring/${uuid}?type=1`);
    },
    async renderPage() {
      this.loading = true;
      this.$router.push(
        `?month=${this.form.month}&year=${this.form.year}&line=${this.form.line}`
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
      gantt.parse({ tasks: this.TPMMonitorings, links: [] });
      gantt.eachTask(function (task) {
        task.$open = true;
      });
      gantt.render();
    },
  },
};
</script>

<style>
.delay {
  background: #f64e60 !important;
  border: none !important;
}
.done {
  background: #1bc5bd !important;
  border: none !important;
}
.progress {
  background: #ffa800 !important;
  border: none !important;
}
.planning {
  background: #b5b5c3 !important;
  border: none !important;
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
.gantt_task_row {
  border-bottom: 1px solid #ddd;
}
.gantt_row_task {
  border-bottom: 1px solid #ddd;
}
</style>
