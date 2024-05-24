<template>
  <v-app>
    <component :is="current.screen" />
    <!-- <Score /> -->

    <ProfileDialog />
    <ConcurCountdown />

    <v-snackbar v-model="snackbar" :timeout="timeout">
      <p v-for="text in texts" :key="text">
        {{ text }}
      </p>
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="hasErr = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useStateMachine } from "./composables/useStateMachine"
import { useSnackbar } from "./composables/useSnackbar"
import ConcurCountdown from "./components/ConcurCountdown.vue";
const { current } = useStateMachine()
const { snackbar, texts, timeout } = useSnackbar()


useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
    }
  ]
})

</script>

<style>
.center {
  text-align: center;
}

.container {
  min-width: 350px;
}
</style>
