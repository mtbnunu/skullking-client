<template>
  <v-card-text>
    <v-data-table :items="finalTable" :headers="headers" item-key="id" hide-default-footer>
      <template v-slot:item.id="{ value }">
        <div>
          <v-avatar :image="`/characters/${everyone[value]?.image}.webp`" size="40"></v-avatar>
          {{ everyone[value]?.name }}

        </div>
      </template>
      <template v-slot:item.finalScore="{ value, index }">
        <v-chip :color="index === 0 ? 'primary' : value > 0 ? 'success' : ''" size="x-large">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:item.roundDetails[1]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[2]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[3]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[4]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[5]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[6]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[7]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[8]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[9]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
      <template v-slot:item.roundDetails[10]="{ value }">
        <ScoreRoundColumn v-bind="value" />
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script setup lang="ts">

const { scorecard, getScore } = useScorecard()
const { myId } = useConnectionHandler();
const { me, users } = useProfile()

const everyone = computed(() => ({ [myId.value!]: me.value, ...users.value }))

const tab = ref()

export type scoreDetail = {
  bet: number;
  winnings: number;
  roundScore: number;
  cumulativeScore: number;
}

const headers = [{
  title: 'Player',
  value: 'id'
}, {
  title: 'Final Score',
  value: 'finalScore'
}, {
  title: 'Round 1',
  value: 'roundDetails[1]'
}, {
  title: 'Round 2',
  value: 'roundDetails[2]'
}, {
  title: 'Round 3',
  value: 'roundDetails[3]'
}, {
  title: 'Round 4',
  value: 'roundDetails[4]'
}, {
  title: 'Round 5',
  value: 'roundDetails[5]'
}, {
  title: 'Round 6',
  value: 'roundDetails[6]'
}, {
  title: 'Round 7',
  value: 'roundDetails[7]'
}, {
  title: 'Round 8',
  value: 'roundDetails[8]'
}, {
  title: 'Round 9',
  value: 'roundDetails[9]'
}, {
  title: 'Round 10',
  value: 'roundDetails[10]'
}]

const finalTable = computed(() => {
  return Object.entries(scores.value).map(([id, detail]) => {
    return {
      id,
      ...detail
    }
  }).sort((a, b) => b.finalScore - a.finalScore)
})

const scores = computed(() => {
  return Object.entries(scorecard.value).reduce((a, [id, rounds]) => {
    const roundDetails = Object.entries(rounds).reduce((aa, [_round, betWinning]) => {
      const round = Number(_round)
      aa[round] = {
        bet: betWinning.bet as number,
        winnings: betWinning.winnings,
        roundScore: getScore(betWinning as { bet: number, winnings: number }, round),
        cumulativeScore: -1
      }
      return aa;
    }, {} as {
      [key: number]: scoreDetail
    })

    let finalScore = 0;
    Object.entries(roundDetails).forEach(([round, scoreDetail]) => {
      finalScore += scoreDetail.roundScore;
      scoreDetail.cumulativeScore = finalScore;
    })

    a[id] = {
      finalScore,
      roundDetails
    }


    return a;
  }, {} as
  {
    [key: string]: {
      finalScore: number,
      roundDetails: {
        [key: number]: scoreDetail
      }
    }
  })
})

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
