<template>
  <v-form>
    <div>
      <p class="mb-2">Position Code</p>
      <v-text-field outlined dense></v-text-field>
    </div>
    <div>
      <p class="mb-2">Position Name</p>
      <v-text-field outlined dense></v-text-field>
    </div>
    <div>
      <p class="mb-2">Description</p>
      <v-textarea outlined dense></v-textarea>
    </div>
    <div class="d-flex" style="width: 100%; justify-content: end">
      <v-btn
        depressed
        height="48"
        width="125"
        class="text-primary mr-4 title text-capitalize"
        color="#E1F0FF"
        >Close</v-btn
      >
      <v-btn
        class="title text-capitalize"
        depressed
        color="primary"
        height="48"
        width="125"
        >Save</v-btn
      >
    </div>
  </v-form>
</template>
