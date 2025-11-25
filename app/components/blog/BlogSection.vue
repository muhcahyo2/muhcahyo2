<template>
  <section id="blog" class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl sm:text-5xl font-display font-extrabold mb-4">
          <span class="gradient-text">Latest Articles</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Sharing pengalaman, tips, dan technical insights dari journey sebagai fullstack developer
        </p>
      </div>

      <!-- Blog Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(article, index) in articles" 
          :key="article.path"
          class="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover-lift animate-scale-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Article Image/Icon -->
          <div class="h-48 bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 flex items-center justify-center">
            <span class="text-6xl">{{ article.image }}</span>
          </div>

          <!-- Article Content -->
          <div class="p-6">
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span 
                v-for="tag in article.tags.slice(0, 2)" 
                :key="tag"
                class="text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ article.title }}
            </h3>

            <!-- Excerpt -->
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {{ article.excerpt }}
            </p>

            <!-- Meta & CTA -->
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 dark:text-gray-500">
                {{ formatDate(article.date) }}
              </span>
              <NuxtLink 
                :to="`${article.path}`"
                class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 group"
              >
                Read More
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const { data: articles } = await useAsyncData('blog', () => queryCollection('blog').all())

console.log('Blog data:', articles.value)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
