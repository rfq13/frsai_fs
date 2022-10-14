<template>
  <v-form ref="formCell" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Line <span class="error--text">*</span></p>
      <v-select
        v-model="form.line_id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        item-text="name"
        item-value="id"
        :items="lines"
      ></v-select>
    </div>
    <div>
      <p class="mb-0">Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedCell"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Name <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Description</p>
      <v-textarea v-model="form.description" outlined dense></v-textarea>
    </div>

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
        :loading="loading"
        >Save</v-btn
      >
    </div>
  </v-form>
</template>
<script>
import { mapGetters } from "vuex";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { FETCH_PLANTS } from "@/core/services/store/plant.module";
import { FETCH_DIVISIONS } from "@/core/services/store/division.module";
import { FETCH_DEPARTMENTS } from "@/core/services/store/department.module";
import { FETCH_LINES } from "@/core/services/store/line.module";
import { SUBMIT_CELL, UPDATE_CELL } from "@/core/services/store/cell.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedCell: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        line_id: "",
        code: "",
        name: "",
        description: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      lines: "getLines",
    }),
  },
  watch: {
    selectedCell(val) {
      if (val) {
        this.$store.dispatch(FETCH_LINES);
        this.form.name = this.selectedCell.name;
        this.form.description = this.selectedCell.description;
        this.form.code = this.selectedCell.code;
        this.form.line_id = this.selectedCell.line_id;
      } else {
        this.$refs.formCell.reset();
      }
    },
  },
  async mounted() {
    this.$store.dispatch(FETCH_LINES);
    if (this.selectedCell?.id) {
      this.form.name = this.selectedCell.name;
      this.form.description = this.selectedCell.description;
      this.form.code = this.selectedCell.code;
      this.form.line_id = this.selectedCell.line_id;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formCell.validate()) {
        this.loading = true;
        let response;
        if (this.selectedCell?.id) {
          response = await this.$store.dispatch(UPDATE_CELL, {
            id: this.selectedCell.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_CELL, this.form);
        }
        toastResponse(response);
        this.loading = false;
        if (response.success) {
          this.$refs.formCell.reset();
          this.$emit("success");
        }
      }
    },
  },
};
</script>
