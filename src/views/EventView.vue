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
            <h3 class="text-xl font-semibold text-green-700">Registered Members</h3>
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
          </div>
  
          <!-- Event Description -->
          <div class="mt-8">
            <h3 class="text-xl font-semibold text-green-700">Event Description</h3>
            <p class="text-gray-600 mt-2">{{ event.description }}</p>
          </div>
  
          <div class="mt-8">
            <h3 class="text-xl font-semibold text-green-700">Download Routes</h3>
            <ul class="mt-4 flex flex-wrap gap-4">
              <li v-for="(file, index) in event.gpxFile" :key="file.filename">
                <a
                :href="`${ASSETS_URL}/${file.filename}`"
                class="text-green-600 font-semibold underline transition inline-flex items-center space-x-2"
                download
                @mouseover="highlightRoute(index)"
                >
                <span>Route {{ index + 1 }}</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="w-full h-[500px] rounded-xl shadow-md border border-gray-200">
            <div ref="mapContainer" class="w-full h-full" />
          </div>

        <!-- Register Button -->
          <div class="mt-8 text-center">
            <button
              v-if="!isUserRegistered"
              @click="register"
              class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 transition"
            >
              Register
            </button>
            <button
              v-else
              @click="unregister"
              class="bg-red-600 text-white font-semibold py-3 px-6 rounded hover:bg-red-700 transition"
            >
              Unregister
            </button>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <footer class="text-center py-6 text-sm text-gray-500">
        &copy; {{ currentYear }} Baie D'Urfé Social Run Club. All rights reserved.
      </footer>
    </div>
    <!-- Survey Modal -->

    <div
      v-if="showSurveyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="closeSurveyModal"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl w-[90%] max-w-md text-center">
            <h3 class="text-2xl font-semibold text-green-700 mb-4">You registered for your first run!</h3>
            <p class="text-gray-700 mb-6">Have a minute to provide feedback? Please take a minute to complete our short survey! </p>
            <div class="flex justify-center gap-4">
              <a
                href="https://forms.gle/R9Se9K69SPVyAihu7"
                target="_blank"
                class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                @click="closeSurveyModal"
              >
                Take the Survey
              </a>
              <button
                @click="closeSurveyModal"
                class="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
              >
                Maybe Later
              </button>
            </div>
          </div>
      </div>
  </template>
  
<script setup>

import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getEvent, registerForEvent, unregisterForEvent, getMyUpcomingEvents} from '@/api/events'; // Assuming you have an API function to fetch event details
import maplibregl from 'maplibre-gl'
import * as toGeoJSON from '@tmcw/togeojson'


const showSurveyModal = ref(false);
const activeRouteIndex = ref(null)
const router = useRoute();
const event = ref(null);
const myEvents = ref([]);
const currentYear = new Date().getFullYear();
const eventId = router.params.id;
const ASSETS_URL = import.meta.env.VITE_ASSETS_URL

const mapContainer = ref(null)
let map
  
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
const register = async () => {
    await registerForEvent(eventId)

    const hasSeenSurvey = localStorage.getItem('seenSurveyModal');

    if (!hasSeenSurvey) {
      showSurveyModal.value = true;
    }
    
    myEvents.value.push(event.value);
};

const unregister = async () => {
    await unregisterForEvent(eventId)
    myEvents.value = myEvents.value.filter(myEvent => myEvent.id !== eventId);
};

const closeSurveyModal = () => {
  showSurveyModal.value = false;
  localStorage.setItem('seenSurveyModal', 'true');
};

const isUserRegistered = computed(() => {
    return myEvents.value.some(myEvent => myEvent.id === eventId);
});



const loadIcons = async (map) => {
  // Load the start icon
  map.loadImage(new URL('@/assets/start-icon.png', import.meta.url).href, (error, image) => {
    if (error) throw error;
    if (!map.hasImage('start-icon')) {
      map.addImage('start-icon', image);
    }
  });

  // Load the stop icon
  map.loadImage(new URL('@/assets/stop-icon.png', import.meta.url).href, (error, image) => {
    if (error) throw error;
    if (!map.hasImage('stop-icon')) {
      map.addImage('stop-icon', image);
    }
  });

  // Load the directional arrow icon
  map.loadImage(new URL('@/assets/arrow-icon.png', import.meta.url).href, (error, image) => {
    if (error) throw error;
    if (!map.hasImage('arrow')) {
      map.addImage('arrow', image);
    }
  });
};

const renderMap = async (map) => {
  await loadIcons(map); // Ensure icons are loaded

  for (let i = 0; i < event.value.gpxFile.length; i++) {
    const fileMeta = event.value.gpxFile[i];
    const file = await fetch(`${ASSETS_URL}/${fileMeta.filename}`).then((res) => res.blob());
    if (!file) continue;

    const reader = new FileReader();
    await new Promise((resolve) => {
      reader.onload = (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, 'application/xml');
        const geojson = toGeoJSON.gpx(xml);

        const sourceId = `route-${i}`;
        const layerId = `route-line-${i}`;

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, { type: 'geojson', data: geojson });

          // Add route line layer
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#22c55e',
              'line-width': ['case', ['==', ['literal', i], ['get', 'index']], 6, 4],
              'line-opacity': ['case', ['==', i, ['get', 'active']], 1.0, 0.4],
            },
          });

          // Add directional arrows
          map.addLayer({
            id: `${layerId}-arrows`,
            type: 'symbol',
            source: sourceId,
            layout: {
              'symbol-placement': 'line',
              'symbol-spacing': 50,
              'icon-image': 'arrow',
              'icon-size': 0.6,
            },
            paint: {
              'icon-color': '#22c55e',
            },
          });

          // Add start and stop icons
          const startCoord = geojson.features[0].geometry.coordinates[0];
          const endCoord = geojson.features[0].geometry.coordinates.slice(-1)[0];

          map.addLayer({
            id: `${layerId}-start`,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: startCoord,
                },
              },
            },
            layout: {
              'icon-image': 'start-icon',
              'icon-size': 1,
            },
          });

          map.addLayer({
            id: `${layerId}-end`,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: endCoord,
                },
              },
            },
            layout: {
              'icon-image': 'stop-icon',
              'icon-size': 1,
            },
          });
        }

        // Fit map to the first route
        if (i === 0) {
          const coords = geojson.features[0].geometry.coordinates;
          const bounds = coords.reduce(
            (b, coord) => b.extend(coord),
            new maplibregl.LngLatBounds(coords[0], coords[0])
          );
          map.fitBounds(bounds, { padding: 20 });
        }

        resolve();
      };
      reader.readAsText(file);
    });
  }
};

// Highlight the selected route when hovering
const highlightRoute = (index) => {
  if (!map) return
  activeRouteIndex.value = index

  event.value.gpxFile.forEach((_, i) => {
    const layerId = `route-line-${i}`
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-opacity', i === index ? 1 : 0.4)
      map.setPaintProperty(layerId, 'line-width', i === index ? 6 : 4)
    }
  })
}

onMounted(async () => {
    const response = await getEvent(eventId);
    event.value = response.data
    const myEventsResponse = await getMyUpcomingEvents();
    myEvents.value = myEventsResponse.data.docs

    map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`, // You can use your own style URL
    center: [-73.7, 45.4],
    zoom: 10, 
    interactive: false
    });

    map.on('load', async () => {
      await renderMap(map);
    });
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
  