<template>
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
      <p class="text-lg">Run Together. Grow Stronger. Join the Movement.</p>
      <div class="mt-4 space-x-4">
        <router-link to="/login" class="bg-white text-green-600 font-semibold py-2 px-4 rounded hover:bg-green-100">Login</router-link>
        <router-link to="/signup" class="bg-white text-green-600 font-semibold py-2 px-4 rounded hover:bg-green-100">Sign Up</router-link>
      </div>
    </header>

    <!-- Features -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <div class="shadow-lg p-6 rounded-xl text-center">
        <div class="text-green-600 text-3xl mb-2">🏃‍♀️</div>
        <h2 class="text-xl font-bold mb-2">Weekly Runs</h2>
        <p>All levels welcome. Run with us Tuesday evenings and Saturday mornings!</p>
      </div>
      <div class="shadow-lg p-6 rounded-xl text-center">
        <div class="text-green-600 text-3xl mb-2">📅</div>
        <h2 class="text-xl font-bold mb-2">Events & Races</h2>
        <p>Join community races, challenges, and training programs year-round.</p>
      </div>
      <div class="shadow-lg p-6 rounded-xl text-center">
        <div class="text-green-600 text-3xl mb-2">🤝</div>
        <h2 class="text-xl font-bold mb-2">Community Support</h2>
        <p>Meet like-minded runners, share goals, and stay inspired together.</p>
      </div>
    </section>

    <!-- Upcoming Runs Carousel -->
    <section class="bg-green-100 py-12 px-4">
      <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Upcoming Runs</h2>
      <div
        ref="carousel"
        class="overflow-x-auto whitespace-nowrap space-x-4 flex px-2 scroll-smooth"
        @mouseenter="pauseScrolling"
        @mouseleave="resumeScrolling"
      >
        <div
          v-for="run in upcomingRuns"
          :key="run.id"
          class="inline-block bg-white rounded-2xl shadow-md p-6 min-w-[300px] mx-2 border border-gray-200 transform transition-transform duration-300 hover:scale-105 overflow-hidden"
        >
          <h3 class="text-2xl font-semibold text-green-700 truncate" style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ run.name }}</h3>
          <p class="text-gray-600 mt-2 truncate" style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ formatDate(run.date) }}</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-green-50 py-12 text-center">
      <h2 class="text-3xl font-bold mb-4">Start Your Running Journey Today</h2>
      <p class="mb-6">Become a member and experience the power of community running.</p>
      <router-link to="/signup" class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700">
        Join Now
      </router-link>
    </section>

    <!-- Footer -->
    <footer class="text-center py-6 text-sm text-gray-500">
      &copy; {{ currentYear }} Baie D'Urfé Social Run Club. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getEvents } from '@/api/events';


const currentYear = new Date().getFullYear();
const carousel = ref(null);

const upcomingRuns = ref([
  { id: 1, name: 'Tuesday Evening Tempo', date: new Date('2025-04-08T18:30:00') },
  { id: 2, name: 'Saturday Sunrise Jog', date: new Date('2025-04-12T07:00:00') },
  { id: 3, name: 'Tuesday Evening Endurance', date: new Date('2025-04-15T18:30:00') },
  { id: 4, name: 'Saturday Social Long Run', date: new Date('2025-04-19T07:00:00') },
  { id: 5, name: 'Tuesday Night Intervals', date: new Date('2025-04-22T18:30:00') },
  { id: 6, name: 'Saturday Group Trail', date: new Date('2025-04-26T07:30:00') },
  { id: 7, name: 'Tuesday Sunset Sprint', date: new Date('2025-04-29T18:30:00') },
  { id: 8, name: 'Saturday City Explorer', date: new Date('2025-05-03T07:00:00') },
]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

let scrollInterval;
let paused = false;

const startAutoScroll = () => {
  scrollInterval = setInterval(() => {
    if (carousel.value && !paused) {
      const maxScrollLeft = carousel.value.scrollWidth - carousel.value.clientWidth;
      if (carousel.value.scrollLeft >= maxScrollLeft) {
        carousel.value.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.value.scrollBy({ left: 310, behavior: 'smooth' });
      }
    }
  }, 4000);
};

const fetchUpcomingRuns = async () => {
  try {
    const response = await getEvents();
    const events = response.data.docs
    // Assuming the API returns an array of events with id, name, and date properties
    upcomingRuns.value = events.map(event => ({
      name: event.title,
      date: new Date(event.eventTime),
    }));
  } catch (error) {
    console.error('Failed to fetch upcoming runs:', error);
  }
};

fetchUpcomingRuns();
const pauseScrolling = () => {
  paused = true;
};

const resumeScrolling = () => {
  paused = false;
};

onMounted(async () => {
  fetchUpcomingRuns()
  startAutoScroll();
});

onUnmounted(() => {
  clearInterval(scrollInterval);
});
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */
</style>
