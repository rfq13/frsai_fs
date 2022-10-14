<template>
  <section>
    <v-card class="rounded-lg">
      <v-card-text class="py-8 px-6" style="color: #3f4254">
        <div class="d-flex align-center">
          <h3 class="text-title">Notification Setting</h3>
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

        <template>
          <v-data-table
            :headers="headers"
            :items="users"
            class="elevation-1"
            :search="keyword"
          >
            <template v-slot:[`item.full_name`]="{ item }">
              {{ item.full_name }} <br>
              <span class="text-caption">{{ item.email }}</span>
            </template>
            <template v-slot:[`item.planning`]="{ item }">
              <v-container
                class="px-0"
                fluid
              >
                <v-switch
                  v-model="mappedSettingNotif[item.id].planning"
                ></v-switch>
              </v-container>
            </template>
            <template v-slot:[`item.finding`]="{ item }">
              <v-container
                class="px-0"
                fluid
              >
                <v-switch
                  v-model="mappedSettingNotif[item.id].finding"
                ></v-switch>
              </v-container>
            </template>
            <template v-slot:[`item.exec`]="{ item }">
              <v-container
                class="px-0"
                fluid
              >
                <v-switch
                  v-model="mappedSettingNotif[item.id].exec"
                ></v-switch>
              </v-container>
            </template>
          </v-data-table>
        </template>
        <div class="d-flex align-center">
          <div class="ml-auto">
          <v-btn
            color="primary"
            @click="submitSetting"
            depressed
            class="text-capitalize font-weight-medium mt-3 float-right"
            height="34"
          >
            <v-icon small class="mr-2">mdi-save</v-icon> Save
          </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import { FETCH_USERS, SUBMIT_NOTIF } from "@/core/services/store/user.module";
import {mapGetters} from "vuex";
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";

export default {
  data() {
    return {
      keyword: "",
      headers: [
        {
          text: "Name",
          value: "full_name",
        },
        {
          text: "Planning",
          value: "planning",
        },
        {
          text: "Finding",
          value: "finding",
        },
        {
          text: "Execution",
          value: "exec",
        },
      ],
      mappedSettingNotif: {},
    }
  },
  methods: {
    async submitSetting() {
      const mappings = Object.keys(this.mappedSettingNotif).map((key) => {
        return {
          user_id: key,
          ...this.mappedSettingNotif[key],
        }
      })
      await this.$store.dispatch(SUBMIT_NOTIF, mappings)
      window.location.reload()
    }
  },
  computed: {
    ...mapGetters({
      users: "getAllUser",
    }),
  },
  watch: {
    users(val) {
      const mapping = {...this.mappedSettingNotif};
      for (let i = 0; i < val.length; i++) {
        mapping[val[i].id] = {
          planning:val[i].notif_planning == 1,
          exec:val[i].notif_exec == 1,
          finding:val[i].notif_finding == 1,
        }
      }

      this.mappedSettingNotif = mapping;
    }
  },
  async mounted() {
    this.$store.dispatch(SET_PAGE_TITLE, "Setting");
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Settings Page" }]);
    await this.$store.dispatch(FETCH_USERS);
  },
}
</script>
