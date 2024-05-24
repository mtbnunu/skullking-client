<template>
  <v-chip prepend-icon="mdi-hand-coin" class="ma-1" color="" size="x-small">
    Bet: {{ bet }}
  </v-chip>
  <v-chip prepend-icon="mdi-circle-multiple" class="ma-1" size="x-small">
    Win: {{ winnings }}
  </v-chip>
  <v-chip class="ma-1" :color="roundScore > 0 ? 'success' : 'warning'" size="x-small">
    Score: {{ roundScore }}
  </v-chip>
  <v-chip class="ma-1" :color="cumulativeScore > 0 ? 'success' : 'warning'" size="x-small">
    Cumul: {{ cumulativeScore }}
  </v-chip>
</template>
<script setup lang="ts">
import type { scoreDetail } from './Score.vue';

const props = defineProps<scoreDetail>()
</script>
