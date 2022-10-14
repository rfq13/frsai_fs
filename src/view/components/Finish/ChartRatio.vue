<template>
  <v-card class="shadow">
    <v-card-title>
      <a
        v-if="!$route.query.shop"
        :href="`#/dashboard/?shop=${achievement.shop_id}`"
      >
        <p class="mb-0">Shop: {{ achievement.name }}</p>
      </a>
      <p v-else class="mb-0">LINE: {{ achievement.name }}</p>
      <p class="ml-auto mb-0">Target 100%</p>
    </v-card-title>
    <v-card-text>
      <apexchart
        class="card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        type="line"
        height="300px"
        width="100%"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    achievement: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        yaxis: {
          min: 0,
        },
        xaxis: {
          categories: [
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ags",
            "Sep",
            "Okt",
            "Nov",
            "Des",
            "Jan",
            "Feb",
            "Mar",
          ],
        },
        stroke: {
          width: [2, 2, 2, 2],
          dashArray: [0, 0, 5],
        },
      },
      series: [],
    };
  },

  async mounted() {
    console.log(this.achievement);
    const plan = this.achievement.data.filter(
      (aData) => aData.category == "plan"
    )[0];
    const seriesPlanKey = Object.keys(plan);
    const seriesPlan = [];
    seriesPlanKey.map((key) => {
      if (key != "category") {
        seriesPlan.push(parseInt(plan[key]).toFixed(2));
      }
    });

    const act = this.achievement.data.filter(
      (aData) => aData.category == "actual"
    )[0];
    const seriesActKey = Object.keys(act);
    const seriesAct = [];
    seriesActKey.map((key) => {
      if (key != "category") {
        seriesAct.push(parseInt(act[key]).toFixed(2));
      }
    });

    const planColumn = {
      name: "Plan",
      type: "column",
      data: seriesPlan,
    };
    const actColumn = {
      name: "Actual",
      type: "column",
      data: seriesAct,
    };
    let ratios = [];
    seriesPlan.map((p, i) => {
      let res = 0;
      if (seriesAct[i] > 0) {
        res = p / seriesAct[i];
      }

      ratios.push(res.toFixed(1));
    });
    const ratio = {
      name: "Ratio",
      type: "line",
      data: ratios,
    };
    this.series = [planColumn, actColumn, ratio];
  },
};
</script>
