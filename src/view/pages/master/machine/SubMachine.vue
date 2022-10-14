<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Sub Machine</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredSubmachines"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-SubMachine-${new Date()
                .toISOString()
                .substr(0, 10)}.xls`"
            >
              <v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export
            </export-excel>
            <v-btn
              color="primary"
              @click="
                () => {
                  selectedSubMachine = null;
                  addSubMachine = true;
                }
              "
              depressed
              class="text-capitalize font-weight-medium"
              height="34"
            >
              <v-icon small class="mr-2">mdi-plus</v-icon> New Record
            </v-btn>
          </div>
        </div>

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
          :items="filteredSubmachines"
          :headers="headers"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template></v-data-table
        >
      </v-card-text>
    </v-card>
    <v-dialog v-model="addSubMachine" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedSubMachine ? "Edit" : "Create" }} Sub Machine
          <v-icon class="ml-auto" @click="addSubMachine = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <sub-machine-form
            :selectedSubMachine="selectedSubMachine"
            @success="successSave"
            @close="addSubMachine = false"
          ></sub-machine-form>
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
import SubMachineForm from "@/view/components/Machine/SubMachineForm.vue";
import {
  DELETE_SUB_MACHINE,
  FETCH_SUB_MACHINES,
} from "@/core/services/store/machine.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import dayjs from "dayjs";
export default {
  components: {
    SubMachineForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        Code: "code",
        Name: "name",
        Description: "description",
        Machine: "machine.name",
        "Created By": "user.full_name",
        "Created At": "createdAt",
      },
      headers: [
        { text: "No", value: "no" },
        {
          text: "Code",
          align: "start",
          value: "code",
        },
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        {
          text: "Description",
          align: "start",
          value: "description",
        },
        {
          text: "Machine",
          align: "start",
          value: "machine.name",
        },
        {
          text: "Created By",
          align: "start",
          value: "user.full_name",
        },
        {
          text: "Created At",
          align: "start",
          value: "createdAt",
        },

        { text: "Action", value: "actions" },
      ],
      addSubMachine: false,
      selectedSubMachine: null,
      keyword: "",
    };
  },
  computed: {
    ...mapGetters({
      subMachines: "getSubMachines",
    }),
    filteredSubmachines() {
      if (this.keyword) {
        return this.subMachines
          .filter((sub) => {
            return `${sub.code} ${sub.name} ${sub.description}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((item, i) => ({
            ...item,
            no: i + 1,
            createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
          }));
      }
      return this.subMachines.map((item, i) => ({
        ...item,
        no: i + 1,
        createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
      }));
    },
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Sub Machine");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Sub Machine" }]);
    this.$store.dispatch(FETCH_SUB_MACHINES);
  },
  methods: {
    editItem(item) {
      this.selectedSubMachine = { ...item };
      this.addSubMachine = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(
            DELETE_SUB_MACHINE,
            item.id
          );
          toastResponse(response);
          this.$store.dispatch(FETCH_SUB_MACHINES);
        },
      });
    },
    successSave() {
      this.addSubMachine = false;
      this.$store.dispatch(FETCH_SUB_MACHINES);
    },
  },
};
</script>
