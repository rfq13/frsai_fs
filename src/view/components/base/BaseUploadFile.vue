<template>
  <v-row class="mt-4">
    <!-- upload doc file -->
    <v-col cols="12" class="pt-0">
      <div class="px-5 py-5 btn-file text-center">
        <v-icon size="40" class="primary--text icon-center"
          >mdi-file-document</v-icon
        >
        <p v-if="!file" class="mb-0">{{ placeholder }}</p>
        <p v-else class="mb-0 font-weight-bold">
          {{ file.name }}
          <v-icon color="success" @click="detailFile = true" style="z-index: 1"
            >mdi-eye</v-icon
          >
          <v-icon color="error" @click="reset" style="z-index: 1"
            >mdi-close</v-icon
          >
        </p>
        <input id="fileDoc" type="file" @change="uploadFile" :accept="accept" />
      </div>

      <v-dialog v-model="detailFile" width="600">
        <div class="white">
          <img
            v-if="file && file.type.includes('image')"
            :src="getBlob(file)"
            alt
            style="width: 100%"
          />
          <object
            v-if="file && file.type.includes('pdf')"
            :data="getBlob(file)"
            type="application/pdf"
            style="width: 100%; min-height: 500px"
          >
            alt :
            <a href="test.pdf">test.pdf</a>
          </object>
        </div>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: "Drag & Drop Your File Here!" },
    removeFile: { type: Boolean, default: false },
    accept: {
      type: String,
      default:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  },
  data() {
    return {
      file: null,
      detailFile: false,
    };
  },
  watch: {
    removeFile(val) {
      this.reset();
    },
  },
  methods: {
    uploadFile(event) {
      event.preventDefault();
      const { files } = event.target;
      this.file = files[0];
      this.$emit("uploaded", files[0]);
    },
    reset() {
      document.getElementById("fileDoc").value = null;
      this.file = null;
      this.$emit("uploaded", null);
    },
    getBlob(file) {
      if (typeof file == "string") {
        return this.serverUrl + file;
      }
      return URL.createObjectURL(file);
    },
  },
};
</script>

<style scoped>
.icon-center {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-file {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px dashed #41b883;
  border-radius: 7px !important;
}

.btn-file input[type="file"] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 90px;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  cursor: inherit;
  display: block;
  z-index: 0 !important;
}

.btn-remove:hover {
  cursor: pointer;
}

.image {
  border-radius: 10px !important;
  /* background: url('/static/not_found.jpg') whitesmoke; */
  background-size: 100%;
}
</style>
