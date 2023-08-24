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

(async () => {
  const forum = await forumsStore.fetchForum({ id: props.id });
  const threads = await threadsStore.fetchThreads({ ids: forum.threads });
  await usersStore.fetchUsers({
    ids: threads.map((thread) => thread.userId),
  });
})();

const forum = computed(() => {
  const forum = findById(forumsStore.forums, props.id);
  console.log("%c forum computed :", "color: yellow", forum);
  return forum;
});

// const threads = computed(() => {
//   console.log("%c fire threads computed", "color: yellow");
//   if (threadsStore.threads.length === 0) return [];
//   if (forum.value.threads.length === 0) return [];
//   const forumThreads = forum.value.threads;
//   console.log("%c threads computed forum :", "color: yellow", forum);
//   const threads = forumThreads.map((id) => {
//     threadsStore.thread(id);
//   });
//   console.log("%c threads computed threads :", "color: yellow", threads);
//   return threads;
// });

const threads = computed(() => {
  if (
    threadsStore.threads.length === 0 ||
    !forum.value ||
    forum.value.threads === 0
  )
    return [];
  // return forum.value.threads.map((id) => {
  //   threadsStore.thread(id);
  // });
  console.log("%c getThreads() :", "color: yellow", getThreads());
  return getThreads();
});

const getThreads = () => {
  return Promise.all(
    forum.value.threads.map((id) => {
      threadsStore.thread(id);
    })
  );
};
</script>
