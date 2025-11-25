<template>
  <section id="portfolio" class="py-20 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl sm:text-5xl font-display font-extrabold mb-4">
          <span class="gradient-text">Featured Projects</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Showcase projek-projek terbaik yang mendemonstrasikan kemampuan fullstack dan DevOps
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div 
          v-for="(project, index) in featuredProjects" 
          :key="project.title"
          class="animate-scale-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <ProjectCard :project="project" />
        </div>
      </div>

      <!-- Additional Note -->
      <div class="text-center">
        <div class="inline-flex items-center gap-2 px-6 py-3 glass rounded-full">
          <span class="text-xl">💡</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            More projects coming soon! Follow my 
            <a href="https://github.com" target="_blank" class="font-semibold text-primary-600 dark:text-primary-400 hover:underline">GitHub</a>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const featuredProjects = [
  {
    title: 'Smart Finance Tracker with AI',
    icon: '💰',
    description: 'Aplikasi pencatat keuangan microservice. Backend menggunakan Go Fiber untuk performa tinggi, dibungkus dalam container Docker. Menggunakan AI untuk kategorisasi otomatis transaksi dan insights keuangan.',
    tags: ['Go', 'Vue 3', 'Docker', 'AI Integration', 'Microservices'],
    status: 'In Progress',
    githubUrl: 'https://github.com/yourusername/money-tracker',
    detailUrl: '/blog/money-tracker-project',
  },
  {
    title: 'Legacy PHP Optimization',
    icon: '⚙️',
    description: 'Modernisasi aplikasi PHP konvensional dengan implementasi Docker untuk mempermudah deployment dan isolasi environment. Implementasi route caching meningkatkan performa hingga 65%.',
    tags: ['PHP 8', 'Slim Framework', 'Docker', 'Nginx', 'Performance'],
    status: 'Completed',
    githubUrl: 'https://github.com/yourusername/legacy-php-optimization',
    detailUrl: '/blog/route-caching-slim',
  },
]
</script>
