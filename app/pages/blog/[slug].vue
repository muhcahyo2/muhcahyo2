<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold gradient-text">
          ← Back to Home
        </NuxtLink>
      </div>
    </header>

    <!-- Article Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article v-if="data" class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12">
        <!-- Article Header -->
        <header class="mb-8">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in data.tags" 
              :key="tag"
              class="text-xs font-medium px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white mb-4">
            {{ data.title }}
          </h1>

          <!-- Meta -->
          <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
            <span>By {{ data.author }}</span>
            <span>•</span>
            <time>{{ formatDate(data.date) }}</time>
          </div>
        </header>

        <!-- Article Body with Markdown Rendering -->
        <div class="prose prose-lg dark:prose-invert max-w-none markdown-content">
          <ContentRenderer :value="data">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>

        <!-- Share Section -->
        <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <p class="text-gray-600 dark:text-gray-400">
              Enjoyed this article? Share it with others!
            </p>
            <div class="flex gap-3">
              <button 
                @click="shareOnTwitter"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Share on X
              </button>
            </div>
          </div>
        </footer>
      </article>

      <!-- Loading State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600 dark:text-gray-400">Loading article...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

const route = useRoute()
const slug = route.params.slug as string

// Query the blog post using Nuxt Content
const { data, error, pending } = await useAsyncData(`blog-${slug}`, async () => {
  try {
    const all = await queryCollection('blog').all()
    console.log('All blog posts:', all)
    const result = await queryCollection('blog').path(`/blog/${slug}`).first()
    console.log('Querying blog:', slug, 'Result:', result)
    return result
  } catch (err) {
    console.error('Content query error:', err)
    throw err
  }
})

console.log('Blog data:', data.value)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const shareOnTwitter = () => {
  if (data.value) {
    const url = window.location.href
    const text = encodeURIComponent(data.value.title)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }
}

// SEO Meta Tags
useHead({
  title: computed(() => data.value?.title || 'Blog Post'),
  meta: [
    { name: 'description', content: computed(() => data.value?.description || '') },
    { property: 'og:title', content: computed(() => data.value?.title || '') },
    { property: 'og:description', content: computed(() => data.value?.description || '') },
    { property: 'og:type', content: 'article' },
  ],
})
</script>

<style>
/* Enhanced Prose Styles for Blog Content */
.prose {
  @apply text-gray-800 dark:text-gray-200;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  @apply font-display font-bold text-gray-900 dark:text-white;
}

.prose h1 { @apply text-4xl mb-6 mt-8; }
.prose h2 { @apply text-3xl mb-5 mt-8; }
.prose h3 { @apply text-2xl mb-4 mt-6; }
.prose h4 { @apply text-xl mb-3 mt-5; }

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm text-pink-600 dark:text-pink-400;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6 mt-4 border border-gray-700;
}

.prose pre code {
  @apply bg-transparent p-0 text-sm text-gray-100;
}

.prose a {
  @apply text-primary-600 dark:text-primary-400 hover:underline font-medium;
}

.prose strong {
  @apply font-bold text-gray-900 dark:text-white;
}

.prose ul, .prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-primary-500 pl-6 italic my-6 text-gray-700 dark:text-gray-300;
}
</style>
