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
// import { computed, watch } from "vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";

const forumsStore = useForumsStore();
const threadsStore = useThreadsStore();
const usersStore = useUsersStore();

const props = defineProps({
  id: { type: String, required: true },
});

// console.log("%c top setup ", "color: yellow");

(async () => {
  const forum = await forumsStore.fetchForum({ id: props.id });
  const threads = await threadsStore.fetchThreads({ ids: forum.threads });
  // console.log("%c end fetchThreads from firebase", "color: yellow");
  await usersStore.fetchUsers({
    ids: threads.map((thread) => thread.userId),
  });
})();

const forum = computed(() => {
  const forum = findById(forumsStore.forums, props.id);
  return forum;
});

const threads = computed(() => {
  // console.log(
  //   "%c in 'threads' computed threadsStore.threads log :",
  //   "color: yellow",
  //   threadsStore.threads
  // );
  if (
    !forum.value ||
    forum.value.threads.length === 0 ||
    threadsStore.threads.length === 0
    // || threadsStore.threads.length < forum.value.threads.length
  )
    return [];
  return forum.value.threads.map((id) => {
    return threadsStore.thread(id);
  });
});

// watch(threads, (value) => {
//   console.log("%c threads :", "color: yellow", value);
// });
</script>
