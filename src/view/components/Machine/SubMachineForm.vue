<template>
  <v-form ref="formSubmachine" lazy-validation @submit.prevent="doSubmit">
    <v-row>
      <v-col md="12" cols="12">
        <p class="mb-0">Machine <span class="error--text">*</span></p>
        <v-select
          v-model="form.machine_id"
          :items="machines"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          item-text="name"
          item-value="id"
        ></v-select>
      </v-col>
      <v-col md="6" cols="12">
        <p class="mb-0">SubMachine Code <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.code"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
          :disabled="!!selectedSubMachine"
        ></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <p class="mb-0">SubMachine Name <span class="error--text">*</span></p>
        <v-text-field
          v-model="form.name"
          :rules="[(v) => !!v || 'This field is required']"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col md="12" cols="12">
        <p class="mb-0">Description</p>
        <v-textarea v-model="form.description" outlined dense></v-textarea>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <div class="d-flex justify-end">
      <v-btn
        type="button"
        color="#E1F0FF"
        depressed
        class="mr-3 text-capitalize primary--text body-1"
        style="font-weight: 600"
        height="48"
        width="48"
        @click="$emit('close')"
        >Close</v-btn
      >
      <v-btn
        type="submit"
        color="primary"
        depressed
        class="text-capitalize body-1"
        style="font-weight: 600"
        height="48"
        width="125"
        >Save</v-btn
      >
    </div>
  </v-form>
</template>
<script>
import { mapGetters } from "vuex";
import {
  FETCH_MACHINES,
  SUBMIT_SUB_MACHINE,
  UPDATE_SUB_MACHINE,
} from "@/core/services/store/machine.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedSubMachine: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        code: "",
        name: "",
        description: "",
        machine_id: "",
      },
      loading: false,
      years: [],
    };
  },
  computed: {
    ...mapGetters({
      machines: "getMachines",
    }),
  },
  watch: {
    ["selectedSubMachine.id"](val) {
      if (val) {
        this.$store.dispatch(FETCH_MACHINES);

        this.form.name = this.selectedSubMachine.name;
        this.form.description = this.selectedSubMachine.description;
        this.form.code = this.selectedSubMachine.code;
        this.form.machine_id = this.selectedSubMachine.machine_id;
      } else {
        this.$refs.formSubmachine.reset();
      }
    },
  },
  async mounted() {
    this.$store.dispatch(FETCH_MACHINES);
    for (
      let index = new Date().getFullYear();
      index > new Date().getFullYear() - 20;
      index--
    ) {
      this.years.push(index);
    }
    if (this.selectedSubMachine?.id) {
      this.form.name = this.selectedSubMachine.name;
      this.form.description = this.selectedSubMachine.description;
      this.form.code = this.selectedSubMachine.code;
      this.form.machine_id = this.selectedSubMachine.machine_id;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formSubmachine.validate()) {
        this.loading = true;
        let response;
        if (this.selectedSubMachine?.id) {
          response = await this.$store.dispatch(UPDATE_SUB_MACHINE, {
            id: this.selectedSubMachine.uuid,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_SUB_MACHINE, this.form);
        }
        toastResponse(response);
        this.loading = false;
        if (response.success) {
          if (!this.selectedSubMachine) {
            this.$refs.formSubmachine.reset();
          }
          this.$emit("success");
        }
      }
    },
  },
};
</script>
