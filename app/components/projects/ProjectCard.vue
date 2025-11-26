<template>
  <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift">
    <!-- Project Image/Gradient Background -->
    <div class="h-48 bg-gradient-to-br from-primary-500 to-secondary-600 relative overflow-hidden">
      <img 
        v-if="project.image" 
        :src="project.image" 
        :alt="project.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity"></div>
      <!-- Status Badge -->
      <div class="absolute top-4 right-4">
        <span 
          class="px-3 py-1 text-xs font-semibold rounded-full"
          :class="statusClasses"
        >
          {{ formatStatus(project.status) }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
        {{ project.title }}
      </h3>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in project.tech" 
          :key="tag"
          class="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {{ project.description }}
      </p>

      <!-- Actions -->
      <div class="flex gap-3">
        <a 
          v-if="project.github"
          :href="project.github" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          GitHub
        </a>
        <a 
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 glass hover:glass-heavy font-medium rounded-lg transition-all"
        >
          Live Demo
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Project {
  title: string
  description: string
  image?: string
  tech: string[]
  status?: 'completed' | 'in-progress' | 'planned'
  github?: string
  demo?: string
  featured?: boolean
  year?: number
  path?: string
}

const props = defineProps<{
  project: Project
}>()

const formatStatus = (status?: string) => {
  if (!status) return 'Completed'
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'planned': 'Planning'
  }
  return statusMap[status] || status
}

const statusClasses = computed(() => {
  const status = props.project.status || 'completed'
  const classes: Record<string, string> = {
    'in-progress': 'bg-accent-500 text-white',
    'completed': 'bg-green-500 text-white',
    'planned': 'bg-blue-500 text-white',
  }
  return classes[status] || 'bg-gray-500 text-white'
})
</script>
