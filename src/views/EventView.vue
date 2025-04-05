<template>
    <div class="min-h-screen bg-white text-gray-800">
      <!-- Header -->
      <header class="bg-green-600 text-white py-8 px-6 text-center">
        <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
        <p class="text-lg">Event Details</p>
      </header>
  
      <!-- Event Details Section -->
      <section class="max-w-4xl mx-auto p-8" v-if="event">
        <div class="bg-white shadow-lg rounded-xl p-8 space-y-8">
          <!-- Event Title and Time -->
          <div>
            <h2 class="text-3xl font-semibold text-green-700">{{ event.title }}</h2>
            <p class="text-lg text-gray-600 mt-2">{{ formatDate(event.eventTime) }}</p>
          </div>
  
          <!-- Registered Users -->
          <div>
            <h3 class="text-xl font-semibold text-green-700">Registered Users</h3>
            <ul class="mt-4 space-y-2">
              <li v-for="user in event.registeredUsers" :key="user.id" class="flex justify-between">
                <span>{{ user.firstName }} {{ user.lastName }}</span>
              </li>
            </ul>
          </div>
  
          <!-- Event Location and Route -->
          <div class="mt-8">
            <h3 class="text-xl font-semibold text-green-700">Starting Location</h3>
            <p class="text-gray-600">{{ event.startingLocation }}</p>
            <div class="mt-4">
              <h4 class="text-lg font-semibold text-green-700">Route Map</h4>
              <img :src="event.routeMap" alt="Route Map" class="w-full h-auto rounded-lg shadow-md mt-2" />
            </div>
          </div>
  
          <!-- Event Description -->
          <div class="mt-8">
            <h3 class="text-xl font-semibold text-green-700">Event Description</h3>
            <p class="text-gray-600 mt-2">{{ event.description }}</p>
          </div>
  
          <!-- Download GPX File
          <div class="mt-8">
            <h3 class="text-xl font-semibold text-green-700">Download Route</h3>
            <a
              :href="event.gpxFile"
              download
              class="text-green-600 font-semibold underline mt-2 inline-block"
            >
              Download GPX File
            </a>
          </div> -->
  
          <!-- Register Button -->
          <div class="mt-8 text-center">
            <button
              @click="registerForEvent"
              class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <footer class="text-center py-6 text-sm text-gray-500">
        &copy; {{ currentYear }} Baie D'Urfé Social Run Club. All rights reserved.
      </footer>
    </div>
  </template>
  
<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getEvent } from '@/api/events'; // Assuming you have an API function to fetch event details

const route = useRoute();
const event = ref(null);
const currentYear = new Date().getFullYear();

  
// Format the event date into a human-readable format
const formatDate = (date) => {
return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
}).format(new Date(date));
};

// Register for the event function (dummy function for now)
const registerForEvent = () => {
    // This would trigger an API call to register the user for the event
    alert(`You have successfully registered for the event: ${event.value.title}`);
    // After registration, update UI, show success message, etc.
};

onMounted(async () => {
    const eventId = route.params.id;
    const response = await getEvent(eventId);
    event.value = response.data
});

</script>
  
    <style scoped>
    /* Tailwind CSS is assumed to be globally available */

    /* Style adjustments for the event details */
    img {
    transition: transform 0.3s ease;
    }

    img:hover {
    transform: scale(1.05);
    }
</style>
  