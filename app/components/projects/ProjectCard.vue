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
        <NuxtLink
          v-if="project.caseStudy"
          :to="project.caseStudy"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          View Case Study
        </NuxtLink>
        <a 
          v-if="project.github"
          :href="project.github" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Icon name="mdi:github" class="w-5 h-5" />
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
  status?: 'completed' | 'in-progress' | 'planned' | 'production-success' | 'work-in-progress'
  github?: string
  demo?: string
  featured?: boolean
  year?: number
  path?: string
  caseStudy?: string | null
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
