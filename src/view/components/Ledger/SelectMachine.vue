<template>
  <v-form @submit.prevent="doSubmit">
    <h1 class="title">Select Machine</h1>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Machine</p>
          <v-autocomplete outlined dense hide-details="auto"></v-autocomplete>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Process</p>
          <v-text-field outlined dense hide-details="auto"></v-text-field>
        </div>
      </v-col>

      <v-col md="12">
        <v-divider></v-divider>
        <div class="d-flex">
          <v-btn
            type="button"
            color="#E1F0FF"
            class="title text-capitalize text-primary"
            height="48"
            width="125"
            depressed
            @click="$emit('prev')"
            >Previous</v-btn
          >
          <v-btn
            type="submit"
            color="primary"
            class="ml-auto title text-capitalize"
            height="48"
            width="125"
            depressed
            >Next</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  methods: {
    doSubmit() {
      this.$emit("next");
    },
  },
};
</script>
