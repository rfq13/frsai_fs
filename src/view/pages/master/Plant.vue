<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Plant</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="plantsWithNumber"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Plant-${new Date()
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
              depressed
              class="text-capitalize font-weight-medium"
              height="34"
              @click="
                () => {
                  selectedPlant = null;
                  addPlant = true;
                  editPlant = false;
                }
              "
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
          :items="filteredPlants"
          :headers="headers"
          :loading="loading"
          loader-height="Loading..."
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addPlant" width="650">
      <v-card>
        <v-card-title>
          {{ editPlant ? "Edit" : "Create" }} Plant
          <v-icon class="ml-auto" @click="addPlant = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <plant-form
            :selectedPlant="selectedPlant"
            @close="addPlant = false"
            @success="successSave"
          ></plant-form>
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
import PlantForm from "@/view/components/Plant/PlantForm.vue";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import { FETCH_PLANTS, DELETE_PLANT } from "@/core/services/store/plant.module";
import { mapGetters } from "vuex";
export default {
  components: {
    PlantForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        Code: "code",
        "Plant Name": "name",
        Address: "address",
        Phone: "phone",
        Company: "company.name",
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
      keyword: "",
      headers: [
        { text: "No", value: "no" },
        {
          text: "Plant Code",
          align: "start",
          value: "code",
        },
        {
          text: "Plant Name",
          align: "start",
          value: "name",
        },
        { text: "Address", value: "address" },
        { text: "Phone", value: "phone" },
        { text: "Company", value: "company.name" },
        { text: "Action", value: "actions" },
      ],
      addPlant: false,
      editPlant: false,
      selectedPlant: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      plants: "getPlants",
    }),
    filteredPlants() {
      if (this.keyword) {
        return this.plants.filter((plant) => {
          return `${plant.code} ${plant.name} ${plant.company?.name}`
            .toLowerCase()
            .includes(this.keyword.toLowerCase());
        });
      }
      return this.plants;
    },
    plantsWithNumber() {
      return this.plants.map((plant, index) => ({ ...plant, no: index + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Plant");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Plant" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_PLANTS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedPlant = { ...item };
      this.addPlant = true;
      this.editPlant = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_PLANT, item.id);
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_PLANTS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addPlant = false;
      this.editPlant = false;
      this.selectedPlant = {};
      this.loading = true;
      await this.$store.dispatch(FETCH_PLANTS);
      this.loading = false;
    },
  },
};
</script>
