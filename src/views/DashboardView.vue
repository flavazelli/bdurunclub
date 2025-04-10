<template>
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
        <h2 class="text-2xl font-semibold text-green-700">Total KM Run</h2>
        <p class="text-3xl font-bold text-green-600">Coming Soon</p>
      </div>
      <div class="shadow-lg p-6 rounded-xl text-center bg-green-50">
        <h2 class="text-2xl font-semibold text-green-700">Profile</h2>
        <router-link to="/members/profile" class="text-lg text-green-600 hover:text-green-800">Go to Profile</router-link>
      </div>
    </section>

    <!-- Your Registered Runs -->
    <section class="bg-white py-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Your Registered Runs</h2>
      <div v-if="registeredRuns.length === 0" class="text-center text-gray-500">
        You are not registered for any upcoming runs yet.
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="run in registeredRuns"
          :key="run.id"
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
    <section class="bg-green-100 py-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Upcoming Runs</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="run in upcomingRuns"
          :key="run.id"
          class="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all"
        >
          <router-link
            :to="`/events/${run.id}`"
          >
          <p class="block text-2xl font-semibold text-green-700" >{{ run.title }}</p>
          <p class="text-gray-600">{{ formatDate(run.eventTime) }}</p>
          <p class="text-gray-500 mt-2">Registered Users: {{ run.registeredUsers? run.registeredUsers.length : 0 }}</p>
          </router-link>

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
    <footer class="text-center py-6 text-sm text-gray-500">
      &copy; {{ currentYear }} Baie D'Urfé Social Run Club. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { stringify } from 'qs-esm';
import { useRouter } from 'vue-router';
import { getEvents, getMyUpcomingEvents, unregisterForEvent} from '@/api/events';


const currentYear = new Date().getFullYear();
const router = useRouter();

const totalRuns = ref(12); // Placeholder for total runs completed
const totalKm = ref(85); // Placeholder for total km run

// Placeholder upcoming runs
const upcomingRuns = ref([]);

// Placeholder registered runs
const registeredRuns = ref([]);

// Modal state
const showModal = ref(false);
let runToUnregister = ref(null);

// Format date function
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));
};

// Open unregister modal
const openUnregisterModal = (runId) => {
  runToUnregister.value = runId;
  showModal.value = true;
};

// Close unregister modal
const closeModal = () => {
  showModal.value = false;
  runToUnregister.value = null;
};

// Confirm unregister
const confirmUnregister = async () => {
  if (runToUnregister.value !== null) {
    await  unregisterForEvent(runToUnregister.value);
    // Remove the run from registered runs
    registeredRuns.value = registeredRuns.value.filter(run => run.id !== runToUnregister.value);

    // Optionally, you could add logic here to update the backend via API

    closeModal();
  }
};

onMounted(async () => {
  try {
    const params = {
      eventTime: {
        greater_than: new Date().toISOString(),
      },
    }

  
    const allEvents = await getEvents(stringify(
      {
        where: params, // ensure that `qs-esm` adds the `where` property, too!
      },
      { addQueryPrefix: true },
    ));


    const myEvents =  await getMyUpcomingEvents();
    upcomingRuns.value = allEvents.data.docs;
    registeredRuns.value = myEvents.data.docs;
    
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
});
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
