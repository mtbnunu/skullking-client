<template>
  <div class="center text-h5 ma-4" v-if="phase !== 'announceround' && phase !== 'completed'">
    Round {{ round }}
  </div>
  <RoundAnnounce v-if="phase === 'announceround'" :round="round" @done="betPhase()" />
  <RoundBet v-if="phase === 'bet'" :round="round" @done="playPhase()" />
  <RoundPlaying v-if="phase === 'play'" :round="round" @done="scorePhase()" />
  <RoundScore v-if="phase === 'score'" :round="round" @done="endCycle()" />
  <Score v-if="phase === 'completed'" />
</template>

<script setup>

import { useConnectionHandler } from "../composables/useConnectionHandler.ts"
import { useStateMachine } from "../composables/useStateMachine.ts"
import RoundPlaying from "./RoundPlaying.vue";

const phases = ["bet", "play", "score", "announceround"]

const round = ref(1)
const phase = ref("announceround")

const { roomId, peerConnections, closeRoom, isHost } = useConnectionHandler();
const { goto } = useStateMachine()

const betPhase = () => {
  phase.value = "bet"
}

const playPhase = () => {
  phase.value = "play"
}

const scorePhase = () => {
  phase.value = "score"
}

const endCycle = () => {
  if (round.value < 10) {
    round.value++;
    phase.value = "announceround"
  } else {
    phase.value = "completed"
  }
}

</script>
