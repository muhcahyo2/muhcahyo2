<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold gradient-text">
          ← Back to Home
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-extrabold mb-4">
          <span class="gradient-text">All Projects</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A collection of my work showcasing various technologies and solutions
        </p>
      </div>

      <!-- Filter by Technology -->
      <div v-if="allTechs.length > 0" class="mb-8 flex flex-wrap gap-2 justify-center">
        <button
          @click="selectedTech = null"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedTech === null
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          All
        </button>
        <button
          v-for="tech in allTechs"
          :key="tech"
          @click="selectedTech = tech"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedTech === tech
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          {{ tech }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-if="filteredProjects && filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project._path"
          :project="project"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600 dark:text-gray-400">No projects found.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Query all projects
const { data: projects } = await useAsyncData('all-projects', async () => {
  return await queryCollection('projects').all()
})

// Selected technology filter
const selectedTech = ref<string | null>(null)

// Get all unique technologies
const allTechs = computed(() => {
  if (!projects.value) return []
  
  const techSet = new Set<string>()
  projects.value.forEach(project => {
    project.tech?.forEach((t: string) => techSet.add(t))
  })
  
  return Array.from(techSet).sort()
})

// Filter projects by selected technology
const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (!selectedTech.value) return projects.value
  
  return projects.value.filter(project => 
    project.tech?.includes(selectedTech.value)
  )
})

// SEO Meta Tags
useHead({
  title: 'Projects - My Portfolio',
  meta: [
    { name: 'description', content: 'Browse all my projects showcasing various technologies and solutions' },
  ],
})
</script>
