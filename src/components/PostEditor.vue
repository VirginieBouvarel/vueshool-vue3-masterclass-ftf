<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          class="form-input"
          name="content"
          rows="10"
          cols="30"
          v-model="postCopy.text"
        ></textarea>
      </div>

      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? "Update Post" : "Submit post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const emit = defineEmits(["save"]);

const props = defineProps({
  post: { type: Object, default: () => ({ text: null }) },
});

const postCopy = reactive({ ...props.post });

function save() {
  emit("save", { post: postCopy });
  postCopy.text = "";
}
</script>

<style lang="scss" scoped></style>
