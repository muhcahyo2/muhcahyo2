<template>
  <section v-if="relatedPosts.length > 0" class="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
    <h2 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
      Related Posts
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="post in relatedPosts"
        :key="post._path"
        :to="post._path"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
      >
        <!-- Image -->
        <div v-if="post.image" class="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img 
            :src="post.image" 
            :alt="post.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span 
              v-for="tag in post.tags.slice(0, 2)" 
              :key="tag"
              class="text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          
          <!-- Title -->
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {{ post.title }}
          </h3>
          
          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {{ post.description }}
          </p>
          
          <!-- Meta -->
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <time>{{ formatDate(post.date) }}</time>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { findRelatedPosts, type BlogPost } from '~/utils/blog-utils'

const props = defineProps<{
  currentPost: BlogPost
}>()

const relatedPosts = ref<BlogPost[]>([])

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Fetch all blog posts and find related ones
const { data: allPosts } = await useAsyncData('all-blog-posts', async () => {
  return await queryCollection('blog').all()
})

// Calculate related posts
if (allPosts.value && props.currentPost) {
  relatedPosts.value = findRelatedPosts(
    props.currentPost as BlogPost,
    allPosts.value as BlogPost[],
    3
  )
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
