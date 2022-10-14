<template>
  <v-card>
    <v-card-title>
      <div>
        <p class="title mb-0">JIS Item Check</p>
        <p class="text-caption grey--text mb-0">
          Centering Shaft Conveyor Bagian Atas
        </p>
      </div>
      <v-icon class="ml-auto" @click="$emit('close')">mdi-close</v-icon>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col md="3">
          <v-list dense>
            <v-list-item class="px-0" :key="key" v-for="(jis,key) in jises">
              <a href="javascript:void(0)" style="color:black" @click="(e)=>selectJis(e,jis)">{{ jis.title }}</a>
            </v-list-item>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col md="9" class="d-flex justify-center items-center">
          <div v-for="(file, index) in previews" :key="index" class="d-flex">
            <img v-if="checkFile(checkFileUrl(file),'image')" :src="checkFileUrl(file)" class="img-fluid" />
            <video v-else-if="checkFile(checkFileUrl(file),'video')" class="img-fluid" controls autoplay>
              <source :src="checkFileUrl(file)" >
            </video>
            <iframe v-else-if="checkFile(checkFileUrl(file),'pdf')" :src="checkFileUrl(file)" frameborder="0" class="img-fluid"></iframe>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div class="d-flex">
        <v-btn
          type="button"
          color="#E1F0FF"
          class="ml-auto title text-capitalize text-primary"
          height="48"
          width="125"
          depressed
          @click="$emit('close')"
          >Close</v-btn
        >
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { GET_JIS_BY_PLANNING } from "@/core/services/store/jis.module";
import { mapGetters } from "vuex";
import constant from "../../../../constant";

export default {
  props: {
    jises: {
      type: Array
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.dataJises = this.jises;
  },
  computed: {
    
  },
  watch: {
    jises(val) {
      // console.log(val);
    },
    previews(val) {
      // console.log(val);
    },
    dialog(val) {
      if (val) {
        this.selectJis(null, this.jises[0]);
      }
      // console.log(val,"dialog");
    }
  },
  methods: {
    selectJis(e,jis) {
      this.previews = JSON.parse(jis.file_url).map(f=>encodeURI(this.checkFileUrl(f)));
    },
    checkFile(file_name,type) {
      const Exts = {
        video: ["mp4", "webm", "mkv", "3gp"],
        image: ["jpg", "jpeg", "png", "gif"],
        pdf: ["pdf"],
        excel: ["xls", "xlsx"],
        word: ["doc", "docx"],
      }

      // if exts is not found
      if (!Exts[type]) return false;

      return file_name && Exts[type].includes(file_name.split(".").pop().toLowerCase());
    },
    checkFileUrl(url){
      // console.log(url);
      // check and handle if url is file object
      // thhen genrate url from file object
      if (url instanceof File) {
        return URL.createObjectURL(url);
      }

      
      // check if url is include http or https
      // let newUrl = url;

      // if(newUrl.includes("http://")===false || newUrl.includes("https://")===false){
      //   console.log("not include http");
      //   // remove first slash from url
      //   if(newUrl.startsWith("/")){
      //     newUrl = newUrl.substring(1);
      //   }



      // }
      // newUrl = constant.BASE_API_URL+newUrl.replaceAll(constant.BASE_API_URL,"");
      
      return constant.BASE_API_URL+url.replaceAll(constant.BASE_API_URL,"");
    }
  },
  data() {
    return {
      previews: [],
      dataJises:[]
    };
  },

}
</script>

