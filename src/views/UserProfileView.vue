<template>
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
      <p class="text-lg">Your Profile</p>
    </header>

    <!-- Profile Form Section -->
    <section class="max-w-4xl mx-auto p-0 sm:p-8">
      <div class="bg-white sm:shadow-lg rounded-xl p-8 space-y-8">
        <!-- Level Selection -->
        <div>
          <h2 class="text-2xl font-semibold text-green-700">Level</h2>
          <div class="mt-4 space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="level" value="beginner" class="form-radio" />
              <span class="ml-2">Beginner</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="level" value="intermediate" class="form-radio" />
              <span class="ml-2">Intermediate</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="level" value="advanced" class="form-radio" />
              <span class="ml-2">Advanced</span>
            </label>
          </div>
        </div>

        <!-- Baie D'Urfé Resident Checkbox -->
        <div>
          <h2 class="text-2xl font-semibold text-green-700">Are you a Baie D'Urfé resident?</h2>
          <div class="mt-4">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="isResident" class="form-checkbox" />
              <span class="ml-2">Yes</span>
            </label>
          </div>
        </div>

        <!-- Conversational Pace Dropdown -->
        <div>
          <h2 class="text-2xl font-semibold text-green-700">Conversational Pace</h2>
          <div class="mt-4">
            <select v-model="pace" class="w-full border border-gray-300 rounded-xl p-3">
              <option disabled value="">Select Pace</option>
              <option v-for="time in paceOptions" :key="time" :value="time">
                {{ time }} min/km
              </option>
            </select>
          </div>
        </div>

        <p class="mt-2 text-green-700">
          Member since:
          {{
            new Date(memberSince).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </p>

        <!-- Disclaimer -->
        <div class="mt-4 text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> The information you provide, including your level,
            residency status, and conversational pace, will only be used to understand the
            demographic composition of the Baie D'Urfé Social Run Club. Your data will never be
            shared with third parties.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 text-center">
          <button
            @click="updateProfile"
            class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 mr-4"
          >
            Update Profile
          </button>
          <button
            @click="logoutUser"
            class="bg-gray-600 text-white font-semibold py-3 px-6 rounded hover:bg-gray-700 mr-4"
          >
            Logout
          </button>
          <!-- <button
        @click="openDeleteModal"
        class="bg-red-600 text-white font-semibold py-3 px-6 rounded hover:bg-red-700"
        >
        Delete Account
        </button> -->
        </div>

        <!-- Error / Success Message -->
        <div
          v-if="message"
          :class="{ 'text-green-600': message.success, 'text-red-600': !message.success }"
          class="mt-4 text-center"
        >
          {{ message.text }}
        </div>
      </div>
    </section>
    <BaseFooter/>
    <!-- Warning Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 class="text-xl font-semibold text-red-600">Are you sure?</h2>
        <p class="mt-4 text-gray-700">
          This action is irreversible. Are you sure you want to delete your account?
        </p>
        <div class="mt-4 flex justify-end">
          <button @click="closeDeleteModal" class="bg-gray-300 text-black py-2 px-4 rounded mr-4">
            Cancel
          </button>
          <button @click="deleteAccount" class="bg-red-600 text-white py-2 px-4 rounded">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, getLoggedInUser, updateUser } from '@/api/auth'
import { usePostHog } from '@/composables/usePosthog'
import BaseFooter from '@/components/BaseFooter.vue'

const currentYear = new Date().getFullYear()
const { posthog } = usePostHog()
// Profile Data
const level = ref('Beginner')
const isResident = ref(false)
const pace = ref('')
const userId = ref(null)
const memberSince = ref(new Date())
const router = useRouter()

// Success/Error Message
const message = ref(null)

// Show/Hide Modal
const showModal = ref(false)

// Generate an array of conversational pace options from 4:00 to 8:00 in 10-second increments
const paceOptions = Array.from({ length: 25 }, (_, i) => {
  const minutes = 4 + Math.floor((i * 10) / 60)
  const seconds = (i * 10) % 60
  const time = `${minutes}:${seconds.toString().padStart(2, '0')}`
  return time
})

// Validate form and simulate update profile
const updateProfile = async () => {
  // Reset any previous messages
  message.value = null

  await updateUser(userId.value, {
    level: level.value,
    bduResident: isResident.value,
    pace: pace.value,
  })

  message.value = { text: 'Profile updated successfully!', success: true }
  posthog.capture('user updated profile')
}

// Function to handle logout
const logoutUser = async () => {
  await logout()
  posthog.reset()
  // Redirect to the login page
  router.push('/login')
}

// Function to open the delete account modal
const openDeleteModal = () => {
  showModal.value = true
}

// Function to close the delete account modal
const closeDeleteModal = () => {
  showModal.value = false
}

// Function to handle account deletion
const deleteAccount = async () => {
  // Simulate account deletion (API call should go here)
  message.value = { text: 'Account deleted successfully!', success: true }
  setTimeout(() => {
    router.push('/signup') // Redirect to sign-up page after account deletion
  }, 1000)
}

onMounted(async () => {
  try {
    // Fetch user data when the component mounts
    const response = await getLoggedInUser()
    memberSince.value = response.data.user.createdAt
    userId.value = response.data.user.id
    level.value = response.data.user.level || 'beginner'
    isResident.value = response.data.user.bduResident || false
    pace.value = response.data.user.pace || ''
  } catch (error) {
    console.error('Error fetching user data:', error)
    message.value = { text: 'Failed to fetch user data.', success: false }
  }
})
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */

/* Style adjustments for the profile section */
select {
  transition: border 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

.modal-overlay {
  z-index: 999;
}

.modal-content {
  max-width: 400px;
}
</style>
