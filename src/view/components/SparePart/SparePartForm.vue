<template>
  <v-form ref="formSpare" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">Machines <span class="error--text"></span></p>
      <v-autocomplete
        v-model="form.machine_id"
        :items="machines"
        item-value="id"
        item-text="name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-autocomplete>
    </div>
    <div>
      <p class="mb-0">Spare Part No <span class="error--text"></span></p>
      <v-text-field
        v-model="form.spare_part_no"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        :disabled="!!selectedSparepart"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Spare Part Name <span class="error--text"></span></p>
      <v-text-field
        v-model="form.spare_part_name"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Price per Unit <span class="error--text"></span></p>
      <v-text-field
        v-model="form.price_per_unit"
        :rules="[(v) => !!v || 'This field is required']"
        type="number"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">Stock <span class="error--text"></span></p>
      <v-text-field
        v-model="form.stock"
        :rules="[(v) => !!v || 'This field is required']"
        type="number"
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
        >Save</v-btn
      >
    </div>
  </v-form>
</template>
<script>
import { FETCH_MACHINES } from "@/core/services/store/machine.module";
import {
  SUBMIT_SPAREPART,
  UPDATE_SPAREPART,
} from "@/core/services/store/sparePart.module";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
export default {
  props: {
    selectedSparepart: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        machine_id: "",
        spare_part_no: "",
        spare_part_name: "",
        part_type: "",
        price_per_unit: "",
        stock: "",
        description: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      machines: "getMachines",
    }),
  },
  watch: {
    selectedSparepart(val) {
      if (val) {
        if (this.machines.length == 0) {
          this.$store.dispatch(FETCH_MACHINES);
        }
        this.form.spare_part_no = this.selectedSparepart.spare_part_no;
        this.form.spare_part_name = this.selectedSparepart.spare_part_name;
        this.form.part_type = this.selectedSparepart.part_type;
        this.form.price_per_unit = this.selectedSparepart.price_per_unit;
        this.form.stock = this.selectedSparepart.stock;
        this.form.description = this.selectedSparepart.description;
        this.form.machine_id = this.selectedSparepart.machine_id + "";
      } else {
        this.$refs.formSpare.reset();
      }
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_MACHINES);
    if (this.selectedSparepart?.id) {
      this.form.machine_id = this.selectedSparepart.machine_id;
      this.form.spare_part_no = this.selectedSparepart.spare_part_no;
      this.form.spare_part_name = this.selectedSparepart.spare_part_name;
      this.form.part_type = this.selectedSparepart.part_type;
      this.form.price_per_unit = this.selectedSparepart.price_per_unit;
      this.form.stock = this.selectedSparepart.stock;
      this.form.description = this.selectedSparepart.description;
    }
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formSpare.validate()) {
        let response = {};
        if (this.selectedSparepart?.id) {
          response = await this.$store.dispatch(UPDATE_SPAREPART, {
            id: this.selectedSparepart.uuid,
            body: this.form,
          });
        } else {
          response = await this.$store.dispatch(SUBMIT_SPAREPART, this.form);
        }

        toastResponse(response);
        this.$emit("success");
      }
    },
  },
};
</script>
