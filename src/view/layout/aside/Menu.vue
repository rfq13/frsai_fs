<template>
  <v-list class="menus">
    <base-loading v-if="loading"></base-loading>
    <template v-for="(menu, key) in menus">
      <v-list-item
        v-if="menu.type == 'menu' && menu.children.length == 0"
        :key="key"
        :to="menu.link"
        class="mb-3"
        exact
        active-class="primary--text"
      >
        <v-icon
          class="mr-4"
          :class="menu.icon.includes('pie') ? 'mdi-rotate-225' : ''"
          size="18"
          >{{ menu.icon }}</v-icon
        >
        {{ menu.name }}
      </v-list-item>
      <v-list-item v-if="menu.type == 'divider'" :key="key"
        ><p class="divid">{{ menu.name }}</p></v-list-item
      >

      <v-expansion-panels
        v-if="menu.type == 'menu' && menu.children.length > 0"
        :key="key"
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header class="pl-1 pr-4 py-0">
            <v-list-item
              ><v-icon size="18" class="mr-4">{{ menu.icon }}</v-icon>
              {{ menu.name }}
            </v-list-item>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-0">
            <v-list class="py-0 my-0">
              <v-list-item
                v-for="(child, key) in menu.children"
                :key="key"
                :to="child.link"
                ><v-icon size="18" class="mr-4">{{ child.icon }}</v-icon>
                {{ child.name }}
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <v-list-item class="mb-3" active-class="primary--text" @click="doLogout">
      <v-icon class="mr-4" size="18">mdi-power</v-icon>
      Logout
    </v-list-item>
  </v-list>
</template>

<script>
import menus from "@/../public/menu/menu.json";
import { confirm } from "@/core/plugins/dialogUtil";
import { removeToken } from "@/core/services/auth.service.js";
import { PROFILE } from "@/core/services/store/auth.module";
import { mapGetters } from "vuex";
import BaseLoading from "@/view/components/base/BaseLoading.vue";
export default {
  components: {
    BaseLoading,
  },
  name: "KTMenu",
  data() {
    return {
      menus: menus,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "getProfile",
    }),
  },
  async mounted() {
    // this.loading = true;
    // await this.$store.dispatch(PROFILE);
    // this.loading = false;
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
    doLogout() {
      confirm({
        title: "Are you sure?",
        showCancelButton: true,
        onYes: () => {
          removeToken();
          this.$router.push("/login");
        },
      });
    },
  },
};
</script>
<style scoped>
.divid {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height */

  color: #1c3238;
}
</style>
