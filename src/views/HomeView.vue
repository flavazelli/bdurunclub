<template>
  <div class="min-h-screen bg-white text-gray-800 overflow-x-hidden">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
      <p class="text-lg">Run Together. Grow Stronger. Join the Movement.</p>
      <div class="mt-4 space-x-4">
        <router-link
          to="/login"
          class="bg-white text-green-600 font-semibold py-2 px-4 rounded hover:bg-green-100"
        >Login</router-link>
        <router-link
          to="/signup"
          class="bg-white text-green-600 font-semibold py-2 px-4 rounded hover:bg-green-100"
        >Sign Up</router-link>
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

    <!-- Ethos & Guidelines -->
    <section class="bg-white py-12 px-6 text-center border-t border-gray-200">
      <h2 class="text-3xl font-bold mb-4 text-green-700">Our Ethos & Guidelines</h2>
      <p class="text-gray-700 max-w-2xl mx-auto mb-6">
        At Baie D'Urfé Social Run Club, we prioritize safety, inclusivity, and mutual respect.
        Understanding our community guidelines ensures a positive experience for all members.
      </p>
      <router-link
        to="/ethos-and-guidelines"
        class="inline-block bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 transition"
      >
        Read Our Ethos & Guidelines
      </router-link>
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
          class="inline-block bg-white rounded-2xl shadow-md p-6 min-w-[300px] mx-2 border border-gray-200 transform transition-transform duration-300 hover:scale-105 overflow-hidden relative cursor-pointer"
          @click="handleRunClick(run)"
        >
          <h3 class="text-2xl font-semibold text-green-700 truncate">
            {{ run.name }}
          </h3>
          <p class="text-gray-600 mt-2 truncate">
            {{ formatDate(run.date) }}
          </p>
          <img
            v-if="run.canceled"
            src="@/assets/cancelled_stamp.png"
            alt="Canceled"
            class="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-green-50 py-12 text-center">
      <h2 class="text-3xl font-bold mb-4">Start Your Running Journey Today</h2>
      <p class="mb-6">Become a member and experience the power of community running.</p>
      <router-link
        to="/signup"
        class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700"
      >
        Join Now
      </router-link>
    </section>

    <!-- Private Event Modal -->
    <div
      v-if="showPrivateModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md text-center relative">
        <h3 class="text-xl font-bold mb-4 text-green-700">Members Only</h3>
        <p class="mb-6 text-gray-700">This event is only visible to members. Please log in or sign up to access it.</p>
        <div class="flex justify-center space-x-4">
          <router-link
            to="/login"
            class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >Login</router-link>
          <router-link
            to="/signup"
            class="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >Sign Up</router-link>
        </div>
        <button
          class="mt-4 text-sm text-gray-500 hover:underline"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Footer -->
    <BaseFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getEvents } from '@/api/events'
import { stringify } from 'qs-esm'
import BaseFooter from '@/components/BaseFooter.vue'

const carousel = ref(null)
const upcomingRuns = ref([])
const showPrivateModal = ref(false)
const router = useRouter()

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

let scrollInterval
let paused = false

const startAutoScroll = () => {
  scrollInterval = setInterval(() => {
    if (carousel.value && !paused) {
      const maxScrollLeft = carousel.value.scrollWidth - carousel.value.clientWidth
      if (carousel.value.scrollLeft >= maxScrollLeft) {
        carousel.value.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        carousel.value.scrollBy({ left: 310, behavior: 'smooth' })
      }
    }
  }, 4000)
}

const fetchUpcomingRuns = async () => {
  try {
    const response = await getEvents(
      stringify(
        {
          where: {
            eventTime: {
              greater_than: new Date().toISOString(),
            },
          },
          sort: 'eventTime',
        },
        { addQueryPrefix: true },
      ),
    )

    upcomingRuns.value = response.data.docs.map((event) => ({
      id: event.id,
      name: event.title,
      date: new Date(event.eventTime),
      canceled: event.canceled,
      public: event.public,
    }))
  } catch (error) {
    console.error('Failed to fetch upcoming runs:', error)
  }
}

const handleRunClick = (run) => {
  if (run.public) {
    router.push(`/events/${run.id}`)
  } else {
    showPrivateModal.value = true
  }
}

const closeModal = () => {
  showPrivateModal.value = false
}

const pauseScrolling = () => {
  paused = true
}

const resumeScrolling = () => {
  paused = false
}

// Lock scroll when modal is open
watch(showPrivateModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(() => {
  fetchUpcomingRuns()
  startAutoScroll()
})

onUnmounted(() => {
  clearInterval(scrollInterval)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Tailwind CSS is assumed globally available */
</style>
