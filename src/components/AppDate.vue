<template>
  <span :title="humanFriendlyDate()">
    {{ diffForHumans() }}
  </span>
</template>

<script setup>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
  timestamp: { type: Number, required: true },
});
function diffForHumans() {
  return dayjs.unix(props.timestamp).fromNow();
}
function humanFriendlyDate() {
  return dayjs.unix(props.timestamp).format("llll");
}
</script>

<style lang="scss" scoped></style>
