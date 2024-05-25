<template>
  <div class="d-flex ga-4 pa-4 justify-space-evenly overflow-x-scroll">

    <v-sheet v-for="peer in peers" :key="peer.id" border rounded class="px-4 py-2 d-flex justify-center flex-wrap ga-2">
      <v-avatar :image="`/characters/${peer.profile?.image}.webp`" size="40"></v-avatar>
      <slot name="append" :id="peer.id" :profile="peer" :isSelf="false"></slot>
    </v-sheet>
  </div>

</template>

<script setup lang="ts">


const { me, users, everyone } = useProfile()
const { peerConnections, myId } = useConnectionHandler();

const peers = computed(() => {
  return Object.entries(everyone.value).map(([id, profile]) => {
    return {
      id, profile
    }
  })
})

</script>
