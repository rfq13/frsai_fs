<template>
  <v-form ref="formPlant" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Company <span class="error--text">*</span></p>
      <v-select
        v-model="form.company_id"
        :rules="[(v) => !!v || 'This field is required']"
        :items="companies"
        item-value="id"
        item-text="name"
        outlined
        dense
      ></v-select>
    </div>
    <div>
      <p class="mb-0">Plant Code <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.code"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedPlant"
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
    <div>
      <p class="mb-0">Address <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.address"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Phone Number <span class="error--text">*</span> </p>
      <v-text-field
        v-model="form.phone"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        maxLength="13"
      ></v-text-field>
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
import { SUBMIT_PLANT, UPDATE_PLANT } from "@/core/services/store/plant.module";
import { toastResponse } from "@/core/plugins/dialogUtil";
import { FETCH_COMPANIES } from "@/core/services/store/company.module";
import { mapGetters } from "vuex";
export default {
  props: {
    selectedPlant: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        company_id: "",
        name: "",
        description: "",
        address: "",
        phone: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      companies: "getCompanies",
    }),
  },
  watch: {
    selectedPlant(val) {
      if (!val) {
        this.$refs.formPlant.reset();
      }
      if (val) {
        this.form = this.selectedPlant;
      }
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_COMPANIES);
    if (this.selectedPlant?.id) {
      this.form = this.selectedPlant;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formPlant.validate()) {
        this.loading = true;
        let response;
        if (this.selectedPlant?.id) {
          response = await this.$store.dispatch(UPDATE_PLANT, {
            id: this.selectedPlant.id,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_PLANT, this.form);
        }
        this.loading = false;
        toastResponse(response);
        this.$refs.formPlant.reset();
        this.$emit("success");
      }
    },
  },
};
</script>
