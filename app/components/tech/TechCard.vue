<template>
  <div class="glass rounded-2xl p-6 hover-lift group">
    <div class="flex flex-col items-center text-center space-y-3">
      <!-- Icon/Emoji -->
      <div class="text-5xl group-hover:scale-110 transition-transform duration-300">
        {{ tech.icon }}
      </div>
      
      <!-- Tech Name -->
      <h3 class="font-display font-bold text-lg text-gray-900 dark:text-white">
        {{ tech.name }}
      </h3>
      
      <!-- Category Badge -->
      <span 
        class="px-3 py-1 text-xs font-medium rounded-full"
        :class="categoryClasses"
      >
        {{ tech.category }}
      </span>
      
      <!-- Optional description -->
      <p v-if="tech.description" class="text-sm text-gray-600 dark:text-gray-400">
        {{ tech.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tech {
  name: string
  icon: string
  category: string
  description?: string
}

const props = defineProps<{
  tech: Tech
}>()

const categoryClasses = computed(() => {
  const classes: Record<string, string> = {
    'Backend': 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
    'Frontend': 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
    'Infrastructure': 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
    'Tools': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }
  return classes[props.tech.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
})
</script>
