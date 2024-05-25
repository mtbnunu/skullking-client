<template>
  <v-dialog v-model="editDialog" max-width="600">
    <v-card prepend-icon="mdi-hand-coin" title="What was your score?">
      <v-card-text>
        <div class="d-flex ga-2 align-center flex-wrap justify-space-evenly pa-4">
          <v-btn v-for="(_, i) in round + 1" :variant="editScore === i ? 'tonal' : 'outlined'" size="large"
            @click="() => selectScore(i)" color="blue">
            {{ i }} </v-btn>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text="Enter" block variant="tonal" size="x-large" :disabled="editScore === null"
          @click="saveAndClose"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card-text>

    <PlayerList :includeMe="true">
      <template v-slot:append="{ id }">
        <div class="animate__animated score" :class="{ animate__headShake: shake[id] }">
          <v-avatar v-for="(peer, i) in attentionArr[id]" :key="peer"
            :image="`/characters/${everyone[peer]!.image}.webp`" size="30" :style="{ left: `${i * 20}px ` }"
            class="animate__animated animate__fadeInRight"></v-avatar>
          <v-btn append-icon="$edit" variant="outlined" size='large' @click="() => openDialogFor(id)">
            {{ getWinningsValue(id!, round) }}
          </v-btn>
        </div>
      </template>
      <template v-slot:below="{ id }">
        <v-fade-transition mode="out-in">
          <div>
            <v-chip prepend-icon="mdi-hand-coin" class="ma-1" color="" size="small">
              Bet: {{ getBetValue(id!, round) }}
            </v-chip>
            <v-chip prepend-icon="mdi-circle-multiple" class="ma-1" size="small">
              Win: {{ getWinningsValue(id!, round) }}
            </v-chip>
            <v-chip class="ma-1" :color="getDiff(id, round) === 0 ? 'success' : 'warning'" size="small">
              Diff: {{ getDiff(id, round) }}
            </v-chip>
            <v-chip class="ma-1"
              :color="!getScoreById(id, round) ? '' : getScoreById(id, round)! > 0 ? 'success' : 'warning'"
              size="small">
              Score: {{ getScoreById(id, round) }}
            </v-chip>
            <v-chip class="ma-1"
              :color="!getScoreById(id, round) ? '' : getScoreById(id, round)! > 0 ? 'success' : 'warning'"
              size="small">
              Total: {{ getCumulativeScore(id) }}
            </v-chip>
          </div>
        </v-fade-transition>
      </template>
    </PlayerList>
  </v-card-text>

  <ConcurButton :concur="concur" :unconcur="unconcur" :concurredState="concurredState" v-if="round === totalWinnings">
    <template v-slot:concur>
      Agree
    </template>
    <template v-slot:unconcur>
      Hold on
    </template>
  </ConcurButton>
  <div class="pa-4" v-else>
    <v-btn color="danger" variant="tonal" :disabled="true" block size="large">
      Check again
    </v-btn>
  </div>


</template>

<script setup lang="ts">

const props = defineProps<{
  round: number
}>()
const emit = defineEmits(['done'])
const { broadcast, onData, useDataListener, isHost, peerConnections, myId } = useConnectionHandler();
const { scorecard, updateWinnings, getBetValue, getWinningsValue, getDiff, getScoreById } = useScorecard()
const { open } = useSnackbar()
const { me, users } = useProfile()

const everyone = computed(() => ({ [myId.value!]: me.value, ...users.value }))

const shake = ref<{ [key: string]: boolean }>({})
const attention = ref<{ [key: string]: Set<string> }>({})

const attentionArr = computed(() => {
  return Object.entries(attention.value).reduce((a, [k, v]) => {
    a[k] = Array.from(v)
    return a;
  }, {} as { [key: string]: Array<string> })
})

const totalWinnings = computed(() => {
  return Object.keys(everyone.value).reduce((a, c) => {
    console.log(a, c)
    return a + getWinningsValue(c, props.round)
  }, 0)
})

const callAttention = (id: string, from: string) => {
  shake.value[id] = true;
  window.setTimeout(() => {
    shake.value[id] = false
  }, 1000)

  if (id !== from) {

    if (!attention.value[id]) {
      attention.value[id] = new Set()
    }
    attention.value[id].add(from);
    window.setTimeout(() => {
      attention.value[id].delete(from)
    }, 3000)
  }
}

const getCumulativeScore = (id: string) => {
  return Array.from({ length: props.round }, (_, i) => i + 1).reduce((a, c) => {
    return a + getScoreById(id, c)!
  }, 0)
}

const { concur, unconcur, concurredState } = useConcur({
  id: `score-${props.round}`,
  onAgree: () => {
    emit("done")
  },
})

useDataListener('setscore', (d) => {
  console.log("setscore", d)
  if (d.round === props.round) {
    if (getWinningsValue(d.id, d.round) !== d.score) {
      updateWinnings(d.id, d.round, d.score)
      unconcur()
      callAttention(d.id, d.sourceId)
    }
  }
})


const openDialogFor = (id: string) => {
  editDialog.value = true;
  editScore.value = getWinningsValue(id, props.round);
  editFor.value = id;
}

onMounted(() => {
  openDialogFor(myId.value!)
})

const editDialog = ref(true)
const editScore = ref<number | null>(null)
const editFor = ref()

const selectScore = (bet: number) => {
  editScore.value = bet;
}

const saveAndClose = () => {
  if (editScore.value !== null) {
    broadcast({ action: 'setscore', round: props.round, id: editFor.value, score: editScore.value })
    editDialog.value = false
  }
}


</script>

<style>
.score {
  position: relative;

  .v-avatar {
    position: absolute;
    top: -15px;
    z-index: 11;
  }
}
</style>
