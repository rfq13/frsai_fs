import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#3699FF",
        secondary: "#F3F6F9",
        primaryLow: "#E1F0FF",
        accent: "#E1F0FF",
        error: "#fd397a",
        errorLow: "#FFAAB3",
        info: "#2FFCD3",
        success: "#0abb87",
        successLow: "#D0FCE1",
        warning: "#ffb822",
        warningLow: "#F6C669",
      },
    },
  },
});
