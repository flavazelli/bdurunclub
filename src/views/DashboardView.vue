<template>
  <VTour :steps="appTourSteps" ref="vTour" highlight autoStart />
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
      <p class="text-lg">Your Dashboard</p>
    </header>

    <!-- Stats Dashboard -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      <div class="shadow-lg p-6 rounded-xl text-center bg-green-50">
        <h2 class="text-2xl font-semibold text-green-700">Total Runs Completed</h2>
        <p class="text-3xl font-bold text-green-600">Coming Soon</p>
      </div>
      <div class="shadow-lg p-6 rounded-xl text-center bg-green-50">
        <h2 class="text-2xl font-semibold text-green-700">Profile</h2>
        <router-link
          to="/members/profile"
          class="update-profile text-lg text-green-600 hover:text-green-800"
          >Go to Profile</router-link
        >
      </div>
    </section>

    <!-- Your Registered Runs -->
    <section class="registered-runs bg-white py-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Your Registered Runs</h2>
      <div v-if="isRunsLoading" class="flex flex-col justify-center items-center h-40">
        <div class="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-green-700 text-lg">Loading registered runs…</p>
      </div>
      <div v-else-if="registeredRuns.length === 0" class="text-center text-gray-500">
        You are not registered for any upcoming runs yet.
      </div>
      <div  v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="run in registeredRuns"
            :key="'registered-' + run.id"
          class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all"
        >
          <router-link
            :to="`/events/${run.id}`"
            class="block text-2xl font-semibold text-green-700"
          >
            {{ run.title }}
          </router-link>
          <p class="text-gray-600">{{ formatDate(run.eventTime) }}</p>
          <button
            @click="openUnregisterModal(run.id)"
            class="mt-2 bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700"
          >
            Unregister
          </button>
        </div>
      </div>
    </section>

    <!-- Upcoming Runs -->
    <section class="upcoming-runs bg-green-100 py-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Upcoming Runs</h2>

      <div v-if="isRunsLoading" class="flex flex-col justify-center items-center h-40">
        <div class="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-green-700 text-lg">Load ing upcoming runs…</p>
      </div>
      <div v-else-if="upcomingRuns.length == 0" class="flex flex-col justify-center items-center">
        <p class="mt-4 text-green-700">No more runs are scheduled this week. Check back on Thursday evening!</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="run in upcomingRuns"
          :key="run.id"
          class="run-card bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all relative"
        >
          <router-link :to="`/events/${run.id}`">
            <p class="block text-2xl font-semibold text-green-700">{{ run.title }}</p>
            <p class="text-gray-600">{{ formatDate(run.eventTime) }}</p>
            <p class="text-gray-500 mt-2">
              Registered Users: {{ run.registeredUsers ? run.registeredUsers.length : 0 }}
            </p>
          </router-link>
          <img
            v-if="run.canceled"
            src="@/assets/cancelled_stamp.png"
            alt="Cancelled"
            class="absolute top-0 left-0 w-full h-full object-cover opacity-50 pointer-events-none"
          />
        </div>
      </div>
    </section>


    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl w-96">
        <h3 class="text-2xl font-semibold text-green-700 text-center mb-4">
          Are you sure you want to unregister?
        </h3>
        <div class="flex justify-around">
          <button
            @click="confirmUnregister"
            class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            @click="closeModal"
            class="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <BaseFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { stringify } from 'qs-esm'
import { getEvents, getMyUpcomingEvents, unregisterForEvent } from '@/api/events'
import { appTourSteps } from '@/tours/appTour'
import { VTour } from '@globalhive/vuejs-tour'
import BaseFooter from '@/components/BaseFooter.vue'
import '@globalhive/vuejs-tour/dist/style.css'
import { usePostHog } from '@/composables/usePosthog'

const { posthog } = usePostHog()

posthog.setPersonPropertiesForFlags({'email': 'value'})
const vTour = ref()
const totalRuns = ref(12) // Placeholder for total runs completed
// Placeholder upcoming runs
const isRunsLoading = ref(true)
const upcomingRuns = ref([])
// Placeholder registered runs
const registeredRuns = ref([])
// Modal state
const showModal = ref(false)
let runToUnregister = ref(null)


// Format date function
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date))
}

// Open unregister modal
const openUnregisterModal = (runId) => {
  runToUnregister.value = runId
  showModal.value = true
}

// Close unregister modal
const closeModal = () => {
  showModal.value = false
  runToUnregister.value = null
}

// Confirm unregister
const confirmUnregister = async () => {
  if (runToUnregister.value !== null) {
    await unregisterForEvent(runToUnregister.value)
    posthog.capture('user unregistered from event', { eventId: runToUnregister.value })
    // Remove the run from registered runs
    registeredRuns.value = registeredRuns.value.filter((run) => run.id !== runToUnregister.value)
    closeModal()
  }
}

onMounted(async () => {
  try {
    const params = {
      eventTime: {
        greater_than: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
    }
    const allEvents = await getEvents(
      stringify(
        {
          where: params, // ensure that `qs-esm` adds the `where` property, too!
          sort: 'eventTime',

        },
        { addQueryPrefix: true },
      ),
    )
    

    const myEvents = await getMyUpcomingEvents()
    upcomingRuns.value = allEvents.data.docs

    for (const event of upcomingRuns.value) {
      if (event.id == '68043c61453c4740fa5a21b0' || event.title == "New Members Clinic") {
        if (posthog.getFeatureFlag('clinic-vs-meet-greet') === 'test') {
          upcomingRuns.value = upcomingRuns.value.map((run) =>
            run.id === event.id ? { ...run, title: "New Members Meet and Greet" } : run
          )
        } else if (posthog.getFeatureFlag('clinic-vs-meet-greet') === 'control'){
            return;
        }
      }
    }
 
    registeredRuns.value = myEvents.data.docs
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    isRunsLoading.value = false
  }
})
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */

/* Hover effect for upcoming run cards */
.cursor-pointer:hover {
  transform: scale(1.05);
}

/* Hover effect for registered run cards */
.hover:shadow-xl {
  transition: box-shadow 0.3s ease;
}

/* Modal Background */
.bg-black.bg-opacity-50 {
  transition: opacity 0.3s ease;
}
</style>
