<template>
  <div class="bg-gray-100 p-40 min-h-screen">
    <!-- Logo -->
    <div class="flex justify-center mb-6">
      <div class="flex justify-center mb-6">
        <img
          src="/images/logo.png"
          alt="App Logo"
          class="h-12 w-auto"
        />
      </div>
    </div>
    <div class="flex items-center p-4 justify-center">
      <div class="bg-white rounded-2xl shadow-lg p-10 pb-40 w-full max-w-md border border-gray-200">
        <h1 class="text-2xl font-semibold text-center mb-2">Sign In</h1>
        <p class="text-center text-gray-500 text-sm mb-6">
          Login to continue using this app
        </p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="text-sm text-gray-600">Email</label>
            <input 
              v-model="email"
              type="email"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-600">Password</label>
              <a href="" class="text-sm text-gray-600 hover:underline">Forgot your password?</a>
            </div>

            <input 
              v-model="password"
              type="password"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    await auth.login({ email: email.value, password: password.value });
    // after login redirect
    router.push('/dashboard');
  } catch (e) {
    // error already set in store
  }
}
</script>

