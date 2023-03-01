<script setup>
import { reactive } from "vue";
import sourceData from "@/data.json";
import ThreadList from "@/components/ThreadList.vue";

const threads = reactive(sourceData.threads);
</script>

<template>
  <h1>Welcome to the Forum</h1>
  <ThreadList :threads="threads" />
</template>

<style lang="scss" scoped></style>
