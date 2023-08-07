<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
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

const props = defineProps({
  id: { type: String, required: true },
});

const { forums } = storeToRefs(useForumsStore());
const forum = computed(() =>
  forums.value.find((forum) => forum.id === props.id)
);

const threadsStores = useThreadsStore();
const threads = computed(() =>
  threadsStores.threads.filter((thread) => thread.forumId === props.id)
);
</script>
