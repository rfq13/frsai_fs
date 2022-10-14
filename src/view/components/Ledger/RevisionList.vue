<template>
  <div>
    <!-- 
      <v-card-title>Revision List</v-card-title>
      <v-card-text class="py-8 px-6" style="color: #3f4254"> -->

    <div class="d-flex flex-wrap my-8">
      <div class="ml-auto d-flex" style="align-items: center">
        Search:
        <v-text-field
          v-model="keywordrevision"
          outlined
          dense
          hide-details
          class="ml-3"
          clearable
        ></v-text-field>
      </div>
    </div>

    <v-data-table
      class="mt-5"
      :items="reviseItemChecks"
      :headers="revisionheaders"
      :search="keywordrevision"
      :loading="revisionloading"
    >
      <template v-slot:[`item.no`]="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:[`item.revision_reason`]="{ item }">
        {{ threeDots(item.revision_reason, 100) }}
      </template>
      <template v-slot:[`item.add`]="{ item }">
        <v-icon v-if="item.trans_type == 'add'" color="success">
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="grey" size="32">mdi-record</v-icon>
      </template>
      <template v-slot:[`item.delete`]="{ item }">
        <v-icon v-if="item.trans_type == 'delete'" color="success">
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="grey" size="32">mdi-record</v-icon>
      </template>
      <template v-slot:[`item.periodic`]="{ item }">
        <v-icon v-if="item.trans_type == 'periodic'" color="success">
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="grey" size="32">mdi-record</v-icon>
      </template>
      <template v-slot:[`item.method`]="{ item }">
        <v-icon v-if="item.trans_type == 'method'" color="success">
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="grey" size="32">mdi-record</v-icon>
      </template>
      <template v-slot:[`item.incharge_change`]="{ item }">
        <v-icon v-if="item.trans_type == 'in_charge'" color="success">
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="grey" size="32">mdi-record</v-icon>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
              <v-icon size="32">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              style="width: 122px"
              @click="
                () => {
                  selectedItem = item;
                  dialogUploadJIS = true;
                }
              "
              >Upload JIS</v-list-item
            >
            <v-divider class="my-0 py-0"></v-divider>
            <v-list-item
              style="width: 122px"
              @click="
                () => {
                  selectedItem = item;
                  dialogUploadWRAS = true;
                }
              "
              >Upload WRAS</v-list-item
            >
          </v-list>
        </v-menu>
      </template>

      <!-- <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="px-0" small>
                  <v-icon size="32">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item style="width: 122px" @click="editItem(item)">Edit</v-list-item>
                <v-divider class="my-0 py-0"></v-divider>
                <v-list-item style="width: 122px" class="error--text" @click="deleteRevision(item.item_check_id)">Delete</v-list-item>
              </v-list>
            </v-menu>
          </template> -->
    </v-data-table>
    <!-- </v-card-text> -->
    <!-- <v-divider></v-divider>
        <div class="d-flex justify-end">
          <v-btn
            @click="submitBackend"
            color="primary"
            depressed
            class="text-capitalize body-1"
            style="font-weight: 600"
            height="48"
            width="125"
            :loading="loading"
            >Save</v-btn
          >
        </div>  -->

    <v-dialog v-model="dialogUploadJIS" width="650">
      <v-card>
        <v-card-title>
          Upload JIS
          <v-icon class="ml-auto" @click="dialogUploadJIS = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <upload-jis
            :selectedItem="selectedItem"
            @close="dialogUploadJIS = false"
          ></upload-jis>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUploadWRAS" width="650">
      <v-card>
        <v-card-title>
          Upload WRAS
          <v-icon class="ml-auto" @click="dialogUploadWRAS = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <upload-wras
            :selectedItem="selectedItem"
            @close="dialogUploadWRAS = false"
          ></upload-wras>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UploadJis from "@/view/components/Ledger/upload/UploadJis.vue";
import UploadWras from "@/view/components/Ledger/upload/UploadWRAS.vue";
export default {
  name: "RevisionList",
  props: {
    reviseItemChecks: {
      type: Array,
      default: () => [],
    },
    showAction: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    UploadJis,
    UploadWras,
  },
  data() {
    return {
      revisionheaders: [
        { text: "no", value: "no" },
        { text: "Submission Date", value: "start_at" },
        {
          text: "Item Check",
          align: "start",
          value: "item_check_name",
        },
        { text: "In charge", value: "in_charge" },
        { text: "from", value: "from" },
        { text: "reason", value: "revision_reason" },

        { text: "Add", value: "add" },
        { text: "periodic", value: "periodic" },
        { text: "method", value: "method" },
        { text: "delete", value: "delete" },
        { text: "mte ⇢ prd", value: "incharge_change" },

        { text: "Action", value: "actions", sortable: false },
      ],
      keywordrevision: "",
      revisionloading: false,
      loading: false,
      dialogUploadJIS: false,
      dialogUploadWRAS: false,
      selectedItem: null,
    };
  },
  methods: {
    editItem(item) {
      this.$emit("editItem", item);
    },
    deleteRevision(id) {
      this.$emit("deleteRevision", id);
    },
    submitBackend() {
      this.$emit("submitBackend");
    },
    threeDots(text, length) {
      return text.length > length ? `${text.substring(0, length)}...` : text;
    },
  },
};
</script>
