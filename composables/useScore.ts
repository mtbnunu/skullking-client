const scorecard = ref<{
  [id: string]: {
    [round: number]: {
      bet?: number;
      winnings: number;
    };
  };
}>({});

export const useScorecard = () => {
  const getScore = (
    { bet, winnings }: { bet: number; winnings: number },
    round: number
  ) => {
    const diff = Math.abs(winnings - bet!);

    if (diff === 0) {
      //win
      if (bet === 0) {
        return round * 10;
      } else {
        return bet * 20;
      }
    } else {
      //lose
      if (bet === 0) {
        return round * -10;
      } else {
        return diff * -10;
      }
    }
  };

  return {
    scorecard: computed(() => scorecard.value),
    updateBet: (id: string, round: number, bet?: number) => {
      scorecard.value[id] = scorecard.value[id] || {};
      scorecard.value[id][round] = { bet, winnings: 0 };
      console.log("Bet received", { id, round, bet });
      console.log("Scorecard", scorecard.value);
    },
    updateWinnings: (id: string, round: number, winnings: number) => {
      scorecard.value[id][round].winnings = winnings;
    },
    getReadyStatus: (id: string, round: number) => {
      return (
        !!scorecard.value[id] &&
        !!scorecard.value[id][round] &&
        typeof scorecard.value[id][round].bet !== "undefined"
      );
    },
    getBetValue: (id: string, round: number) => {
      return scorecard.value[id]?.[round]?.bet;
    },
    getWinningsValue: (id: string, round: number) => {
      return scorecard.value[id]?.[round]?.winnings;
    },
    getDiff: (id: string, round: number) => {
      if (
        !scorecard.value[id]?.[round]?.winnings === undefined ||
        scorecard.value[id]?.[round]?.bet === undefined
      ) {
        return null;
      }
      return (
        scorecard.value[id][round]!.winnings - scorecard.value[id][round]!.bet!
      );
    },
    getScore,
    getScoreById: (id: string, round: number) => {
      if (
        !scorecard.value[id]?.[round]?.winnings === undefined ||
        scorecard.value[id]?.[round]?.bet === undefined
      ) {
        return null;
      }

      return getScore(
        scorecard.value[id][round] as { bet: number; winnings: number },
        round
      );
    },
  };
};
