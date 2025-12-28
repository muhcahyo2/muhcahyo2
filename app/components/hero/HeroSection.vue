<template>
  <section class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <!-- Animated Background Gradient Orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute top-1/3 -right-20 w-96 h-96 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 2s;"></div>
    </div>

    <!-- Content -->
    <div class="z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Main Headline -->
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-6 animate-fade-in-up">
        <span class="gradient-text">
          Fullstack Developer
        </span>
        <br />
        <span class="text-gray-800 dark:text-gray-200">
          PHP & Go Enthusiast | DevOps Savvy
        </span>
      </h1>

      <!-- Sub-headline -->
      <p class="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
        Membangun aplikasi web yang <span class="font-semibold text-primary-600 dark:text-primary-400">skalabel</span> dengan infrastruktur Docker yang <span class="font-semibold text-secondary-600 dark:text-secondary-400">efisien</span>. 
        Sedang mendalami integrasi <span class="font-semibold text-accent-600 dark:text-accent-400">AI</span> dan <span class="font-semibold text-accent-600 dark:text-accent-400">Golang</span>.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style="animation-delay: 0.4s;">
        <!-- Primary CTA -->
        <button 
          @click="scrollToPortfolio"
          class="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-2">
            Lihat Portfolio
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <!-- Secondary CTA -->
        <!-- <button 
          @click="openAiChat"
          class="group relative px-8 py-4 glass hover:glass-heavy text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat with my AI
          </span>
        </button> -->
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute cursor-pointer bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" @click="scrollToTechStack">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToPortfolio = () => {
  const portfolioSection = document.getElementById('portfolio')
  if (portfolioSection) {
    portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToTechStack = () => {
  const techStackSection = document.getElementById('tech-stack')
  if (techStackSection) {
    techStackSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const openAiChat = () => {
  // Emit event to open AI chat widget
  const event = new CustomEvent('open-ai-chat')
  window.dispatchEvent(event)
}
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>
