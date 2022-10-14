<template>
  <v-card>
    <v-card-title>
      TPM History Judgement
      <div class="ml-auto">
        <export-excel
            class   = "mr-4 text-primary v-btn v-btn--has-bg theme--light v-size--default"
            style="height: 34px; background-color: rgb(225, 240, 255); border-color: rgb(225, 240, 255);"
            :data   = "histories"
            :fields = "json_fields"
            worksheet = "My Worksheet"
            :name    = "`Export-TPMHistoryJudgement-${new Date().toISOString().substr(0, 10)}.xls`">
        
            <v-icon color="#3699FF" class="mr-2" small
            >mdi-inbox-arrow-down</v-icon
          >
          Export
        
        </export-excel>

      </div>
    </v-card-title>
    <v-card-text>
      <div class="my-6">
        <v-row>
          <v-col md="2"></v-col>
          <v-col md="2">
            <v-select
              outlined
              dense
              hide-details
              placeholder="Month"
              item-text="text"
              item-value="value"
              :items="months"
              v-model="filter.month"
            ></v-select>
          </v-col>
          <v-col md="2">
            <v-select outlined dense hide-details placeholder="Year" :items="Array.from(
                { length: 20 },
                (v, k) => new Date().getFullYear() - k
              )"
              v-model="filter.year">
            </v-select>
          </v-col>
          <v-col md="2">
            <v-select
                label="Line"
                v-model="filter.line_id"
                outlined
                dense
                item-text="name"
                item-value="id"
                :items="filter.lines"
              ></v-select>
          </v-col>
          <v-col md="2">
            <v-select 
                outlined 
                dense 
                hide-details 
                placeholder="Item" 
                item-text="name"
                item-value="id"
                :items="machines" 
                v-model="filter.machine_id">
            </v-select>
          </v-col>
          <v-col md="2">
            <v-text-field
              outlined
              dense
              hide-details
              append-icon="mdi-magnify"
              placeholder="Search"
              v-model="filter.search"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <v-data-table :headers="headers" :items="histories" :search="filter.search">
        <template v-slot:[`item.msr`]="{ item }">
          {{ item.item_check.lower_limit }},
          {{ item.item_check.upper_limit }}
        </template>
        <template v-slot:[`item.planned_at`]="{ item }">
          {{ formatDate(item.planned_at) }}
        </template>
        <!-- <template v-slot:[`item.actual_msr`]="{ item }">
          {{ item.item_check.flg_measurement == 0 ? item.value_quantitative: item.value_qualitative }}
        </template> -->
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import {
  SET_BREADCRUMB,
  SET_PAGE_TITLE,
} from "@/core/services/store/breadcrumbs.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { FETCH_TPMEXEC } from "@/core/services/store/tpmPlanning.module";
import {
  FETCH_MACHINES
} from "@/core/services/store/machine.module";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      json_fields: {
        'No': 'machine.code',
        'Machine': 'machine.name',
        'Item Check': 'item_check.item_check_name',
        'Check Date': {
          field: 'planned_at',
          callback: (value) => {
            return this.formatDate(value)
          }
        },
        'Std Measurement': {
          field: 'item.item_check',
          callback: (value) => {
              return value.lower_limit + ', ' + value.upper_limit
          }
        },
        'Actual Measurement': 'actual_msr',
        'PIC': 'pic',
      },
      headers: [
        {
          text: "No",
          align: "start",
          value: "machine.code",
        },
        {
          text: "Machine",
          align: "start",
          value: "machine.name",
        },
        { text: "Item Check", value: "item_check.item_check_name" },
        { text: "Check Date", value: "planned_at" },
        { text: "Std Measurement", value: "msr" },
        { text: "Actual Measurement", value: "actual_msr" },
        { text: "PIC", value: "pic" },
      ],
      months:[
        {
          text: 'January',
          value: '01'
        }, {
          text: 'February',
          value: '02'
        }, {
          text: 'March',
          value: '03'
        }, {
          text: 'April',
          value: '04'
        }, {
          text: 'May',
          value: '05'
        }, {
          text: 'June',
          value: '06'
        }, {
          text: 'July',
          value: '07'
        }, {
          text: 'August',
          value: '08'
        }, {
          text: 'September',
          value: '09'
        }, {
          text: 'October',
          value: '10'
        }, {
          text: 'November',
          value: '11'
        }, {
          text: 'December',
          value: '12'
        }
      ],
      filter:{
        month:'09',
        year:2022,
        line_id:20003,
        machine_id:10002,
        search:''
      }
    };
  },
  computed: {
    ...mapGetters({
      lines: "getLines",
      machines: "getMachines",
      histories: 'getTPMEXEC'
    }),
  },
  watch:{
    ['filter.month'](val){
      this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    },
    ['filter.year'](val){
      this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    },
    ['filter.line_id'](val){
      this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    },
    ['filter.machine_id'](val){
      this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    },
    // ['filter.search'](val){
    //   this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    // },
  },
  mounted() {
    this.$store.dispatch(FETCH_TPMEXEC,this.filter);
    this.$store.dispatch(FETCH_MACHINES);
    this.$store.dispatch(FETCH_LINES);
    this.$store.dispatch(SET_PAGE_TITLE, "TPM History Judgement");
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "TPM History Judgement List" },
    ]);
  },
  methods:{
    formatDate(date){
      return new Date(date).toLocaleDateString('id-ID');
    }
  }
};
</script>
