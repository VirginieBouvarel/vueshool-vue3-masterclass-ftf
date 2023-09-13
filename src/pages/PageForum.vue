<template>
  <div v-if="forum" class="col-full push-top">
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
    <ThreadList v-if="threads.length > 0" :threads="threads" />
  </div>
</template>

<script setup>
import { findById } from "@/helpers";
import { computed } from "vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";

const forumsStore = useForumsStore();
const threadsStore = useThreadsStore();
const usersStore = useUsersStore();

const props = defineProps({
  id: { type: String, required: true },
});

const forumData = await forumsStore.fetchForum({ id: props.id });
const threadsData = await threadsStore.fetchThreads({ ids: forumData.threads });
await usersStore.fetchUsers({
  ids: threadsData.map((thread) => thread.userId),
});

const forum = computed(() => findById(forumsStore.forums, props.id));

const threads = computed(() => {
  if (forum.value?.threads.length === 0) return [];
  return forum.value.threads.map((id) => {
    return threadsStore.thread(id);
  });
});
</script>
