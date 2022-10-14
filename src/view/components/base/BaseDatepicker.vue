<template>
  <v-menu
    ref="menu"
    v-model="menu"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        :value="value"
        placeholder="Pilih Tanggal"
        append-icon="mdi-calendar"
        readonly
        outlined
        dense
        hide-details="auto"
        v-bind="attrs"
        v-on="on"
        :rules="rules"
        :error="error"
        :success="success"
        :error-messages="error && !disabled ? `Wajib Diisi` : []"
        :class="disabled && `grey lighten-2`"
        :disabled="disabled"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      scrollable
      color="primary"
      :max="max"
      @change="dateChanged"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    rules: {
      type: Array,
      default: (_) => [],
    },
    value: {
      type: String,
      default: "",
    },
    max: {
      type: String,
      default: "",
    },
    error: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      menu: false,
      timePick: false,
      datePick: true,
      date: "",
      time: "",
    };
  },
  watch: {
    menu(val) {
      if (!val) {
        this.reset();
      }
    },
    value(val) {
      if (!val) {
        this.date = val;
      }
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      this.datePick = true;
      this.timePick = false;
    },
    dateChanged(evt) {
      let value = evt;
      this.$emit("input", value);
      this.datePick = false;
    },
  },
};
</script>
