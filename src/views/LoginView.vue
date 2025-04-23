<template>
  <div class="min-h-screen bg-white flex flex-col justify-center items-center px-4">
    <!-- Animated Alert Box (Centered and aligned with login box) -->
    <transition name="fade-slide" mode="out-in">
      <div
        v-if="verificationStatus"
        :key="verificationStatus"
        :class="[
          'w-full max-w-md p-4 mb-4 rounded-lg text-center font-medium transition-all duration-300',
          verificationStatus === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300',
        ]"
      >
        {{
          verificationStatus === 'success'
            ? 'Your email was verified! Login below.'
            : 'There was a problem verifying your email. Please try again.'
        }}
      </div>
    </transition>

    <!-- Login Box -->
    <div class="w-full max-w-md sm:shadow-xl p-8 rounded-2xl sm:border border-gray-100">
      <h2 class="text-3xl font-bold text-center text-green-600 mb-6">
        Login to Baie D'Urfé Social Run Club
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 text-gray-700" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-700" for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div v-if="errorMessage" class="text-red-500 mb-4">
          <p>{{ errorMessage }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700"
        >
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { usePostHog } from '@/composables/usePosthog'

const email = ref('')
const password = ref('')
const router = useRouter()
const errorMessage = ref('')
const { posthog } = usePostHog()

const handleLogin = async () => {
  errorMessage.value = '' // Reset error message
  try {
    await login(email.value, password.value)
    // Redirect to the referer or default to the dashboard
    const referer = router.currentRoute.value.query?.redirectTo || '/members/dashboard'
    posthog.capture('user logged in', {
      email: email.value,
    })
    router.push(referer)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Something went wrong. Please try again. If it's your first time logging in, please check your email for verification."
    posthog.capture('user failed to login', {
      email: email.value,
    })
  }
}

const verificationStatus = computed(() => {
  const status = router.currentRoute ? router.currentRoute.value.query?.status : null

  if (status === 'verification-success') return 'success'
  if (status === 'verification-failure') return 'failure'
  return null
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
