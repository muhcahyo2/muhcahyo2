<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Terminal Logo -->
        <a href="#" class="terminal-logo group" @click.prevent="scrollToTop">
          <span class="text-xl font-mono font-bold text-orange-500 dark:text-orange-400">&gt;_</span>
          <span class="text-xl font-mono font-bold text-gray-900 dark:text-white">JTC</span>
          <span class="terminal-cursor"></span>
        </a>
        
        <!-- Navigation Links -->
        <div class="flex items-center gap-6">
          <a href="#tech-stack" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Tech Stack
          </a>
          <a href="#blog" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Blog
          </a>
          <a 
            href="https://github.com/muhcahyo2" 
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <HeroSection />

    <!-- Tech Stack Section -->
    <TechStack />

    <!-- Featured Projects Section -->
    <FeaturedProjects />

    <!-- AI Chat Promotional Section -->
    <!-- <AiChatSection /> -->

    <!-- Blog Section -->
    <BlogSection />

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <!-- About -->
          <div>
            <h3 class="text-lg font-display font-bold mb-4 gradient-text">
              About Me
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Fullstack developer dengan passion di PHP, Go, dan DevOps. Membangun aplikasi web yang skalabel dengan infrastructure modern.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-display font-bold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#portfolio" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#tech-stack" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Tech Stack
                </a>
              </li>
              <li>
                <a href="#blog" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-display font-bold mb-4 text-gray-900 dark:text-white">
              Connect
            </h3>
            <div class="flex gap-4">
              <a 
                href="https://github.com/muhcahyo2" 
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/muh-joko-tri-cahyo-182aba163" 
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:jokotricahyo129@gmail.com"
                class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                aria-label="Email"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © {{ new Date().getFullYear() }} Joko Tri Cahyo. Built with 
            <span class="text-red-500">❤️</span> using 
            <span class="font-semibold text-primary-600 dark:text-primary-400">Nuxt</span>,
            <span class="font-semibold text-secondary-600 dark:text-secondary-400">Vue</span>, and
            <span class="font-semibold text-accent-600 dark:text-accent-400">Tailwind CSS</span>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// SEO Meta tags
useHead({
  title: 'Joko Tri Cahyo - Fullstack Developer | PHP & Go Enthusiast',
  meta: [
    { name: 'description', content: 'Fullstack Developer specializing in PHP, Go, Vue.js, and DevOps. Building scalable web applications with modern infrastructure.' },
    { property: 'og:title', content: 'Joko Tri Cahyo - Fullstack Developer' },
    { property: 'og:description', content: 'Building scalable web applications with modern tech stack' },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<style scoped>
/* Terminal Logo Styles */
.terminal-logo {
  @apply flex items-center no-underline;
}

.terminal-cursor {
  @apply inline-block w-2 h-5 bg-orange-500 dark:bg-orange-400 ml-0.5;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
