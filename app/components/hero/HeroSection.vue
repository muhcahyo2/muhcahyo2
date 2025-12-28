<template>
  <section class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <!-- Animated Background Gradient Orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute top-1/3 -right-20 w-96 h-96 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style="animation-delay: 2s;"></div>
    </div>

    <div class="z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      
      <h1 class="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up">
        Fullstack Developer <br />
        <span class="gradient-text">
          PHP & Go Enthusiast
        </span>
      </h1>

      <p class="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
        Hai, saya <span class="text-gray-900 dark:text-white font-bold">Joko Tri Cahyo</span> 👋. 
        <br class="hidden md:block" />
        Spesialis modernisasi aplikasi 
        <span class="text-primary-600 dark:text-primary-400 font-medium">PHP & Sistem Legacy</span> 
        menggunakan <span class="text-cyan-600 dark:text-cyan-400 font-medium">Docker</span>. 
        Saat ini aktif mengeksplorasi <span class="text-cyan-600 dark:text-cyan-400 font-medium">Go (Golang)</span> 
        untuk pengembangan sistem high-performance.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.4s;">
        <NuxtLink 
          to="#portfolio"
          class="px-8 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-secondary-500/30 hover:shadow-secondary-500/50 hover:-translate-y-1"
        >
          Lihat Portfolio
        </NuxtLink>
        
        <!-- <button 
          @click="openAiChat"
          class="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-full border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          <Icon name="lucide:bot" class="w-5 h-5" /> Tanya AI Saya
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