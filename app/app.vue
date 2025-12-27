<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- Main Page Content (Routed) -->
    <NuxtPage />

    <!-- AI Chat Widget (Global) -->
    <!-- <LazyClientOnly> -->
      <!-- <AiChatWidget /> -->
    <!-- </LazyClientOnly> -->
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
