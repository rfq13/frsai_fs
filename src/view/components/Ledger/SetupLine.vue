<template>
  <v-form ref="step1" @submit.prevent="doSubmit">
    <h1 class="title">Setup Your Line Detail</h1>
    <v-divider></v-divider>
    <v-row>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Line <span class="error--text">*</span></p>
          <v-autocomplete
            v-model="line"
            :items="lines"
            :rules="[(v) => !!v || 'This field is required']"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            return-object
            @change="changeLine"
          ></v-autocomplete>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <div>
          <p class="mb-0">Machine <span class="error--text">*</span></p>
          <v-autocomplete
            v-model="machine"
            :items="machines"
            :rules="[(v) => !!v || 'This field is required']"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            return-object
            :loading="loadingMachine"
          ></v-autocomplete>
        </div>
      </v-col>
      <v-col md="12">
        <v-divider></v-divider>
        <div class="d-flex">
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
import { FETCH_MACHINES } from "@/core/services/store/machine.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { mapGetters } from "vuex";
import { PROFILE } from "@/core/services/store/auth.module";
export default {
  data() {
    return {
      machine: "",
      line: "",
      loadingMachine: false,
    };
  },
  computed: {
    ...mapGetters({
      machines: "getMachines",
      lines: "getLines",
      user: "currentUser",
    }),
  },
  async mounted() {
    await this.$store.dispatch(PROFILE);

    this.$store.dispatch(FETCH_LINES, this.user.user.department_id);
    const datas = window.localStorage.getItem("step-1");
    if (datas) {
      const aData = JSON.parse(datas);
      this.machine = aData.machine_id;
      this.line = aData.line_id;
    }
  },
  methods: {
    async changeLine(evt) {
      this.loadingMachine = true;
      await this.$store.dispatch(FETCH_MACHINES, {line_id:evt.id,nothasledger:true});
      this.loadingMachine = false;
    },
    doSubmit() {
      if (this.$refs.step1.validate()) {
        window.localStorage.setItem(
          "step-1",
          JSON.stringify({ machine_id: this.machine, line_id: this.line })
        );
        this.$emit("next");
      }
    },
  },
};
</script>
