<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="new-thread.html" class="btn-green btn-small">Start a thread</a>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { storeToRefs } from "pinia";
const { forums } = storeToRefs(useForumsStore());
const threadsStore = useThreadsStore();

const props = defineProps({
  id: { type: String, required: true },
});
const forum = computed(() => forums.find((forum) => forum.id === props.id));
const threads = computed(() =>
  threadsStore.threads.filter((thread) => thread.forumId === props.id)
);
</script>

<style lang="scss" scoped></style>
