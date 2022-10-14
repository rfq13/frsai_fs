<template>
  <v-card>
    <v-card-title>
      <div>
        <p class="mb-0 title">History Value</p>
        <p class="mb-0 grey--text text-caption"></p>
      </div>
      <v-icon @click="$emit('close')" class="ml-auto">mdi-close</v-icon>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <apexchart
        class="card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        type="line"
        width="100%"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>
<script>
import { GET_JIS_BY_PLANNING } from "@/core/services/store/jis.module";
import { GET_TPMEXEC_HISTORY } from "@/core/services/store/tpmPlanning.module";
import { mapGetters } from 'vuex';
export default {
  props:{
    itemcheck: {
      type: String,
      default: "",
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mapped:{},
      chartOptions: {
        yaxis: {
          min: 0,
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ags",
            "Sep",
            "Okt",
            "Nov",
            "Des",
          ],
        },
        stroke: {
          width: [2, 2, 2, 2],
          dashArray: [0, 5, 0, 5, 0],
        },
      },
      series: [
        {
          name: "Lower Limit",
          // data: [2.2, 2, 2.3, 2.1, 2.5, 2.4, 2.2, 2, 2, 2.9, 2.7, 2.7],
          data: [],
        },
        {
          name: "W Lower Limit",
          // data: [2.1, 1.9, 2.2, 2, 2.4, 2.3, 2.1, 1.9, 1.9, 2.8, 2.6, 2.6],
          data: [],
        },
        {
          name: "Value",
          // data: [2, 1.8, 2.1, 1.9, 2.3, 2.2, 2, 1.8, 1.8, 2.7, 2.5, 2.4],
          data: [],
        },
        {
          name: "Upper Limit",
          // data: [1.8, 1.6, 1.9, 1.7, 2.1, 2, 1.8, 1.6, 1.6, 2.5, 2.3, 2.2],
          data: [],
        },
        {
          name: "W Upper Limit",
          // data: [1.4, 1.2, 1.5, 1.3, 1.8, 1.6, 1.4, 1.2, 1.2, 2.1, 1.9, 1.8],
          data: [],
        },
      ],
    };
  },
  computed:{
    ...mapGetters({
      jisbp: "getJisBp",
      exechistory:"getTPMEXECHistory"
    }),
  },
  watch:{
    exechistory(v){
      console.log(v);
      this.series = [
        {
          name: "Upper",
          data: v.upper_limit,
        },
        {
          name: "Warning Upper",
          data: v.warning_upper_limit,
        },
        {
          name: "Value",
          data: v.value,
        },
        {
          name: "Warning Lower",
          data: v.warning_lower_limit,
        },
        {
          name: "Lower",
          data: v.lower_limit,
        },
      ]
    },
    series(v){
      console.log("series",v);
    },
    dialog(v){
      if(v){
        this.$store.dispatch(GET_TPMEXEC_HISTORY, this.itemcheck);
      }
    }
  },
  mounted(){
    // console.log(this.splitCamelCase("lowerLimit"));
    this.$store.dispatch(GET_JIS_BY_PLANNING,this.$route.params.id);
    this.$store.dispatch(GET_TPMEXEC_HISTORY,this.itemcheck);

    // 
  },
  methods: {
    capitalizeFirstLetter(string) {
      // capitalize first letter on every word
      return string
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    },
    splitCamelCase(string) {
      return string.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    },
  },

}
</script>
