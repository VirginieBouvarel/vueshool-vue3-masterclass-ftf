<template>
  <h1>Welcome to the Forum</h1>
  <ForumList :forums="forums" />
</template>

<script setup>
import { reactive } from "vue";
import sourceData from "@/data.json";

const forums = reactive(sourceData.forums);
</script>

<style lang="scss" scoped></style>
