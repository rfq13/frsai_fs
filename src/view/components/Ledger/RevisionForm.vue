<template>
  <v-form ref="form" lazy-validation @submit.prevent="doSubmit">
    <!-- row -->
    <v-row>
      <v-col cols="3">
        <p class="mb-0 font-weight-bold body-1">In Charge <span style="color:red">*</span></p>
        <v-radio-group
          v-model="form.in_charge"
          row
          dense
          :disabled="!['maintenance',null,''].includes(initIncharge) || !['edit','add','in_charge'].includes(form.trans_type)"
          >
          <v-radio
            label="PRD"
            value="production"
          ></v-radio>
          <v-radio
            label="MTE"
            value="maintenance"
          ></v-radio>
          <v-radio
            label="Vendor"
            value="vendor"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="5" class="mb-0 pb-0">
        <p class="mb-0 font-weight-bold body-1">Item Check <span style="color:red">*</span></p>
        <v-text-field
          v-model="form.item_check_name"
          outlined
          dense
          :disabled="form.item_check_id != null" 
          :rules="[(v) => !!v || 'This field is required']">
        </v-text-field>
      </v-col>
      <v-col cols="4" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">Location <span style="color:red">*</span></p>
        <v-text-field
          v-model="form.location" 
          outlined
          dense
          :disabled="form.item_check_id != null" 
          :rules="[(v) => !!v || 'This field is required']">
        </v-text-field>
      </v-col>
    </v-row>
    <!-- row -->
    <v-row>
      
      <v-col cols="3" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">Part Number / Item Number <span style="color:red">*</span></p>
        <v-autocomplete
          v-model="form.spare_part_id"
          :items="spareparts"
          :rules="[(v) => !!v || 'This field is required']"
          item-value="id"
          item-text="spare_part_name"
          outlined
          dense
          :disabled="form.item_check_id != null"
          hide-details="auto"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col cols="2" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">Qty <span style="color:red">*</span></p>
        <v-text-field
          type="number"
          v-model="form.qty_part" 
          outlined
          dense
          :disabled="form.item_check_id != null" 
          :rules="[(v) => !!v || 'This field is required']">
        </v-text-field>
      </v-col>
      <v-col cols="3" class="mb-0 pb-0">
        <p class="mb-0 mb-1 font-weight-bold body-1">Method <span class="error--text">*</span></p>
        <v-autocomplete
          v-model="form.ledger_method_id"
          :items="ledgerMethods"
          :rules="[(v) => !!v || 'This field is required']"
          item-text="name"
          item-value="id"
          outlined
          dense
          hide-details="auto"
          :disabled="!['edit','method','add'].includes(form.trans_type)"
        ></v-autocomplete>
      </v-col>
      <v-col cols="2" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">Duration <span style="color:red">*</span></p>
        <v-text-field
          type="number"
          v-model="form.duration"
          outlined
          dense 
          :disabled="form.item_check_id != null"
          :rules="[(v) => !!v || 'This field is required']">
        </v-text-field>
      </v-col>
      <v-col cols="2" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">MP <span style="color:red">*</span></p>
        <v-text-field
          type="number"
          v-model="form.mp" 
          outlined
          dense 
          :disabled="form.item_check_id != null"
          :rules="[(v) => !!v || 'This field is required']">
        </v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- row -->
    <v-row>
      <v-col cols="4" class="mb-0 pb-0">
        <p class="mb-1 font-weight-bold body-1">Standard Measurement <span style="color:red">*</span></p>
        <v-select
            v-model="form.flg_std_measurement"
            :items="[{
              text: 'Judgement',
              value: 1
            }, {
              text: 'Range / Limit',
              value: 0
            }]"
            outlined
            dense
            hide-details="auto"
            item-text="text"
            item-value="value"
            :rules="[(v) => form.trans_type == 'add' ? (v === 0 || !!v || 'This field is required') : true]"
            :disabled="form.item_check_id != null"
          ></v-select>
      </v-col>
      <v-col cols="2" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 1">
          <p class="mb-1 font-weight-bold body-1">Lower Limit <span style="color:red">*</span></p>
          <v-text-field
            type="number"
            step="0.01"
            v-model="form.lower_limit" 
            outlined
            dense
            :disabled="form.item_check_id != null" 
            :rules="[(v) => form.flg_std_measurement !== 1 ? !!v || 'This field is required' : true]">
          </v-text-field>
        </v-col>
  
        <v-col cols="2" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 1">
          <p class="mb-1 font-weight-bold body-1">Warning Lower Limit <span style="color:red">*</span></p>
          <v-text-field
            type="number"
            step="0.01"
            v-model="form.warning_lower_limit" 
            outlined
            dense
            :disabled="form.item_check_id != null" 
            :rules="[(v) => form.flg_std_measurement !== 1 ? !!v || 'This field is required' : true]">
          </v-text-field>
        </v-col>
  
        <v-col cols="2" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 1">
          <p class="mb-1 font-weight-bold body-1">Warning Upper Limit <span style="color:red">*</span></p>
          <v-text-field
            type="number"
            step="0.01"
            v-model="form.warning_upper_limit" 
            outlined
            dense
            :disabled="form.item_check_id != null" 
            :rules="[(v) => form.flg_std_measurement !== 1 ? !!v || 'This field is required' : true]">
          </v-text-field>
        </v-col>
        
        <v-col cols="2" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 1">
          <p class="mb-1 font-weight-bold body-1">Upper Limit <span style="color:red">*</span></p>
          <v-text-field
            type="number"
            step="0.01"
            v-model="form.upper_limit"
            outlined
            dense
            :disabled="form.item_check_id != null" 
            :rules="[(v) => form.flg_std_measurement !== 1 ? !!v || 'This field is required' : true]">
          </v-text-field>
        </v-col>

        <v-col cols="4" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 0">
          <p class="mb-1 font-weight-bold body-1">OK <span style="color:red">*</span></p>
          <v-text-field
            v-model="form.ok_std" 
            outlined
            dense 
            :disabled="form.item_check_id != null"
            :rules="[(v) => !!v || 'This field is required']">
          </v-text-field>
        </v-col>
        <v-col cols="4" class="mb-0 pb-0" v-if="form.flg_std_measurement !== 0">
          <p class="mb-1 font-weight-bold body-1">NG <span style="color:red">*</span></p>
          <v-text-field
            v-model="form.ng_std" 
            outlined
            dense 
            :disabled="form.item_check_id != null"
            :rules="[(v) => !!v || 'This field is required']">
          </v-text-field>
        </v-col>
        
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="2" class="mr-0">
        <p class="mb-1 font-weight-bold body-1">Period <span style="color:red">*</span></p>
        <v-text-field
          type="number"
          v-model="form.periodic" 
          outlined
          dense 
          :rules="[(v) => !!v || 'This field is required']"
          :disabled="!['edit','periodic','add'].includes(form.trans_type)">
          >
        </v-text-field>
      </v-col>
      <v-col cols="3" class="ml-0">
        <p class="mb-1 font-weight-bold body-1" style="color:transparent">Period <span>*</span></p>
        <v-select
        v-model="form.flg_periodic"
        :items="['DAY','MONTH','YEAR']"
        outlined
        dense
            hide-details="auto"
            :rules="[(v) => !!v || 'This field is required']"
            :disabled="!['edit','periodic','add'].includes(form.trans_type)"
          ></v-select>
      </v-col>
      <v-col cols="3">
        <p class="mb-1 font-weight-bold body-1">Initial Start <span style="color:red">*</span></p>
        <base-datepicker
        v-model="form.start_at"
        :rules="[v => !!v || 'From is required']"
        :disabled="form.item_check_id != null"
        ></base-datepicker>
      </v-col>
      <!-- <v-col cols="4" class="mr-0">
        <p class="mb-1 font-weight-bold body-1">Sequence <span style="color:red">*</span></p>
        <v-text-field
          type="number"
          v-model="form.revision_sequence" 
          outlined
          dense 
          :rules="[(v) => v === 0 || !!v || 'This field is required']">
          >
        </v-text-field>
      </v-col> -->
    </v-row>
    <v-divider></v-divider>
    <div class="d-flex justify-end">
      <!-- <v-btn
        type="button"
        color="#E1F0FF"
        depressed
        class="mr-3 text-capitalize primary--text body-1"
        style="font-weight: 600"
        height="48"
        width="48"
        @click="close"
        >Close</v-btn
      > -->
      <v-btn
        type="submit"
        color="primary"
        depressed
        class="text-capitalize body-1"
        style="font-weight: 600"
        
        :loading="loading"
        >Next</v-btn
      >
    </div>
  </v-form>
</template>

<script>

import { FETCH_SPAREPARTS } from "@/core/services/store/sparePart.module";
import { FETCH_LEDGERMETHODS } from "@/core/services/store/ledgerMethod.module";
import { mapGetters } from "vuex";
import BaseDatepicker from "@/view/components/base/BaseDatepicker";

export default {
  data() {
    return {
    }
  },
  mounted() {
    this.$store.dispatch(FETCH_SPAREPARTS);
    this.$store.dispatch(FETCH_LEDGERMETHODS);
  },
  computed: {
    ...mapGetters({
      spareparts: "getSpareParts",
      ledgerMethods: "getLedgerMethod",
    }),
  },
  watch: {
    ['form.ledger_method_id'](v){
      // console.log({
      //   lmid: this.initMethod,
      //   periodic: this.initPeriodic,
      // });

      if(this.form.trans_type != "add"){
        if(v == this.initMethod){
          this.form.trans_type = 'edit';
        }else{
          this.form.trans_type = 'method';
        }
      }
    },
    ['form.periodic'](v){
      // console.log({
      //   lmid: this.initMethod,
      //   periodic: this.initPeriodic,
      // });

      if(this.form.trans_type != "add"){
        if(v+this.form.flg_periodic == this.initPeriodic){
          this.form.trans_type = 'edit';
        }else{
          this.form.trans_type = 'periodic';
        }
      }
    },
    ['form.flg_periodic'](v){
      // console.log({
      //   lmid: this.initMethod,
      //   periodic: this.initPeriodic,
      // });

      if(this.form.trans_type != "add"){
        if(this.form.periodic+v == this.initPeriodic){
          this.form.trans_type = 'edit';
        }else{
          this.form.trans_type = 'periodic';
        }
      }
    },
    ['form.in_charge'](v){
      // console.log({
      //   lmid: this.initMethod,
      //   periodic: this.initPeriodic,
      //   inchharge: this.initIncharge
      // });

      if(this.form.trans_type != "add"){
        if(this.form.in_charge == this.initIncharge){
          this.form.trans_type = 'edit';
        }else{
          this.form.trans_type = 'in_charge';
        }
      }
    },
  },
  props:{
    form:{
      type: Object,
      default:()=>{}
    },
    initMethod:{
      type: String,
      default:""
    },
    initPeriodic:{
      type: String,
      default:""
    },
    initIncharge:{
      type: String,
      default:""
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    doSubmit() {
      if (this.$refs.form.validate()) {
        this.$emit('doSubmit')
      }
    }
  },
  components: {
    BaseDatepicker
  },
}
</script>