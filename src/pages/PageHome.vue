<template>
  <h1>Welcome to the Forum</h1>
  <ThreadList :threads="threads" />
</template>

<script setup>
import { reactive } from "vue";
import sourceData from "@/data.json";

const threads = reactive(sourceData.threads);
</script>

<style lang="scss" scoped></style>
