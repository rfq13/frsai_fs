<template>
  <v-form ref="formLine" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Shop <span class="error--text">*</span></p>
      <v-select
        v-model="form.shop_id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        item-text="name"
        item-value="id"
        :items="shops"
      ></v-select>
    </div>
    <div>
      <p class="mb-0">Line Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedLine"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Line Name <span class="error--text">*</span></p>
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
import { FETCH_SHOPS } from "@/core/services/store/shop.module";
import { SUBMIT_LINE, UPDATE_LINE } from "@/core/services/store/line.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedLine: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        code: "",
        shop_id: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      shops: "getShops",
    }),
  },
  watch: {
    async selectedLine(val) {
      if (!val) {
        this.$refs.formLine.reset();
      } else {
        this.form.name = this.selectedLine.name;
        this.form.description = this.selectedLine.description;
        this.form.code = this.selectedLine.code;
        this.form.shop_id = this.selectedLine.shop_id;
      }
    },
  },
  async mounted() {
    this.$store.dispatch(FETCH_SHOPS);
    if (this.selectedLine?.id) {
      this.form.name = this.selectedLine.name;
      this.form.description = this.selectedLine.description;
      this.form.code = this.selectedLine.code;
      this.form.shop_id = this.selectedLine.shop_id;
    }
  },
  methods: {
    fetchDepartment(id) {
      this.$store.dispatch(FETCH_DEPARTMENTS, id);
    },
    async doSubmit() {
      if (this.$refs.formLine.validate()) {
        this.loading = true;
        let response;
        if (this.selectedLine?.id) {
          response = await this.$store.dispatch(UPDATE_LINE, {
            id: this.selectedLine.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_LINE, this.form);
        }
        this.loading = false;
        toastResponse(response);
        this.$refs.formLine.reset();
        this.$emit("success");
      }
    },
    getPlant(evt) {
      this.$store.dispatch(FETCH_PLANTS, evt);
    },
    getDivision(evt) {
      this.$store.dispatch(FETCH_DIVISIONS, evt);
    },
  },
};
</script>
