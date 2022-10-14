<template>
  <v-card class="shadow" rounded="lg">
    <v-card-title>
      <p class="mb-0 title">
        {{
          typeof title.line_id == "object"
            ? title.line_id.name
            : title.line.name
        }}
      </p>
      <v-btn
        v-if="isShowExport"
        color="primaryLow"
        class="ml-auto primary--text"
        depressed
        height="34"
      >
        <v-icon class="mdi-rotate-90 mr-2">mdi-import</v-icon>
        Export
        <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </v-btn>
      <slot name="right_button"></slot>
    </v-card-title>
    <v-card-text>
      <p class="mb-1 body-1">
        <v-icon>mdi-memory</v-icon> Machine Name:
        <b>{{
          typeof title.machine_id == "object"
            ? title.machine_id.name
            : title.machine.name
        }}</b>
      </p>
      <p class="mb-1 body-1">
        <v-icon>mdi-cog</v-icon> Process No.:
        <b>
          {{
            typeof title.machine_id == "object"
              ? title.machine_id.operation_number
              : title.machine.operation_number
          }}
          ({{
            typeof title.machine_id == "object"
              ? title.machine_id.process_name
              : title.machine.process_name
          }})
        </b>
      </p>
      <p class="mb-1 body-1">
        <v-icon>mdi-chart-areaspline</v-icon> Maker:
        {{
          typeof title.machine_id == "object"
            ? title.machine_id.maker
            : title.machine.maker
        }}
      </p>

      <div v-if="withFooter">
        <v-divider></v-divider>
        <v-row class="body-1">
          <v-col md="8">
            <div class="grey--text">
              TMMIN - E/G Production Division <br />
              Maintenance Department
            </div>
          </v-col>
          <v-col md="2" class="d-flex">
            <v-icon size="30" class="mr-3">mdi-calendar</v-icon>
            <div>
              <p class="mb-0">Establish</p>
              <p class="mb-0">2022-09-07</p>
            </div>
          </v-col>
          <v-col md="2" class="d-flex">
            <v-icon size="30" class="mr-3">mdi-calendar</v-icon>
            <div>
              <p class="mb-0">7th Revision: 2022-09-09</p>
              <a class="mb-0 primary--text body-1" href="#">view</a>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    isShowExport: {
      type: Boolean,
      default: true,
    },
    withFooter: {
      type: Boolean,
      default: true,
    },
    title: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
