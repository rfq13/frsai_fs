<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Cell</h1>
          <div class="ml-auto">
            <!-- <v-btn
              color="#e1f0ff"
              class="mr-4 text-primary"
              depressed
              height="34"
              ><v-icon color="#3699FF" class="mr-2" small
                >mdi-inbox-arrow-down</v-icon
              >
              Export</v-btn
            > -->
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="cells"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Cell-${new Date()
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
                  selectedCell = null;
                  addCell = true;
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
          :items="filteredCells"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.pic`]="{ item }">
            {{ item.pic.map((pic) => pic.user.full_name).join(", ") }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                  <v-icon size="32">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item style="width: 122px" @click="editItem(item)"
                  >Edit</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item
                  style="width: 122px"
                  class="error--text"
                  @click="deleteItem(item)"
                  >Delete</v-list-item
                >
                <v-divider class="my-0 py-0"></v-divider>
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item style="width: 122px" @click="assignPIC(item)"
                  >Assign PIC</v-list-item
                >
              </v-list>
            </v-menu>
          </template>
          <template v-slot:[`item.line`]="{ item }">
            {{ item.line ? item.line.name : "-" }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isAssignPic" width="650">
      <v-card>
        <v-card-title>
          Assign PIC
          <v-icon class="ml-auto" @click="isAssignPic = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="picForm" @submit.prevent="doSubmitPic">
            <div>
              <b-form-group label="Tipe PIC" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  id="radio-slots"
                  v-model="pic_form.type"
                  :options="options"
                  :aria-describedby="ariaDescribedby"
                  name="radio-options-slots"
                >
                  <b-form-radio value="vendor">Vendor</b-form-radio>
                  <b-form-radio value="Production">Production</b-form-radio>
                  <b-form-radio value="Maintenance">Maintenance</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
              <v-autocomplete
                v-model="pic_form.users"
                outlined
                dense
                :items="users"
                item-value="id"
                item-text="full_name"
                @change="getUser"
                multiple
                selected
              ></v-autocomplete>
            </div>
            <div>
              <v-divider></v-divider>
            </div>
            <div class="d-flex" style="width: 100%; justify-content: end">
              <v-btn
                type="submit"
                class="mr-4 title text-capitalize"
                depressed
                color="primary"
                height="48"
                width="125"
                :loading="loadingPic"
                >Save</v-btn
              >
              <v-btn
                depressed
                height="48"
                width="125"
                class="text-primary title text-capitalize"
                color="#E1F0FF"
                @click="isAssignPic = false"
                >Cancel</v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addCell" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedCell ? "Edit" : "Create" }} Cell
          <v-icon class="ml-auto" @click="addCell = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <cell-form
            :selectedCell="selectedCell"
            @close="addCell = false"
            @success="successSave"
          ></cell-form>
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
import CellForm from "@/view/components/Cell/CellForm.vue";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import {
  DELETE_CELL,
  FETCH_CELLS,
  SUBMIT_CELL_PIC,
} from "@/core/services/store/cell.module";
import { FETCH_USERS } from "@/core/services/store/user.module";
import { mapGetters } from "vuex";
export default {
  components: {
    CellForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Cell Code": "code",
        "Cell Name": "name",
        Description: "description",
        Line: "line.name",
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
      headers: [
        { text: "No", value: "no" },
        {
          text: "Cell Code",
          align: "start",
          value: "code",
        },
        {
          text: "Cell Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "PIC", value: "pic" },
        { text: "Line", value: "line" },
        { text: "Action", value: "actions" },
      ],
      addCell: false,
      selectedCell: null,
      keyword: "",
      isAssignPic: false,
      pic_form: {
        type: null,
        users: null,
      },
      loadingPic: false,
    };
  },
  computed: {
    ...mapGetters({
      cells: "getCells",
      users: "getUsers",
    }),
    filteredCells() {
      if (this.keyword) {
        return this.cells
          .filter((cell) => {
            return `${cell.code} ${cell.name} ${cell.description}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((cell, index) => ({ ...cell, no: index + 1 }));
      }
      return this.cells.map((cell, index) => ({ ...cell, no: index + 1 }));
    },
  },
  watch: {
    isAssignPic(val) {
      if (!val) {
        this.pic_form = {
          users: null,
          type: null,
        };
      }
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Cell");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Cell" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_CELLS);
    this.loading = false;
    this.$store.dispatch(FETCH_USERS);
    // console.log(this.cells);
  },
  methods: {
    editItem(item) {
      this.selectedCell = { ...item };
      this.addCell = true;
    },
    assignPIC(item) {
      this.selectedCell = { ...item };
      this.isAssignPic = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_CELL, item.id);
          toastResponse(response);
          this.$store.dispatch(FETCH_CELLS);
        },
      });
    },
    async successSave() {
      this.addCell = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_CELLS);
      this.loading = false;
    },
    async doSubmitPic() {
      this.loadingPic = true;
      const response = await this.$store.dispatch(SUBMIT_CELL_PIC, {
        ...this.pic_form,
        id: this.selectedCell.id,
      });
      toastResponse(response);
      if (response.success) {
        this.loading = true;
        await this.$store.dispatch(FETCH_CELLS);
        this.loading = false;
        this.isAssignPic = false;
      }
      this.loadingPic = false;
    },
  },
};
</script>
