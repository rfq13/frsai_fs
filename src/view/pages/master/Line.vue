<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Line</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="lines"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Line-${new Date()
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
                  selectedLine = null;
                  addLine = true;
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
          :items="filteredLines"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.shop`]="{ item }">
            {{ item.shop ? item.shop.name : "-" }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addLine" width="650">
      <v-card>
        <v-card-title>
          {{ !!selectedLine ? "Edit" : "Create" }} Line
          <v-icon class="ml-auto" @click="addLine = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <Line-form
            :selectedLine="selectedLine"
            @close="addLine = false"
            @success="successSave"
          ></Line-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import LineForm from "@/view/components/Line/LineForm.vue";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
import { DELETE_LINE, FETCH_LINES } from "@/core/services/store/line.module";
export default {
  components: {
    LineForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        Code: "code",
        "Line Name": "name",
        Description: "description",
        Shop: "shop.name",
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
      headers: [
        { text: "No", value: "no" },
        { text: "Code", value: "code" },
        {
          text: "Line Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Shop", value: "shop" },
        { text: "Action", value: "actions" },
      ],
      addLine: false,
      selectedLine: null,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      lines: "getLines",
    }),
    filteredLines() {
      if (this.keyword) {
        return this.lines
          .filter((line) => {
            return `${line.code} ${line.name} ${line.description} ${line.shop.name}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((li, i) => ({ ...li, no: i + 1 }));
      }
      return this.lines.map((li, i) => ({ ...li, no: i + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Line");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Line" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_LINES);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedLine = { ...item };
      this.addLine = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_LINE, item.id);
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_LINES);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addLine = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_LINES);
      this.loading = false;
    },
  },
};
</script>
