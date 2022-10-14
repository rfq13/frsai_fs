<template>
  <v-card class="shadow">
    <v-card-title>Finding TPM</v-card-title>
    <v-card-text>
      <div class="grey lighten-4 px-5 py-5 d-flex rounded-lg mb-7">
        <v-icon size="32" class="mr-3">mdi-hammer</v-icon>
        <div>
          <p class="mb-2">Shop: HPDC</p>
          <p class="mb-2">
            Machine:
            {{ selectedFinding.machine ? selectedFinding.machine.name : "-" }}
          </p>
          <p class="mb-2">
            Item Check:
            {{
              selectedFinding.item_check
                ? selectedFinding.item_check.item_check_name
                : ""
            }}
          </p>
        </div>
      </div>

      <v-form ref="findingForm" @submit.prevent="doSubmit">
        <v-row>
          <v-col cols="12">
            <p class="mb-0">Problem/Finding</p>
            <v-textarea
              v-model="form.problem"
              outlined
              hide-details="auto"
              :rules="[(v) => !!v || 'Required']"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <p class="mb-0">Countermeasure</p>
            <v-textarea
              v-model="form.countermeasure"
              outlined
              hide-details="auto"
            ></v-textarea>
          </v-col>
          <v-col cols="6">
            <p class="mb-0">
              {{ updateStatus ? "Actual" : "Execution" }} Plan Date
            </p>
            <base-datepicker v-model="form.date"></base-datepicker>
          </v-col>
          <v-col cols="6">
            <p class="mb-0">{{ updateStatus ? "Actual" : "Plan" }} PIC</p>
            <v-autocomplete
              v-model="selectedPic_"
              outlined
              dense
              hide-details="auto"
              item-text="full_name"
              item-value="user_id"
              :items="pics"
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div class="d-flex justify-end">
          <v-btn
            v-if="!updateStatus"
            type="button"
            color="#E1F0FF"
            class="ml-3 title text-capitalize text-primary"
            height="48"
            width="125"
            depressed
            @click="$emit('close')"
            >Cancel</v-btn
          >
          <v-btn
            v-if="!updateStatus"
            type="submit"
            color="primary"
            class="ml-3 title text-capitalize"
            height="48"
            width="125"
            depressed
            >Save</v-btn
          >
          <v-btn
            v-if="updateStatus"
            color="warning"
            class="ml-3 title text-capitalize"
            height="48"
            width="125"
            depressed
            @click="update('progress')"
            >On Progress</v-btn
          >
          <v-btn
            v-if="updateStatus"
            color="success"
            class="ml-3 title text-capitalize"
            height="48"
            width="125"
            depressed
            @click="update('done')"
            >Done</v-btn
          >
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import BaseDatepicker from "@/view/components/base/BaseDatepicker";
import {
  UPDATE_PROGRESS_TPMFINDING,
  SUBMIT_TPMFINDING,
} from "@/core/services/store/tpmFinding.module";
import {
  FETCH_PICS,
  FETCH_PICS_FINDING,
} from "@/core/services/store/tpmPlanning.module";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
export default {
  props: {
    updateStatus: {
      type: Boolean,
      default: false,
    },
    selectedFinding: {
      type: Object,
      default: () => ({}),
    },
    selectedPic: {
      type: Object,
      default: () => [],
    },
    fromFinding: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseDatepicker,
  },
  data() {
    return {
      form: {
        problem: "",
        countermeasure: "",
        date: "",
        pic: "",
      },
      selectedPic_: [],
    };
  },
  computed: {
    ...mapGetters({
      pics: "getPics",
    }),
  },
  watch: {
    selectedFinding(val) {
      if (this.updateStatus) {
        this.selectedPic_ = this.selectedFinding.founders.map((f) => f.id);
        this.form.problem = this.selectedFinding.problem;
        this.form.countermeasure = this.selectedFinding.countermeasure;
      } else {
        this.selectedPic_ = this.selectedPic;
      }
      this.form.date = dayjs(this.selectedFinding.planned_at).format(
        "YYYY-MM-DD"
      );
    },
  },
  async mounted() {
    if (this.fromFinding) {
      await this.$store.dispatch(
        FETCH_PICS_FINDING,
        this.selectedFinding.item_check_id
      );
      this.form.problem = this.selectedFinding.problem;
      this.form.countermeasure = this.selectedFinding.countermeasure;
    } else {
      await this.$store.dispatch(FETCH_PICS, this.selectedFinding.uuid);
    }
    if (this.updateStatus) {
      this.selectedPic_ = this.selectedFinding.founders.map((f) => f.id);
    } else {
      this.selectedPic_ = this.selectedPic;
    }
    this.form.date = dayjs(this.selectedFinding.planned_at).format(
      "YYYY-MM-DD"
    );
  },
  methods: {
    async update(type) {
      if (this.$refs.findingForm.validate()) {
        const response = await this.$store.dispatch(
          UPDATE_PROGRESS_TPMFINDING,
          {
            type: type,
            id: this.selectedFinding.uuid,
            body: {
              countermeasure: this.form.countermeasure,
              problem: this.form.problem,
              actual_at: this.form.date,
              user_in_charge: this.selectedPic_.map((pic) => ({
                user_id: pic.user_id ? pic.user_id : pic,
              })),
            },
          }
        );
        toastResponse(response);
        if (response.success) {
          this.$emit("success");
        }
      }
    },
    async doSubmit() {
      if (this.$refs.findingForm.validate()) {
        const response = await this.$store.dispatch(SUBMIT_TPMFINDING, {
          line_id: this.selectedFinding.line_id,
          machine_id: this.selectedFinding.machine_id,
          item_check_id: this.selectedFinding.item_check_id,
          problem: this.form.problem,
          countermeasure: this.form.countermeasure,
          planning_at: this.form.date,
          user_in_charge: this.selectedPic_.map((pic) => ({
            user_id: pic.user_id ? pic.user_id : pic,
          })),
        });
        toastResponse(response);
        if (response.success) {
          this.$emit("success");
        }
      }
    },
  },
};
</script>
