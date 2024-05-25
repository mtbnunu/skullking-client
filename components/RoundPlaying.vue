<template>
  <v-card-text>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="room">
        <div class="container">
          <div class="myBet">
            {{ getBetValue(myId!, props.round) }}
          </div>
          <PlayerTable>
            <template v-slot:append="{ id, profile, isSelf }">
              <v-chip prepend-icon="mdi-hand-coin" size="large" class="text-h6 ml-2">
                {{ getBetValue(id!, round) }}
              </v-chip>
            </template>
          </PlayerTable>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="player">

        <PlayerList :includeMe="true">
          <template v-slot:append="{ id }">
            <v-fade-transition>
              <div>
                <v-chip prepend-icon="mdi-circle-multiple" class="text-h6 mr-2"
                  :color="leadingPlayer.id === id ? 'primary' : 'default'" v-if="round > 1">
                  {{ cumulativeScores[id!] }}
                </v-chip>
                <v-chip v-if="getReadyStatus(id, round)" prepend-icon="mdi-hand-coin" size="large" class="text-h6">
                  {{ getBetValue(id, round) }}
                </v-chip>
              </div>
            </v-fade-transition>
          </template>
        </PlayerList>
      </v-tabs-window-item>

    </v-tabs-window>
  </v-card-text>



  <ConcurButton :concur="concur" :unconcur="unconcur" :concurredState="concurredState">
    <template v-slot:concur>
      Round Ended ({{ votedCount }}/2)
    </template>
    <template v-slot:unconcur>
      Nevermind
    </template>
  </ConcurButton>

  <v-tabs color="primary" fixed-tabs v-model="tab">
    <v-tab value="player">Players</v-tab>
    <v-tab value="room">Room Info</v-tab>
  </v-tabs>

</template>




<script setup lang="ts">
const props = defineProps<{
  round: number
}>()
const emit = defineEmits(['done'])
const { peerConnections, myId } = useConnectionHandler();
const { getReadyStatus, getBetValue, getScoreById } = useScorecard()
const { users, everyone } = useProfile()

const tab = ref()

const leadingPlayer = computed(() => {
  return Object.entries(cumulativeScores.value).reduce((a, [id, score]) => {
    if (!a.id) {
      return { id, score }
    }
    if (a.score > score) {
      return a
    }
    return { id, score }
  }, { id: '', score: Number.MIN_SAFE_INTEGER })
})


const cumulativeScores = computed(() => {
  return Object.keys(everyone.value).reduce((a, id) => {
    a[id] = Array.from({ length: props.round - 1 }, (_, i) => i + 1).reduce((a, c) => {
      return a + getScoreById(id, c)!
    }, 0)
    return a;
  }, {} as { [key: string]: number });
})

const { concur, unconcur, concurredState, votedCount } = useConcur({
  id: `endRound-${props.round}`, onAgree: () => {
    emit('done')
  }, gracePeriodMessage: `Round ${props.round} Ended`, quorum: 2
})


</script>

<style>
.myBet {
  font-size: 15rem;
  text-align: center;
}
</style>
