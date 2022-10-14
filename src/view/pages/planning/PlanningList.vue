<template>
  <section>
    <v-card class="mb-7">
      <v-card-title>Generate TPM Monthly Planning</v-card-title>
      <v-card-text>
        <v-form ref="generateForm" @submit.prevent="doGenerate">
          <v-row>
            <v-col md="2">
              <v-select
                v-model="form.month"
                outlined
                dense
                hide-details
                :rules="[(v) => !!v || 'Required']"
                :items="months"
              ></v-select>
            </v-col>
            <v-col md="1" class="px-0">
              <v-select
                outlined
                v-model="form.year"
                dense
                hide-details
                :rules="[(v) => !!v || 'Required']"
                :items="years"
              ></v-select>
            </v-col>
            <v-col md="2">
              <v-select
                outlined
                v-model="form.line"
                dense
                hide-details
                :rules="[(v) => !!v || 'Required']"
                :items="lines"
                item-value="id"
                item-text="name"
                return-object
              ></v-select>
            </v-col>
            <v-col md="1">
              <v-btn
                type="submit"
                :disabled="generated && TPMPlannings.length > 0"
                color="primary"
                :loading="loading"
                >Generate</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="rounded-lg">
      <v-card-title class="title mb-0">
        {{ form.line.name }} PLANNING {{ months[form.month - 1].text }}
        {{ form.year }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
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
          :items="planningFiltered"
          :headers="headers"
          no-data-text="Data has not been generated yet"
        >
          <template v-slot:[`item.machine`]="{ item }">
            {{ item.machine ? item.machine.name : "-" }}
          </template>
          <template v-slot:[`item.item_check`]="{ item }">
            {{ item.item_check ? item.item_check.item_check_name : "-" }}
          </template>
          <template v-slot:[`item.method`]="{ item }">
            {{
              item.item_check && item.item_check.ledger_method
                ? item.item_check.ledger_method.name
                : "-"
            }}
          </template>
          <template v-slot:[`item.in_charge`]="{ item }">
            {{ item.item_check ? item.item_check.in_charge : "-" }}
          </template>
          <template v-slot:[`item.periodic`]="{ item }">
            {{
              item.item_check
                ? `${item.item_check.periodic} ${item.item_check.flg_periodic}`
                : "-"
            }}
          </template>
          <template v-slot:[`item.std`]="{ item }">
            {{
              item.item_check
                ? getStd(item.item_check.flg_std_measurement)
                : "-"
            }}
          </template>
          <template v-slot:[`item.duration`]="{ item }">
            {{ item.item_check ? item.item_check.duration : "-" }}
          </template>
          <template v-slot:[`item.planned_at`]="{ item }">
            {{ item.planned_at ? formatDate(item.planned_at) : "-" }}
          </template>
          <template v-slot:[`item.pic`]="{ item }">
            {{ item.planners ? mapIncharge(item) : "-" }}
          </template>
          <!-- <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="editItem(item)">mdi-pencil</v-icon>
          </template> -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                  <v-icon size="32">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item style="width: 122px" @click="editItem(item)"
                  >Revisi</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item
                  v-if="!item.planned_at"
                  style="width: 122px"
                  @click="assignItem(item)"
                  >Assign</v-list-item
                >
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="editPlanning" width="650">
      <v-card>
        <v-card-title>
          {{ isAssign ? "Assign" : "Revisi" }} Planning
          <v-icon
            class="ml-auto"
            @click="
              editPlanning = false;
              isAssign = false;
            "
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-5 py-6">
          <v-form ref="formEdit" @submit.prevent="doSubmitEdit">
            <p v-if="isAssign" class="mb-0">
              User <span class="error--text">*</span>
            </p>
            <v-autocomplete
              v-if="isAssign"
              v-model="users_in_charge"
              outlined
              dense
              :items="pics"
              item-value="user_id"
              item-text="full_name"
              @change="getUser"
              multiple
              selected
              label="User"
              :rules="[(v) => !!v || 'Field is Required']"
            ></v-autocomplete>

            <div
              v-else
              class="grey lighten-4 pa-3 d-flex items-center mb-8"
              style="border-radius: 12px"
            >
              <div class="mr-3">
                <v-icon>mdi-pencil</v-icon>
              </div>
              <div>
                <p class="mb-0">Machine: {{ selectedPlanning.machine.name }}</p>
                <p class="mb-0">
                  Item Check: {{ selectedPlanning.item_check.item_check_name }}
                </p>
                <p class="mb-0">PIC: {{ selectedPlanning.pic }}</p>
              </div>
            </div>
            <div v-if="!isAssign">
              <p class="mb-0">Reason</p>
              <v-textarea
                v-model="reason"
                outlined
                dense
                :disabled="isAvailable"
              ></v-textarea>
            </div>

            <p class="mb-0">Tanggal <span class="error--text">*</span></p>
            <base-datepicker
              v-model="date"
              :rules="[(v) => !!v || 'Required']"
              :disabled="isAvailable"
            ></base-datepicker>

            <v-divider></v-divider>
            <div class="d-flex justify-end">
              <v-btn
                type="button"
                color="#E1F0FF"
                class="ml-3 title text-capitalize text-primary"
                height="48"
                width="125"
                depressed
                @click="
                  editPlanning = false;
                  isAssign = false;
                "
                >Close</v-btn
              >
              <v-btn
                type="submit"
                color="primary"
                class="ml-3 title text-capitalize"
                height="48"
                width="125"
                depressed
                :disabled="isAvailable"
                >Save</v-btn
              >
            </div>
          </v-form>
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
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import {
  FETCH_PLANNINGS,
  UPDATE_PLANNING,
  GET_GENERATED,
  SET_PLANNINGS,
  ASSIGN_PLANNING,
  FETCH_PICS,
} from "@/core/services/store/tpmPlanning.module";
import { FETCH_USERS } from "@/core/services/store/user.module";
import { mapGetters } from "vuex";
import { FETCH_LINES } from "@/core/services/store/line.module";
import dayjs from "dayjs";
import BaseDatepicker from "@/view/components/base/BaseDatepicker.vue";
export default {
  components: { BaseDatepicker },
  data() {
    return {
      form: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        line: "",
      },
      isAssign: false,
      loading: false,
      generated: true,
      date: "",
      reason: "",
      pic_name: "",
      users_in_charge: null,
      headers: [
        { text: "Action", value: "actions" },
        { text: "Machine", value: "machine" },
        { text: "Item Check", value: "item_check" },
        { text: "Method", value: "method" },
        { text: "Duration", value: "duration" },
        { text: "MP", value: "mp" },
        { text: "MH", value: "mh" },
        { text: "Std Measurement", value: "std" },
        { text: "Periodic", value: "periodic" },
        { text: "In charge", value: "in_charge" },
        { text: "PIC", value: "pic" },
        { text: "Plan Date", value: "planned_at" },
      ],
      addTpm: false,
      keyword: "",
      selectedPlanning: { machine: {}, item_check: {} },
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
      editPlanning: false,
      years: [],
    };
  },
  computed: {
    ...mapGetters({
      TPMPlannings: "getTPMPlannings",
      lines: "getLines",
      users: "getUsers",
      pics: "getPics",
    }),
    planningFiltered() {
      if (this.keyword) {
        return this.TPMPlannings.filter((plan) => {
          return `${plan.machine.name} ${plan.item_check?.item_check_name} ${plan.item_check?.ledger_method?.name} ${plan.item_check?.in_charge} ${plan.pic}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.TPMPlannings;
    },
    isAvailable() {
      return (
        !!this.selectedPlanning.value_quantitative ||
        !!this.selectedPlanning.value_qualitative
      );
    },
  },
  watch: {
    ["form.month"](val) {
      if (!!val) {
        this.refreshData();
      }
    },
    ["form.year"](val) {
      if (!!val) {
        this.refreshData();
      }
    },
    ["form.line"](val) {
      if (!!val) {
        this.refreshData();
      }
    },
    editPlanning(val) {
      if (val == false && this.isAssign) {
        this.isAssign = false;
      }
    },
    isAssign(val) {
      if (val) {
        let ic = [];

        this.date = this.selectedPlanning.planned_at
          ? dayjs(this.selectedPlanning.planned_at).format("YYYY-MM-DD")
          : "";

        // if (this.selectedPlanning.tpm_planning_in_charge) {
        //   ic = this.selectedPlanning.tpm_planning_in_charge.map(
        //     (pic) => "" + pic?.user_id
        //   );
        // }

        this.users_in_charge = null;
      } else {
        this.date = "";
        this.reason = "";
        this.users_in_charge = [];
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(FETCH_LINES);
    this.$store.dispatch(FETCH_USERS, { department: "Maintenance" });
    const toYear = new Date().getFullYear() + 5;
    for (let index = 2022; index <= toYear; index++) {
      this.years.push(index);
    }
    this.$store.commit(SET_PLANNINGS, []);
    this.$store.dispatch(SET_PAGE_TITLE, "TPM Planning List");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "TPM Planning List" }]);
    this.form.line = this.lines[0];
  },
  methods: {
    getIncharge(item) {
      let inch = "PRD";
      if (item == 1) {
        inch = "MTE";
      }
      if (item == 2) {
        inch = "Vendor";
      }
      return inch;
    },
    getStd(std) {
      return std == 0 ? "Judgement" : "Range";
    },
    async doGenerate() {
      if (this.$refs.generateForm.validate()) {
        confirm({
          type: "question",
          message: "Are you sure want to generate data?",
          onYes: async () => {
            this.loading = true;
            await this.$store.dispatch(GET_GENERATED, {
              monthNumber: this.form.month,
              year: this.form.year,
              line: this.form.line,
              isGenerate: true,
            });
            this.loading = false;
            this.generated = true;
          },
        });
      }
    },
    async refreshData() {
      this.loading = true;
      await this.$store.dispatch(GET_GENERATED, {
        monthNumber: this.form.month,
        year: this.form.year,
        line: this.form.line,
        isGenerate: false,
      });
      this.loading = false;
      this.generated = true;
    },
    editItem(item) {
      this.selectedPlanning = { ...item };
      this.$store.dispatch(FETCH_PICS, item.uuid);
      this.editPlanning = true;
    },
    assignItem(item) {
      this.selectedPlanning = { ...item };
      this.$store.dispatch(FETCH_PICS, item.uuid);
      this.editPlanning = true;
      this.isAssign = true;
    },
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD");
    },
    async doSubmitEdit() {
      if (this.$refs.formEdit.validate()) {
        let response = {};
        if (this.isAssign) {
          response = await this.$store.dispatch(ASSIGN_PLANNING, {
            id: this.selectedPlanning.uuid,
            body: {
              planned_at: this.formatDate(this.date),
              user_in_charge: this.users_in_charge.map((user_id) => ({
                user_id,
              })),
              pic: this.pic_name ?? null,
            },
          });
        } else {
          response = await this.$store.dispatch(UPDATE_PLANNING, {
            body: { planned_at: this.date, reason: this.reason },
            id: this.selectedPlanning.uuid,
          });
        }
        toastResponse(response);
        if (response.success) {
          this.editPlanning = false;
          this.$refs.formEdit.reset();
          this.refreshData();
        }
      }
    },
    mapIncharge(item) {
      if (item.planners) {
        return item.planners.map((pic) => pic?.full_name).join(", ");
      }
      return "-";
    },
  },
};
</script>
