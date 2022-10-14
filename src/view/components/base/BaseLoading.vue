<template>
  <div class="loading-container d-block d-flex flex-row justify-center ma-auto">
    <p class="text-center d-inline ma-auto">
      <v-progress-circular
        class="mr-1 mt-n1"
        indeterminate
        color="#30CDE4"
        :size="18"
        :width="2"
      >
      </v-progress-circular>
      Loading...
    </p>
  </div>
</template>
<style scoped>
.loading-container {
  height: 150px;
  margin: auto;
}
</style>
