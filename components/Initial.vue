<template>
  <div class="vcenter">
    <div class="container">

      <v-fade-transition mode="out-in">
        <div v-if="!loading">
          <h1>SkullKing Scores</h1>
          <v-sheet border rounded class="my-4 pa-4">
            <div class="center muted">
              Pick your name
            </div>
            <div class="d-flex ga-8 align-center ">
              <v-avatar :image="`/characters/${me.image}.webp`" size="60"></v-avatar>
              <div class="align-center text-h6">{{ me.name }}</div>
              <v-btn icon="$edit" variant="plain" size="small" class="muted" @click="openEditProfile">
              </v-btn>
            </div>
          </v-sheet>
          <div class="pt-12">
            <v-btn prepend-icon="$plus" variant="tonal" block @click="host" size="x-large" :loading="loading"
              color="primary">
              Host New Game
            </v-btn>
          </div>

          <div class="or">
            or
          </div>

          <v-text-field v-model="joinRoomId" type="text" single-line variant="outlined" label="Enter Room Code"
            clearable class="roomcode" />
          <v-btn prepend-icon="$next" variant="tonal" block @click="join" :loading="loading" size="x-large"
            color="primary">
            Join

          </v-btn>
        </div>
        <div v-else class="center">
          <v-progress-circular color="primary" indeterminate :size="128" :width="5"></v-progress-circular>
        </div>
      </v-fade-transition>
      <div class="muted center mt-12 small">
        2024. Jae Bae
        <br> hi@jaeb.ae
      </div>
    </div>
  </div>
</template>
<script setup>

import { useConnectionHandler } from "../composables/useConnectionHandler.ts"
import { useStateMachine } from "../composables/useStateMachine.ts"

const route = useRoute();
const router = useRouter();
const prefill = computed(() => {
  return route.path?.split?.("/")?.[1] || ''
})

const { createRoom, joinRoom, onConnected, errorText, broadcast } = useConnectionHandler()
const { goto } = useStateMachine()
const { me, openEditProfile } = useProfile()
const joinRoomId = ref("")
const loading = ref(true)

const { open } = useSnackbar()

const host = async () => {
  loading.value = true;
  const room = await createRoom();
  loading.value = false;

  goto('waiting')
}
const join = async () => {
  loading.value = true;
  try {
    await joinRoom(joinRoomId.value)

    // const iam = useProfile()
    // broadcast({ action: "iam", data: iam })

    goto('waiting')
  } catch (e) {
    open("Failed to join")
    loading.value = false;
    return true;
  }
}


onMounted(() => {
  if (prefill.value) {
    joinRoomId.value = prefill.value
    if (join()) {
      joinRoomId.value = ""
      console.log("??")
      window.history.replaceState(null, '', '/');
      // router.replace("")
    }
  } else {
    loading.value = false
  }
})

</script>
<style scoped>
h1 {
  margin-bottom: 1em;
}

.or {
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
}

.muted {
  color: #aaa;
}

.roomcode {

  .v-label {
    width: 100%;
    text-align: center;
  }

  input {
    text-align: center;
  }
}
.small {
  font-size: 0.7em;
}
</style>
