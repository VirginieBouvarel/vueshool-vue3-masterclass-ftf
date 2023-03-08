<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          class="form-input"
          name="content"
          rows="10"
          cols="30"
          v-model="text"
        ></textarea>
      </div>

      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["save"]);

const text = ref("");

function save() {
  const postId = "gggg" + Math.round();
  const post = {
    id: postId,
    text: text.value,
    publishedAt: Math.floor(Date.now() / 1000),
    userId: "rpbB8C6ifrYmNDufMERWfQUoa202",
  };

  emit("save", { post });
  text.value = "";
}
</script>

<style lang="scss" scoped></style>
