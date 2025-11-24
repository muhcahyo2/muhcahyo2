<script setup lang="ts">
const props = defineProps<{
  section: string
  title?: string
}>()

const { data, pending, error } = await useFetch(`/api/ai/profile/${props.section}`, {
  lazy: true,
  server: false,
  key: `ai-profile-${props.section}`
})

const { render } = useMarkdown()
</script>

<template>
  <div class="ai-profile-section p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div v-if="title" class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    
    <div v-else-if="error" class="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      Failed to generate content. Please try again later.
    </div>
    
    <div v-else class="prose dark:prose-invert max-w-none">
      <h2 v-if="title" class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{{ title }}</h2>
      <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed markdown-content" v-html="render(data?.content || '')"></div>
    </div>
  </div>
</template>
