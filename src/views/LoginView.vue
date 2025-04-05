<template>
  <div class="min-h-screen bg-white flex flex-col justify-center items-center px-4">
    <div class="w-full max-w-md shadow-xl p-8 rounded-2xl border border-gray-100">
      <h2 class="text-3xl font-bold text-center text-green-600 mb-6">Login to Baie D'Urfé Social Run Club</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 text-gray-700" for="email">Email</label>
          <input v-model="email" id="email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>

        <div>
          <label class="block mb-1 text-gray-700" for="password">Password</label>
          <input v-model="password" id="password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-4">
          <p>{{ errorMessage }}</p>
        </div>

        <button type="submit" class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700">
          Login
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?
        <router-link to="/signup" class="text-green-600 hover:underline">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = ''; // Reset error message
  try {
    await login(email.value, password.value);
    router.push('/members/dashboard');
  } catch  (error) {
    errorMessage.value = error.response?.data?.message || 'Something went wrong. Please try again.';
  }

};
</script>

<style scoped>
/* Tailwind CSS is assumed to be globally available */
</style>