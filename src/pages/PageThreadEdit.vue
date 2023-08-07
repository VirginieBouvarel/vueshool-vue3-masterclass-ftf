<template>
  <div class="col-full push-top">
    <h1>
      Editing in <i>{{ thread.title }}</i>
    </h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";

const router = useRouter();
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();

const props = defineProps({
  id: { type: String, required: true },
});

const thread = computed(() =>
  threadsStore.threads.find((thread) => thread.id === props.id)
);
const text = computed(
  () => postsStore.posts.find((post) => post.id === thread.value.posts[0]).text
);

async function save({ title, text }) {
  const thread = await threadsStore.updateThread({
    text,
    title,
    id: props.id,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
}

function cancel() {
  router.push({ name: "Forum", params: { id: props.forumId } });
}
</script>
