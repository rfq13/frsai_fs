<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Type Machine</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="filteredTypes"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-TypeMachine-${new Date()
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
                (evt) => {
                  selectedType = null;
                  addTypeMachine = true;
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

        <v-data-table class="mt-5" :items="filteredTypes" :headers="headers">
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addTypeMachine" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedType ? "Edit" : "Create" }} Type Machine
          <v-icon class="ml-auto" @click="addTypeMachine = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <type-machine-form
            :selectedType="selectedType"
            @success="successSave"
            @close="addTypeMachine = false"
          ></type-machine-form>
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
import TypeMachineForm from "@/view/components/Machine/TypeMachineForm.vue";
import {
  DELETE_TYPES,
  FETCH_TYPES,
} from "@/core/services/store/machine.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
export default {
  components: {
    TypeMachineForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Type Machine Code": "code",
        "Type Machine Name": "name",
        Description: "description",
      },
      headers: [
        {
          text: "No",
          value: "no",
        },
        {
          text: "Type Machine Code",
          align: "start",
          value: "code",
        },
        {
          text: "Type Machine Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addTypeMachine: false,
      selectedType: null,
      keyword: "",
    };
  },
  computed: {
    ...mapGetters({
      types: "getTypes",
    }),
    filteredTypes() {
      if (this.keyword) {
        return this.types
          .filter((type) => {
            return `${type.code} ${type.name} ${type.description}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((item, index) => ({ ...item, no: index + 1 }));
      }
      return this.types.map((item, index) => ({ ...item, no: index + 1 }));
    },
  },
  mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Type Machine");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Type Machine" }]);
    this.$store.dispatch(FETCH_TYPES);
  },
  methods: {
    editItem(item) {
      this.selectedType = { ...item };
      this.addTypeMachine = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_TYPES, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_TYPES);
        },
      });
    },
    successSave() {
      this.addTypeMachine = false;
      this.$store.dispatch(FETCH_TYPES);
    },
  },
};
</script>
