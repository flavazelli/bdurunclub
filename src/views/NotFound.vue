<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800 px-6">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 class="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved. Let’s get you back on track.
        </p>
        <RouterLink
          to="/"
          class="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Return to Home
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  </script>
  
  <style scoped>
  /* Tailwind styles assumed globally available */
  </style>
  