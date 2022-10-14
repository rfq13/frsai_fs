<template>
  <!-- begin:: Aside -->
  <div
    class="brand flex-column-auto"
    id="kt_brand"
    ref="kt_brand"
    style="
      height: 75px;
      box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.1) !important;
      z-index: 20;
    "
  >
    <div class="brand-logo">
      <router-link to="/">
        <!-- <img :src="siteLogo()" alt="Logo" style="max-width: 90%" /> -->
        <span
          class="headTitle"
          style="
            font-weight: 700;
            font-size: 18px;
            line-height: 22px;
            color: #1c3833;
          "
          >TPM System</span
        >
        <p class="mb-0 black--text text-caption">
          {{ profile.plant ? profile.plant.name : "" }}
        </p>
      </router-link>
    </div>
    <div class="brand-tools" v-if="allowMinimize">
      <button
        class="brand-toggle btn btn-sm px-0"
        id="kt_aside_toggle"
        ref="kt_aside_toggle"
      >
        <span class="svg-icon svg-icon svg-icon-xl">
          <inline-svg
            class="svg-icon"
            src="media/svg/icons/Navigation/Angle-double-left.svg"
          />
        </span>
      </button>
    </div>
  </div>
  <!-- end:: Aside -->
</template>

<style lang="scss" scoped>
.aside-toggle {
  outline: none;
}
</style>

<script>
import { mapGetters } from "vuex";
import objectPath from "object-path";
import KTLayoutBrand from "@/assets/js/layout/base/brand.js";
import KTLayoutAsideToggle from "@/assets/js/layout/base/aside-toggle.js";

export default {
  name: "KTBrand",
  mounted() {
    // Init Brand Panel For Logo
    KTLayoutBrand.init(this.$refs["kt_brand"]);

    // Init Aside Menu Toggle
    KTLayoutAsideToggle.init(this.$refs["kt_aside_toggle"]);
  },
  methods: {
    siteLogo() {
      const menuAsideLeftSkin = this.layoutConfig("brand.self.theme");
      // set brand logo
      const logoObject = this.layoutConfig("self.logo");

      let logo;
      if (typeof logoObject === "string") {
        logo = logoObject;
      }
      if (typeof logoObject === "object") {
        logo = objectPath.get(logoObject, menuAsideLeftSkin + "");
      }
      if (typeof logo === "undefined") {
        const logos = this.layoutConfig("self.logo");
        logo = logos[Object.keys(logos)[0]];
      }
      return process.env.BASE_URL + logo;
    },
  },
  computed: {
    ...mapGetters({
      layoutConfig: "layoutConfig",
      profile: "getProfile",
    }),

    allowMinimize() {
      return !!this.layoutConfig("aside.self.minimize.toggle");
    },
  },
};
</script>
