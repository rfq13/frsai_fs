<template>
  <v-card>
    <v-card-title>
      TPM Finding
      <v-btn color="primaryLow" depressed class="ml-auto primary--text">
        <v-icon class="mr-3">mdi-download </v-icon>
        export
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div class="my-6">
        <v-row>
          <v-col md="6"></v-col>
          <v-col md="2">
            <v-select
              v-model="form.year"
              outlined
              dense
              hide-details
              placeholder="Year"
              :items="years"
            ></v-select>
          </v-col>
          <v-col md="2">
            <v-select
              v-model="form.line"
              outlined
              dense
              hide-details
              :items="lineItems"
              item-value="id"
              item-text="name"
              class="mx-2"
              placeholder="Line"
              label="Line"
            ></v-select>
          </v-col>
          <v-col md="2">
            <v-text-field
              v-model="keyword"
              outlined
              dense
              hide-details
              append-icon="mdi-magnify"
              placeholder="Search"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <v-data-table :headers="headers" :items="filterTpmFinding">
        <template v-slot:[`item.no`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :class="`text-capitalize ${getColor(item.status).color}--text`"
            :style="getColor(item.status).background"
            small
            >{{ getColor(item.status).label }}</v-chip
          >
        </template>
        <template v-slot:[`item.machine`]="{ item }">
          {{ item.machine ? item.machine.name : "-" }}
        </template>
        <template v-slot:[`item.item_check`]="{ item }">
          {{ item.item_check ? item.item_check.item_check_name : "-" }}
        </template>
        <template v-slot:[`item.plan_pic`]="{ item }">
          {{ item.founders.map((pic) => pic.full_name).join(", ") }}
        </template>
        <template v-slot:[`item.actual_pic`]="{ item }">
          {{ item.executors.map((pic) => pic.full_name).join(", ") }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                <v-icon size="32">mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="editItem(item)">Edit</v-list-item>
              <v-list-item class="text-error" @click="deleteItem(item)"
                >Delete</v-list-item
              >
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <v-dialog v-model="dialogFinding" width="650">
        <finding-form
          :selectedFinding="selectedFinding"
          :update-status="true"
          :fromFinding="true"
          @success="successSave"
        >
        </finding-form>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import FindingForm from "../../components/Finding/FindingForm.vue";
import {
  FETCH_TPMFINDINGS,
  DELETE_TPMFINDING,
} from "@/core/services/store/tpmFinding.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import { FETCH_LINES } from "@/core/services/store/line.module";

export default {
  components: {
    FindingForm,
  },
  data() {
    return {
      dialogFinding: false,
      headers: [
        {
          text: "Action",
          align: "start",
          value: "actions",
        },
        {
          text: "No",
          align: "start",
          value: "no",
        },
        {
          text: "Machine",
          align: "start",
          value: "machine",
        },
        { text: "Item Check", value: "item_check" },
        { text: "Problem", value: "problem" },
        { text: "Finding Date", value: "created_at" },
        { text: "Countermeasure", value: "countermeasure" },
        { text: "Planning Execution", value: "planning_at" },
        { text: "Status", value: "status" },
        { text: "Actual Execution", value: "actual_at" },
        { text: "Plan PIC", value: "plan_pic" },
        { text: "Actual PIC", value: "actual_pic" },
      ],
      selectedFinding: {},
      years: [],
      keyword: "",
      form: {
        line: "",
        year: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      tpmFindings: "getTPMFindings",
      lines: "getLines",
    }),
    filterTpmFinding() {
      if (this.keyword) {
        return this.tpmFindings.filter((fin) => {
          return `${fin.machine.name} ${fin.item_check.item_check_name} ${fin.problem} ${fin.countermeasure}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.tpmFindings;
    },
    lineItems() {
      return [{ id: "all", name: "all" }, ...this.lines];
    },
  },
  watch: {
    ["form.year"](val) {
      this.$router.push(`?line=${this.form.line}&year=${this.form.year}`);
      this.refetch();
    },
    ["form.line"](val) {
      this.$router.push(`?line=${this.form.line}&year=${this.form.year}`);
      this.refetch();
    },
  },
  async mounted() {
    for (let index = 2022; index < new Date().getFullYear() + 1; index++) {
      this.years.push(index);
    }
    await this.$store.dispatch(FETCH_LINES);
    this.$store.dispatch(SET_PAGE_TITLE, "TPM Finding");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "TPM Finding List" }]);

    const { year, line } = this.$route.query;
    this.form.year = parseInt(year) || new Date().getFullYear();
    this.form.line = line || this.lineItems[0].id;
    // if (!line) {
    //   this.$router.push(`?line=${this.form.line}&year=${this.form.year}`);
    // }

    await this.$store.dispatch(FETCH_TPMFINDINGS, {
      year: this.form.year,
      line: this.form.line,
    });
  },
  methods: {
    editItem(item) {
      this.selectedFinding = { ...item };
      this.dialogFinding = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: "Are you sure want to delete TPM Finding?",
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_TPMFINDING,
            item.uuid
          );
          toastResponse(response);
          this.$store.dispatch(FETCH_TPMFINDINGS, {
            year: this.form.year,
            line: this.form.line,
          });
        },
      });
    },
    async refetch() {
      await this.$store.dispatch(FETCH_TPMFINDINGS, {
        year: this.form.year,
        line: this.form.line,
      });
    },
    successSave() {
      this.dialogFinding = false;
      this.$store.dispatch(FETCH_TPMFINDINGS, {
        year: this.form.year,
        line: this.form.line,
      });
    },
    getColor(status) {
      // 0 - need countermeasure
      // 1 - on progress
      // 2 - delay
      // 3 - done

      if (status == 0) {
        return {
          label: "Need Countermeasure",
          color: "error",
          background: "background-color: rgba(255, 170, 179, 0.6);",
        };
      }
      if (status == 1) {
        return {
          label: "On Progress",
          color: "success",
          background: "background-color: #D0FCE1",
        };
      }
      if (status == 2) {
        return {
          label: "Delay",
          color: "warning",
          background: "background-color: rgba(247, 198, 105, 0.4)",
        };
      }
      if (status == 3) {
        return {
          label: "Done",
          color: "primary",
          background: "background-color: rgba(91, 196, 255, 0.4);",
        };
      }
    },
  },
};
</script>
