<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h1 class="text-title">Notification</h1>
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
          :items="mappedNotifes"
          :headers="headers"
        >
          <template v-slot:[`item.notif_type`]="{ item }">
            <span style="color:#e3f6fc;background-color:#F54E60;font-size:12px;border-radius:4.5px;padding:4px;font-wight:bold;margin-right:3px">
              {{item.notif_type}}
            </span> 
          </template>

          <template v-slot:[`item.planned_at`]="{ item }">
            {{ formatDate(item.planned_at) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import { GET_NOTIF } from "@/core/services/store/tpmPlanning.module";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
export default {
  components: {
  },
  data() {
    return {
      headers: [
        {
          text: "Type",
          align: "start",
          value: "notif_type",
        },
        {
          text: "Line",
          align: "start",
          value: "line_name",
        },
        {
          text: "Machine",
          align: "start",
          value: "machine_name",
        },
        { text: "Item Check", value: "item_check_name" },
        { text: "Date", value: "planned_at" },
      ],
      addRole: false,
      selectedCompany: null,
      keyword: "",
      mappedNotifes: [],
    };
  },
  async mounted() {
    await this.$store.dispatch(GET_NOTIF);
    this.$store.dispatch(SET_PAGE_TITLE, "Notification");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Detail Notification" }]);

    const keys = Object.keys(this.notifs).filter(k=>this.notifs[k]);
    const mapping = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.notifs[key].forEach(notif => {
        mapping.push({
          ...notif,
          time_wording: this.getWordingDeadline(key)+" ("+dayjs(notif.planned_at).format('YYYY-MM-DD')+")",
        })
      });
    }
    this.mappedNotifes = mapping;
  },
  computed:{
    ...mapGetters({
      notifs: "getNotif",
      user: "currentUser",
    }),
  },
  methods: {
    editItem(item) {
      this.selectedCompany = { ...item };
      this.addRole = true;
    },
    deleteItem(item) {
      confirm({
        title: "Confirmation",
        message: "Are you sure want to delete User?",
        showConfirmButton: true,
        showCancelButton: true,
        onYes: async () => {
          // const response = await this.$store.dispatch(DELETE_COMPANY, item.id);
          // toastResponse(response);
          // this.$store.dispatch(FETCH_COMPANIES);
        },
      });
    },
    successSave() {
      this.addRole = false;
      this.$store.dispatch(FETCH_COMPANIES);
    },
    getWordingDeadline(type){
      const words = {
        min1:'1 hari lagi',
        min2: '2 hari lagi',
        min3: '3 hari lagi',
        now: 'Hari ini',
        plus1: '1 hari yang lalu',
        plus2: '2 hari yang lalu',
        plus3: '3 hari yang lalu',
      }
      return words[type]
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatDate(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm');
    },
    generateWording(notif,type){
      const { item_check_name,machine_name } = notif
      const wording = this.getWordingDeadline(type)
      return `
        <p style=display:inline-block>
          <span style="color:#e3f6fc;background-color:#F54E60;font-size:12px;border-radius:4.5px;padding:4px;font-wight:bold;margin-right:3px">
            ${notif.notif_type}
          </span> 
          <span style="color:red;font-size:12px">${item_check_name}</span> 
          pada machine 
          <span style="color:white;background-color:#445453;font-size:12px;border-radius:4.5px;padding:2px;margin-right:2px">
            ${machine_name}
          </span>jatuh tempo ${wording}
        </p>`
    }
  },
};
</script>
