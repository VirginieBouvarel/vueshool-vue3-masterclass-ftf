import { ref } from "vue";

export function useAsyncDataStatus() {
  const ready = ref(false);

  function setReadyStatus() {
    console.log("%c async data are loaded !", "color: yellow");
    ready.value = true;
  }

  return { ready, setReadyStatus };
}
