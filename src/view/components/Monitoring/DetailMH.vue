<template>
  <v-card>
    <v-card-title> TPM MH </v-card-title>
    <v-card-text>
      <div class="d-flex justify-end">
        <v-select
          outlined
          hide-details
          dense
          placeholder="LINE"
          class="mr-2"
          style="max-width: 120px"
          v-model="line_id"
          :items="lines"
          item-text="name"
          item-value="id"
        ></v-select>
        <v-select
          outlined
          hide-details
          dense
          placeholder="Period"
          style="max-width: 120px"
          v-model="period"
          item-text="name"
          item-value="id"
          :items="periods"
        ></v-select>
      </div>
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
import { mapGetters } from "vuex";
import { FETCH_MANHOUR } from "@/core/services/store/tpmPlanning.module";
import { FETCH_LINES } from "@/core/services/store/line.module";

export default {
  data() {
    return {

      periods: [],
      line_id:'20003',
      period:(new Date).getFullYear(),
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
      },
      series: [
        {
          name: "MH",
          data: [5, 20, 23, 21, 25, 24, 22, 20, 20, 29, 27, 27],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      manhour: "getTPMMH",
      lines: "getLines",
    }),
  },
  mounted() {
    if(this.periods.length == 0){
      this.periods = this.getPeriods();
    }
    

    this.$store.dispatch(FETCH_MANHOUR,{period:this.period,line:this.line_id});
    this.$store.dispatch(FETCH_LINES);
  },
  watch: {
    line_id(val) {
      this.$store.dispatch(FETCH_MANHOUR,{period:this.period,line:val});
    },
    period(val) {
      this.$store.dispatch(FETCH_MANHOUR,{period:val,line:this.line_id});
    },
    manhour(val) {
      this.updateMH(val);
    },
  },
  methods: {
    updateMH(v=null){
      const val = v || this.manhour;

      const months = Object.keys(val).sort();
      
      this.series = [
        {
          name: "MH",
          data: months.map(m=>val[m]),
        },
      ];
    },
    getPeriods(){
      const periods = [];
      const year = (new Date).getFullYear();
      for(let i=year-10;i<=year;i++){
        periods.push({id:i,name:i});
      }
      return periods.reverse();
    }
  },
};
</script>
