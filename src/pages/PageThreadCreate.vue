<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>
    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useForumsStore } from "@/stores/ForumsStore";

const router = useRouter();
const threadsStore = useThreadsStore();
const forumsStore = useForumsStore();

const props = defineProps({
  forumId: { type: String, required: true },
});

const forum = computed(() =>
  forumsStore.forums.find((forum) => forum.id === props.forumId)
);

async function save({ title, text }) {
  const thread = await threadsStore.createThread({
    text,
    title,
    forumId: props.forumId,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
}

function cancel() {
  router.push({ name: "Forum", params: { id: props.forumId } });
}
</script>
