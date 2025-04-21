<template>
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white py-8 px-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Sign Up</h1>
      <p class="text-lg">Join the Baie D'Urfé Social Run Club</p>
    </header>

    <!-- Signup Form -->
    <section class="max-w-lg mx-auto p-6 bg-white rounded-xl sm:shadow-md mt-8">
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-semibold text-gray-700">First Name</label>
          <input v-model="form.firstName" type="text" id="firstName" class="w-full p-3 mt-1 border rounded-md" required />
        </div>

        <div class="mb-4">
          <label for="lastName" class="block text-sm font-semibold text-gray-700">Last Name</label>
          <input v-model="form.lastName" type="text" id="lastName" class="w-full p-3 mt-1 border rounded-md" required />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-semibold text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" class="w-full p-3 mt-1 border rounded-md" required />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-semibold text-gray-700">Password</label>
          <input v-model="form.password" type="password" id="password" class="w-full p-3 mt-1 border rounded-md" required />
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700">Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" id="confirmPassword" class="w-full p-3 mt-1 border rounded-md" required />
        </div>

        <div v-if="errorMessage" class="text-red-500 mb-4">
          <p>{{ errorMessage }}</p>
        </div>

        <button
          :disabled="isSigningUp"
          type="submit"
          :class="[
            'w-full text-white font-semibold py-3 px-6 rounded transition',
            isSigningUp ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          ]"
        >
          Sign Up
        </button>
      </form>
    </section>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-500 ease-in-out"
      :class="{'opacity-0': !showModal, 'opacity-100': showModal}"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center opacity-100">
        <h3 class="text-xl font-semibold text-green-600 mb-4">Check Your Email!</h3>
        <p class="text-gray-600 mb-6">Please verify your email address to complete the registration process.</p>
        <router-link to="/login" class="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700">
          Go to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '../api/auth.js'; 
import { usePosthog } from '@/composables/usePosthog';

const router = useRouter();
const posthog = usePosthog();
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errorMessage = ref('');
const showModal = ref(false);
const isSigningUp = ref(false);

const handleSignup = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Passwords don't match.";
    return;
  }
  const { firstName, lastName, email, password } = form.value;

  errorMessage.value = ''; // Reset error message
  try {
    // Make the API call to the signup function
    isSigningUp.value = true;
    await signup(firstName, lastName, email, password);
    posthog.capture({
        event: 'User Signed Up', 
        properties: {
          email: email,
    }});
    showModal.value = true;
  } catch (error) {
    posthog.capture({
      event: 'User Failed to Signed Up', 
      properties: {
        email: email,
    }});
    errorMessage.value = error.response?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    isSigningUp.value = false;
  }
};
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */

/* Modal transition styles */
.fixed {
  transition: opacity 0.5s ease-in-out;
}

.bg-opacity-60 {
  opacity: 0.6;
}

.opacity-100 {
  opacity: 1;
}
</style>
