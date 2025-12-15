<script setup>
import LoginForm from '~/components/auth/login.vue';

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>

<template>
  <LoginForm />
</template>
