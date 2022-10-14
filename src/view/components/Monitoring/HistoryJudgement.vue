<template>
  <v-card>
    <v-card-title>
      <div>
        <p class="mb-0">History Judgement</p>
        <p class="mb-0 text-caption grey--text">
          Centering Shaft Conveyor Bagian Atas
        </p>
      </div>
      <v-icon class="ml-auto" @click="$emit('close')">mdi-close</v-icon>
    </v-card-title>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>No</th>
              <th>Check Date</th>
              <th>Std. Measurement</th>
              <th>Actual Measurement</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2022-01-01</td>
              <td>Bersih</td>
              <td>Bersih</td>
              <td>
                <v-icon color="success">mdi-check-circle</v-icon>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>2022-01-01</td>
              <td>Bersih</td>
              <td>Bersih</td>
              <td>
                <v-icon color="success">mdi-check-circle</v-icon>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>2022-01-01</td>
              <td>Bersih</td>
              <td>Bersih</td>
              <td>
                <v-icon color="error">mdi-check-circle</v-icon>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>2022-01-01</td>
              <td>Bersih</td>
              <td>Bersih</td>
              <td>
                <v-icon color="success">mdi-check-circle</v-icon>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>2022-01-01</td>
              <td>Bersih</td>
              <td>Bersih</td>
              <td>
                <v-icon color="success">mdi-check-circle</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data() {
    
  },
  mounted(){
    console.log(this.$route.params.id)
  }
}
</script>

