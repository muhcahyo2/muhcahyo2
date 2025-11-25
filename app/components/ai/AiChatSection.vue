<template>
  <section class="py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="glass-heavy rounded-3xl p-8 md:p-12 lg:p-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Content -->
          <div class="animate-fade-in-up">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full mb-6 text-sm font-medium">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd" />
              </svg>
              AI-Powered Feature
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold mb-6">
              <span class="gradient-text">Ingin Tahu Lebih Banyak?</span>
              <br />
              <span class="text-gray-900 dark:text-white">
                Tanyakan pada AI Assistant Saya
              </span>
            </h2>

            <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              AI assistant saya sudah membaca seluruh CV, portfolio, dan technical articles. 
              Tanyakan apa saja tentang:
            </p>

            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg class="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Tech stack & project experience</span>
              </li>
              <li class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg class="w-6 h-6 text-secondary-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">DevOps & infrastructure setup</span>
              </li>
              <li class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg class="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Problem-solving approach</span>
              </li>
            </ul>

            <button 
              @click="openChat"
              class="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Conversation
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <!-- Right: Visual Demo -->
          <div class="relative animate-fade-in-up" style="animation-delay: 0.2s;">
            <!-- Chat Mockup -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <!-- Mockup Header -->
              <div class="bg-indigo-600 text-white px-4 py-3 flex items-center gap-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="font-semibold text-sm">AI Assistant</span>
              </div>
              
              <!-- Mockup Messages -->
              <div class="p-4 space-y-3 bg-gray-50 dark:bg-gray-900 h-64 overflow-hidden">
                <div class="flex justify-end">
                  <div class="bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-2 text-sm max-w-[80%]">
                    Apa tech stack yang kamu gunakan?
                  </div>
                </div>
                <div class="flex justify-start">
                  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-2 text-sm max-w-[85%] text-gray-800 dark:text-gray-200">
                    Saya menggunakan <strong>PHP 8</strong>, <strong>Go</strong>, <strong>Vue.js/Nuxt</strong> untuk frontend, dan <strong>Docker + Nginx</strong> untuk infrastructure. Sedang fokus mendalami AI integration! 🚀
                  </div>
                </div>
                <div class="flex justify-end">
                  <div class="bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-2 text-sm max-w-[80%]">
                    Ceritakan tentang project Money Tracker
                  </div>
                </div>
                <div class="flex justify-start">
                  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-2 text-sm max-w-[85%] text-gray-800 dark:text-gray-200">
                    Money Tracker adalah aplikasi...
                  </div>
                </div>
              </div>

              <!-- Mockup Input -->
              <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div class="flex gap-2 items-center">
                  <div class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-xs text-gray-500">
                    Type a message...
                  </div>
                  <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Badge -->
            <div class="absolute -top-4 -right-4 bg-gradient-to-r from-accent-400 to-accent-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-pulse">
              Try it now!
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openChat = () => {
  // Trigger AI chat widget to open
  const event = new CustomEvent('open-ai-chat')
  window.dispatchEvent(event)
}
</script>
