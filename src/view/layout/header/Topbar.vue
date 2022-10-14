<template>
  <!-- begin:: Header Topbar -->
  <div class="topbar">
    <!--begin: Search -->
    <v-btn
      v-bind="attrs"
      v-on="on"
      style="background-color: transparent;border: none;"
      depressed
      icon
      @click="openCanvas"
      >
      <notification-bell
        :size="20"
        :count="mappedNotif.length"
        :upperLimit="10"
        counterLocation="upperRight"
        counterStyle="roundRectangle"
        counterBackgroundColor="#FF0000"
        counterTextColor="#FFFFFF"
        iconColor="#77ddd7"
        style="margin-top: 10px; margin-right: 10px;"
        v-bind="attrs"
        v-on="on"
      />
    </v-btn>
    <!--end: Language bar -->
    <!-- <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          depressed
          color="primary"
          @click.stop="openCanvas"
        >
          Primary
        </v-btn>
        <v-btn
          v-bind="attrs"
          v-on="on"
          style="background-color: transparent;border: none;"
          depressed
          icon
          
        >
        </v-btn>
      </template>
      <v-list style="max-height: 25rem;"
       class="overflow-y-auto">
        <v-list-item
          v-for="(key, index) in Object.keys(notifs).filter(k=>notifs[k].length)"
          :key="index"
        >
          <v-list>
            <v-list-item
            v-for="(notif,indux) in notifs[key]" :key="indux">
              <v-list-item-title @click="redirectNotif" v-html="generateWording(notif,key)"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-item>
      </v-list>
    </v-menu> -->
    <!-- <label>
      <button class="btn btn-primary btn-sm" @click.prevent="playSound()"><span class="fa fa-play-circle-o"></span></button>
      Play Elevator Ding
    </label> -->
    <!--begin: User Bar -->
    <KTQuickUser :notifications="mappedNotif"></KTQuickUser>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      bottom
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!--end: User Bar -->
  </div>
  <!-- end:: Header Topbar -->
</template>

<style lang="scss">
.topbar {
  .dropdown-toggle {
    padding: 0;
    &:hover {
      text-decoration: none;
    }

    &.dropdown-toggle-no-caret {
      &:after {
        content: none;
      }
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    outline: none;
    .b-dropdown-text {
      padding: 0;
    }
  }
}
</style>

<script>
import io from "socket.io-client";
import KTQuickUser from "@/view/layout/extras/offcanvas/QuickUser.vue";
import NotificationBell from 'vue-notification-bell'
import { GET_NOTIF } from "@/core/services/store/tpmPlanning.module";
import i18nService from "@/core/services/i18n.service.js";
import { mapGetters } from "vuex";
import { BASE_API_URL } from "../../../../constant";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import dayjs from "dayjs";

export default {
  name: "KTTopbar",
  data() {
    return {
      drawer: false,
      initialNotif:"",
      socket: null,
      languageFlag: "",
      languages: i18nService.languages,
      items: [
        { title: "Item 1" },
        { title: "Item 2" },
        { title: "Item 3" },
        { title: "Item 4" },
      ],
      mappedNotif: {},
    };
  },
  components: {
    KTQuickUser,
    NotificationBell
  },
  created() {
    // this.socket = io(BASE_API_URL);
    // this.socket.on("connect", () => {
    //   console.log("connected");
    // });
    // this.socket.on("disconnect", () => {
    //   console.log("disconnected");
    // });
    // this.socket.on("notification", async (data) => {
    //   console.log("notif", data);
    //   await this.$store.dispatch(GET_NOTIF);
    //   if(JSON.stringify(this.notifs) != this.initialNotif){
    //     await this.playSound();
    //     this.initialNotif = JSON.stringify(this.notifs);
    //   }
    // });

    // setTimeout(() => {
    //   const curruser = localStorage.getItem("user") 
    //   curruser && this.socket.emit("jointoy", JSON.parse(curruser));
    // }, 1500);
  },
  methods: {
    openCanvas() {
      new KTOffcanvas(KTLayoutQuickUser.getElement()).show();
    },
    redirectNotif(){
      this.$router.push({ name: "notification" });
    },
    async playSound (sound="/media/deing.mp3") {

      if(sound) {
        var audio = new Audio(sound);
        await audio.play();
      }
    },
    onLanguageChanged() {
      this.languageFlag = this.languages.find((val) => {
        return val.lang === i18nService.getActiveLanguage();
      }).flag;
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
          </span>jatuh tempo ${wording} (${notif.planned_at})
        </p>`
    },
    mappingNotificationData(){
      const keys = Object.keys(this.notifs).filter(k=>this.notifs[k]);
      const mapping = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this.notifs[key].forEach(notif => {
          mapping.push({
            ...notif,
            // notif_type: this.capitalizeFirstLetter(notif.notif_type),
            time_wording: this.getWordingDeadline(key)+" ("+dayjs(notif.planned_at).format('YYYY-MM-DD')+")",
          })
        });
      }
      this.mappedNotif = mapping;
    }
  },
  computed: {
    ...mapGetters(["breadcrumbs"]),
    ...mapGetters({
      notifs: "getNotif",
      user: "currentUser",
    }),
    getLanguageFlag() {
      return this.onLanguageChanged();
    },
  },
  watch: {
    notifs(val) {
      console.log("valonso",val);
      this.mappingNotificationData();
    },
  },
  async mounted() {
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
    await this.$store.dispatch(GET_NOTIF);
    this.initialNotif = JSON.stringify(this.notifs)

    console.log({user:this.user})
  },
};
</script>
