<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Master Shop</h1>
          <div class="ml-auto">
            <export-excel
              class="mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
              style="
                height: 34px;
                background-color: rgb(225, 240, 255);
                border-color: rgb(225, 240, 255);
              "
              :data="shops"
              :fields="json_fields"
              worksheet="My Worksheet"
              :name="`Export-Shop-${new Date()
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
                  addShop = true;
                  selectedShop = null;
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
          :items="filteredShops"
          :headers="headers"
          :loading="loading"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addShop" width="650">
      <v-card>
        <v-card-title>
          {{ !selectedShop ? "Create" : "Edit" }} Shop
          <v-icon class="ml-auto" @click="addShop = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <Shop-form
            :selectedShop="selectedShop"
            @success="successSave"
            @close="addShop = false"
          ></Shop-form>
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
import ShopForm from "@/view/components/Shop/ShopForm.vue";
import { DELETE_SHOP, FETCH_SHOPS } from "@/core/services/store/shop.module";
import { mapGetters } from "vuex";
import { toastResponse, confirm } from "@/core/plugins/dialogUtil";
export default {
  components: {
    ShopForm,
  },
  data() {
    return {
      json_fields: {
        No: "no",
        "Shop Code": "code",
        "Shop Name": "name",
        Description: "description",
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
          text: "Shop Code",
          align: "start",
          value: "code",
        },
        {
          text: "Shop Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Action", value: "actions" },
      ],
      addShop: false,
      selectedShop: null,
      keyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      shops: "getShops",
    }),
    filteredShops() {
      if (this.keyword) {
        return this.shops
          .filter((shop) => {
            return `${shop.code} ${shop.name} ${shop.description}`
              .toLowerCase()
              .includes(this.keyword.toLowerCase());
          })
          .map((sh, index) => ({ ...sh, no: index + 1 }));
      }
      return this.shops.map((sh, index) => ({ ...sh, no: index + 1 }));
    },
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Shop");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Master Shop" }]);
    this.loading = true;
    await this.$store.dispatch(FETCH_SHOPS);
    this.loading = false;
  },
  methods: {
    editItem(item) {
      this.selectedShop = { ...item };
      this.addShop = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: `Are you sure want to delete ${item.name}?`,
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          const response = await this.$store.dispatch(DELETE_SHOP, item.id);
          toastResponse(response);
          this.loading = true;
          await this.$store.dispatch(FETCH_SHOPS);
          this.loading = false;
        },
      });
    },
    async successSave() {
      this.addShop = false;
      this.loading = true;
      await this.$store.dispatch(FETCH_SHOPS);
      this.loading = false;
    },
  },
};
</script>
