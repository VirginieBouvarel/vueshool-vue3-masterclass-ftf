<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing in <i>{{ thread.title }}</i>
    </h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>
<script setup>
import { findById } from "@/helpers";
import { computed, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";

const router = useRouter();
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();

const props = defineProps({
  id: { type: String, required: true },
});

const formIsDirty = ref(false);

const threadData = await threadsStore.fetchThread({ id: props.id });
await postsStore.fetchPost({ id: threadData.posts[0] });

const thread = computed(() => findById(threadsStore.threads, props.id));
const text = computed(() => {
  const post = findById(postsStore.posts, thread.value.posts[0]);
  return post ? post.text : "";
});

async function save({ title, text }) {
  const thread = await threadsStore.updateThread({
    text,
    title,
    id: props.id,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
}

function cancel() {
  router.push({ name: "ThreadShow", params: { id: props.id } });
}

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const confirmed = window.confirm(
      "Are you sure you want to leave? Unsaved changes will be lost!"
    );
    if (!confirmed) return false;
  }
});
</script>
