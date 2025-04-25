<template>
  <footer class="text-center py-6 text-sm text-gray-500">
    <div class="mb-2 flex justify-center gap-4 text-lg">
      <a
        href="https://www.facebook.com/groups/1336190874163065"
        target="_blank"
        rel="noopener"
        class="text-gray-500 hover:text-blue-600"
      >
        <i class="fab fa-facebook-f"></i>
      </a>
      <a
        href="https://t.me/+7lvEwYCKk_JhZDQx"
        target="_blank"
        rel="noopener"
        class="text-gray-500 hover:text-blue-400"
      >
        <i class="fab fa-telegram-plane"></i>
      </a>
      <a
        href="https://www.instagram.com/bdurunclub"
        target="_blank"
        rel="noopener"
        class="text-gray-500 hover:text-pink-500"
      >
        <i class="fab fa-instagram"></i>
      </a>
    </div>
    &copy; {{ currentYear }} Baie D'Urfé Social Run Club. All rights reserved.
  </footer>
</template>
<script setup>
const currentYear = new Date().getFullYear()
</script>
