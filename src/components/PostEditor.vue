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
  const post = { text: text.value };
  emit("save", { post });
  text.value = "";
}
</script>

<style lang="scss" scoped></style>
