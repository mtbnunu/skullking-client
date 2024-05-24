<template>
  <v-fade-transition>
    <div class="container vcenter center">
      <div>
        <div>
          Round
        </div>
        <div class="text-h1">
          {{ round }}
        </div>
      </div>
    </div>
  </v-fade-transition>
</template>




<script setup lang="ts">
const props = defineProps<{
  round: number
}>()
const emit = defineEmits(['done'])

window.setTimeout(() => {
  emit("done")
}, 1500)


</script>

<style>
.myBet {
  font-size: 15rem;
  text-align: center;
}
</style>
