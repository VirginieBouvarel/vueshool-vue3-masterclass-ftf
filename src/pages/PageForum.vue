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

const props = defineProps({
  id: { type: String, required: true },
});

const forumsStore = useForumsStore();
const forum = computed(() =>
  forumsStore.forums.find((forum) => forum.id === props.id)
);

const threadsStores = useThreadsStore();
const threads = computed(() =>
  threadsStores.threads.filter((thread) => thread.forumId === props.id)
);
</script>

<style lang="scss" scoped></style>
