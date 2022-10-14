<template>
  <v-form ref="formJis" lazy-validation @submit.prevent="doSubmit">
    <div>
      <p class="mb-0">JIS No <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.number"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
        type="number"
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">JIS Name <span class="error--text">*</span></p>
      <v-text-field
        v-model="form.title"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-text-field>
    </div>
    <div>
      <p class="mb-0">
        Special Tools Support <span class="error--text">*</span>
      </p>
      <v-select
        v-model="form.special_tool_id"
        :items="tools"
        item-text="name"
        item-value="id"
        :rules="[(v) => !!v || 'This field is required']"
        outlined
        dense
      ></v-select>
    </div>
    <div>
      <p class="mb-0">Description</p>
      <v-textarea v-model="form.description" outlined dense></v-textarea>
    </div>
    <div v-for="(file, index) in files" :key="index" class="d-flex">
      <b-row>
        <b-col sm="8">
          <img
            v-if="checkFile(checkFileUrl(file), 'image')"
            :src="checkFileUrl(file)"
            class="img-fluid"
          />
          <video
            v-else-if="checkFile(checkFileUrl(file), 'video')"
            class="img-fluid"
            controls
            autoplay
          >
            <source :src="checkFileUrl(file)" />
          </video>
          <iframe
            v-if="checkFile(checkFileUrl(file), 'pdf')"
            :src="checkFileUrl(file)"
            frameborder="0"
            class="img-fluid"
          ></iframe>

          <span v-if="typeof file == 'string'">{{ file }}</span>
          <v-file-input
            v-else
            :rules="[
              (v) => {
                return !!v || 'This field is required pol';
              },
            ]"
            outlined
            dense
            prepend-icon=""
            prepend-inner-icon="mdi-attachment"
            placeholder="Choose file"
            @change="(evt) => handleChange(evt, index)"
            accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .mp4, .mp3, .3gp, .mkv, .webm"
          ></v-file-input>
          <v-divider></v-divider>
        </b-col>
        <b-col sm="4">
          <v-btn
            color="error"
            class="ml-2"
            size="small"
            @click="removeFile(index)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </b-col>
      </b-row>
    </div>
    <v-btn color="success" class="ml-2" size="small" @click="files.push(null)">
      <v-icon>mdi-plus</v-icon>
      Add File JIS
    </v-btn>
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
import { FETCH_SPECIALTOOLS } from "@/core/services/store/specialTools.module";
import { UPLOAD_JIS } from "@/core/services/store/tpmLedger.module";
import { mapGetters } from "vuex";
import { confirm, toastResponse } from "@/core/plugins/dialogUtil";
import constant from "../../../../../constant";
export default {
  props: {
    selectedItem: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        special_tool_id: "",
        title: "",
        description: "",
        number: "",
      },
      files: [null],
    };
  },
  computed: {
    ...mapGetters({
      tools: "getSpecialTools",
    }),
  },

  mounted() {
    this.$store.dispatch(FETCH_SPECIALTOOLS);
  },
  methods: {
    async doSubmit() {
      if (this.$refs.formJis.validate()) {
        const formData = new FormData();
        formData.append("special_tool_id", this.form.special_tool_id);
        formData.append("title", this.form.title);
        formData.append("number", this.form.number);
        formData.append("description", this.form.description);
        this.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
        this.loading = true;
        const response = await this.$store.dispatch(UPLOAD_JIS, formData);
        this.loading = false;
        toastResponse(response);
        this.$emit("success");
      }
    },
    handleChange(evt, index) {
      this.files[index] = evt;
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },

    checkFile(file_name, type) {
      const Exts = {
        video: ["mp4", "webm", "mkv", "3gp"],
        image: ["jpg", "jpeg", "png", "gif"],
        pdf: ["pdf"],
        excel: ["xls", "xlsx"],
        word: ["doc", "docx"],
      };

      // if exts is not found
      if (!Exts[type]) return false;

      return (
        file_name &&
        Exts[type].includes(file_name.split(".").pop().toLowerCase())
      );
    },
    checkFileUrl(url) {
      // check and handle if url is file object
      // thhen genrate url from file object
      if (url instanceof File) {
        return URL.createObjectURL(url);
      }

      // check if url is include http or https
      let newUrl = url;
      if (
        newUrl &&
        (!newUrl.includes("http://") || !newUrl.includes("https://"))
      ) {
        // remove first slash from url
        if (newUrl.startsWith("/")) {
          newUrl = newUrl.substring(1);
        }

        newUrl = constant.BASE_API_URL + newUrl;
      }

      return newUrl;
    },
  },
};
</script>
