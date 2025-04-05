<template>
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Baie D'Urfé Social Run Club</h1>
      <p class="text-lg">Your Profile</p>
    </header>

    <!-- Profile Form Section -->
    <section class="max-w-4xl mx-auto p-8">
      <div class="bg-white shadow-lg rounded-xl p-8 space-y-8">
        <div class="flex items-center space-x-6">
          <!-- Profile Picture -->
          <div class="w-24 h-24 rounded-full overflow-hidden">
            <img
              v-if="profilePicture"
              :src="profilePicture"
              alt="Profile Picture"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-200 flex justify-center items-center text-gray-400">
              <span class="text-2xl">👤</span>
            </div>
          </div>
          <div>
            <button
              @click="chooseFile"
              class="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700"
            >
              Change Picture
            </button>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />
          </div>
        </div>

        <!-- Name Update Form -->
        <div>
          <h2 class="text-2xl font-semibold text-green-700">Update Your Name</h2>
          <div class="mt-4 space-y-4">
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="firstName" class="text-gray-600">First Name</label>
                <input
                  v-model="firstName"
                  type="text"
                  id="firstName"
                  class="mt-1 block w-full border border-gray-300 rounded-xl p-3"
                  placeholder="First Name"
                />
              </div>
              <div class="flex-1">
                <label for="lastName" class="text-gray-600">Last Name</label>
                <input
                  v-model="lastName"
                  type="text"
                  id="lastName"
                  class="mt-1 block w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Password Change Form -->
        <div>
          <h2 class="text-2xl font-semibold text-green-700">Change Password</h2>
          <div class="mt-4 space-y-4">
            <div>
              <label for="currentPassword" class="text-gray-600">Current Password</label>
              <input
                v-model="currentPassword"
                type="password"
                id="currentPassword"
                class="mt-1 block w-full border border-gray-300 rounded-xl p-3"
                placeholder="Current Password"
              />
            </div>
            <div>
              <label for="newPassword" class="text-gray-600">New Password</label>
              <input
                v-model="newPassword"
                type="password"
                id="newPassword"
                class="mt-1 block w-full border border-gray-300 rounded-xl p-3"
                placeholder="New Password"
              />
            </div>
            <div>
              <label for="confirmPassword" class="text-gray-600">Confirm New Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                class="mt-1 block w-full border border-gray-300 rounded-xl p-3"
                placeholder="Confirm New Password"
              />
            </div>
          </div>
        </div>

          <!-- filepath: /Users/francislavazelli/code/bdu-run-club-web/src/views/UserProfileView.vue -->
        <div class="mt-6 text-center">
          <button
            @click="updateProfile"
            class="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 mr-4"
          >
            Update Profile
          </button>
          <button
            @click="logoutUser"
            class="bg-red-600 text-white font-semibold py-3 px-6 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <!-- Error / Success Message -->
        <div v-if="message" :class="{'text-green-600': message.success, 'text-red-600': !message.success}" class="mt-4 text-center">
          {{ message.text }}
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {logout} from '@/api/auth'; // Assuming you have a logout function in your API module

const currentYear = new Date().getFullYear();

// Profile Data
const firstName = ref('John');
const lastName = ref('Doe');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const router  = useRouter();

// Profile Picture
const profilePicture = ref(null);
const fileInput = ref(null);

// Success/Error Message
const message = ref(null);

// Function to choose file for profile picture
const chooseFile = () => {
  fileInput.value.click();
};

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// Validate form and simulate update profile
const updateProfile = () => {
  // Reset any previous messages
  message.value = null;

  // Validate password confirmation
  if (newPassword.value !== confirmPassword.value) {
    message.value = { text: 'Passwords do not match.', success: false };
    return;
  }

  // Simulate API request and update
  setTimeout(() => {
    // Normally, you would make an API call here
    message.value = { text: 'Profile updated successfully!', success: true };
  }, 1000);
};

// Function to handle logout
const logoutUser = async () => {
  await logout();
  // Redirect to the login page
  router.push('/login');

};
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */

/* Style adjustments for the profile section */
input[type="text"],
input[type="password"] {
  transition: border 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #4CAF50;
  outline: none;
}

button:hover {
  transform: scale(1.05);
}
</style>
