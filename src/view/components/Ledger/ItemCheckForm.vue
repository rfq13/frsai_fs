<template>
  <v-form ref="itemCheck" @submit.prevent="doSubmit">
    <v-row>
      <v-col md="3" cols="6">
        <p class="mb-0 text-body">
          Incharge <span class="error--text">*</span>
        </p>
        <v-radio-group
          v-model="form.incharge"
          :rules="[(v) => !!v || 'This field is required']"
          row
          dense
          hide-details="auto"
        >
          <v-radio value="production">
            <template v-slot:label>
              <p class="text-body-1 mb-0">PRD</p>
            </template>
          </v-radio>
          <v-radio value="maintenance">
            <template v-slot:label>
              <p class="text-body-1 mb-0">MTE</p>
            </template>
          </v-radio>
          <v-radio value="vendor">
            <template v-slot:label>
              <p class="text-body-1 mb-0">Vendor</p>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
      <v-col md="3" cols="6">
        <p class="mb-0 text-body">
          Initial Start <span class="error--text">*</span>
        </p>
        <base-datepicker
          v-model="form.init"
          :rules="[(v) => !!v || 'This field is required']"
        ></base-datepicker>
      </v-col>
      <v-col md="6" cols="6">
        <p class="mb-0 text-body">
          Item Check <span class="error--text">*</span>
        </p>
        <v-text-field
          v-model="form.name"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <p class="mb-0">Location <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.location"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col md="3" cols="12">
        <p class="mb-0">Part Number/ Item Number</p>
        <v-autocomplete
          v-model="form.sparepart"
          :items="spareparts"
          :rules="[(v) => !!v || 'This field is required']"
          item-value="id"
          item-text="spare_part_name"
          outlined
          dense
          hide-details="auto"
          return-object
        ></v-autocomplete>
        {{ form.sparepart.price_per_unit | filterPrice }}
      </v-col>

      <v-col md="3" cols="6">
        <p class="mb-0">Qty</p>
        <v-text-field
          v-model="form.qty"
          :rules="[(v) => !!v || 'This field is required']"
          type="number"
          outlined
          dense
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col md="4">
        <p class="mb-0">Method <span class="error--text">*</span></p>
        <v-autocomplete
          v-model="form.ledgerMethod"
          :items="ledgerMethods"
          :rules="[(v) => !!v || 'This field is required']"
          item-text="name"
          item-id="id"
          outlined
          dense
          hide-details="auto"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col md="2">
        <p class="mb-0">Duration <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.duration"
          type="number"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <p class="mb-0">MP <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.mp"
          type="number"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6">
        <p class="mb-0">JIS No <span class="error--text">*</span></p>
        <v-autocomplete
          v-model="form.jis_no"
          :items="jis"
          :rules="[(v) => !!v || 'This field is required']"
          item-text="title"
          item-value="id"
          outlined
          dense
          hide-details="auto"
          multiple
          chips
          deletable-chips
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col md="6">
        <p class="mb-0">Special Tool Support</p>
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="jis in form.jis_no"
            :key="jis.uuid"
            small
            color="primary"
            class="mb-2 mr-2"
          >
            {{ jis.special_tool.name }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <p class="mb-0">Std Measurement</p>
        <v-select
          v-model="form.selectedStd"
          :items="std"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          hide-details="auto"
        ></v-select>
      </v-col>
      <v-col md="8">
        <v-row v-if="form.selectedStd == 'range'">
          <v-col md="3" cols="6">
            <p class="mb-0">Lower Limit</p>
            <v-text-field
              v-model="form.lowerLimit"
              :rules="[(v) => !!v || 'This field is required']"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col md="3" cols="6">
            <p class="mb-0">Upper Limit</p>
            <v-text-field
              v-model="form.upperLimit"
              :rules="[(v) => !!v || 'This field is required']"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col md="3" cols="6">
            <p class="mb-0">Warning Lower Limit</p>
            <v-text-field
              v-model="form.warningLowerLimit"
              :rules="[(v) => !!v || 'This field is required']"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col md="3" cols="6">
            <p class="mb-0">Warning Upper Limit</p>
            <v-text-field
              v-model="form.warninUpperLimit"
              :rules="[(v) => !!v || 'This field is required']"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="form.selectedStd == 'judgement'">
          <v-col md="6" cols="12">
            <p class="mb-0">Std OK</p>
            <v-text-field
              v-model="form.stdOk"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <p class="mb-0">Std Ng</p>
            <v-text-field
              v-model="form.stdNg"
              outlined
              dense
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3">
        <p class="mb-0">Period</p>
        <div class="d-flex">
          <v-text-field
            v-model="form.periodic"
            outlined
            dense
            hide-details="auto"
          ></v-text-field>
          <v-select
            v-model="form.flg_periodic"
            :items="['D', 'M', 'Y']"
            outlined
            dense
            hide-details="auto"
          ></v-select>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <v-col md="12">
        <v-divider></v-divider>
        <div class="d-flex">
          <v-btn
            type="button"
            color="#E1F0FF"
            class="title text-capitalize text-primary ml-auto"
            height="48"
            width="125"
            depressed
            @click="$emit('close')"
            >Close</v-btn
          >
          <v-btn
            type="submit"
            color="primary"
            class="ml-3 title text-capitalize"
            height="48"
            width="125"
            depressed
            >Add</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import BaseDatepicker from "@/view/components/base/BaseDatepicker";

import { filterPrice } from "@/core/plugins/filters";
export default {
  filters: {
    filterPrice,
  },
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
    jis: {
      type: Array,
      default: () => ([]),
    },
    specialTools:{
      type: Array,
      default: () => ([]),
    },
    ledgerMethods:{
      type: Array,
      default: () => ([]),
    },
    spareparts:{
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    BaseDatepicker,
  },
  data() {
    return {
      form: {
        sparepart: "",
        incharge: "",
        init: "",
        name: "",
        location: "",
        sparepart: "",
        sparepart: "",
        qty: "",
        ledgerMethod: "",
        duration: "",
        mp: "",
        jis_no: [],
        selectedStd: "",
        lowerLimit: "",
        upperLimit: "",
        warningLowerLimit: "",
        warninUpperLimit: "",
        stdOk: "",
        stdNg: "",
        periodic: "",
        flg_periodic: "",
      },
      std: [
        { text: "Judgement", value: "judgement" },
        { text: "Range or Limit", value: "range" },
      ],
      selectedStd: "",
    };
  },
  computed: {
    
  },
  watch: {
    ["selectedItem.id"](val) {
      if (val) {
        this.form = { ...this.selectedItem };
      } else {
        this.form = {
          sparepart: "",
          incharge: "",
          init: "",
          name: "",
          location: "",
          sparepart: "",
          sparepart: "",
          qty: "",
          ledgerMethod: "",
          duration: "",
          mp: "",
          jis_no: [],
          selectedStd: "",
          lowerLimit: "",
          upperLimit: "",
          warningLowerLimit: "",
          warninUpperLimit: "",
          stdOk: "",
          stdNg: "",
          periodic: "",
          flg_periodic: "",
        };
      }
    },
  },
  methods: {
    doSubmit() {
      if (this.$refs.itemCheck.validate()) {
        if (this.selectedItem?.id) {
          this.$emit("update", { ...this.form, id: this.selectedItem.id });
        } else {
          this.$emit("submit", { ...this.form });
        }
        this.$refs.itemCheck.reset();
        this.form = {
          sparepart: "",
          incharge: "",
          init: "",
          name: "",
          location: "",
          sparepart: "",
          sparepart: "",
          qty: "",
          ledgerMethod: "",
          duration: "",
          mp: "",
          jis_no: [],
          selectedStd: "",
          lowerLimit: "",
          upperLimit: "",
          warningLowerLimit: "",
          warninUpperLimit: "",
          stdOk: "",
          stdNg: "",
        };
      }
    },
  },
  mounted() {
    
    if (this.selectedItem.id) {
      this.form = { ...this.selectedItem };
    }
  },
};
</script>
