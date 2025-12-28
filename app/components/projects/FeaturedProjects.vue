<template>
  <section id="portfolio" class="py-20 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl sm:text-5xl font-display font-extrabold mb-4">
          <span class="gradient-text">Featured Projects</span>
        </h2>
        <!-- <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Showcase projek-projek terbaik yang mendemonstrasikan kemampuan fullstack dan DevOps
        </p> -->
      </div>

      <div v-if="featuredProjects && featuredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="(project, index) in featuredProjects" 
          :key="project.path || index"
          class="animate-scale-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <ProjectCard :project="project" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>

      <!-- Additional Note -->
      <div class="text-center">
        <NuxtLink 
          to="/projects"
          class="inline-flex items-center gap-2 px-6 py-3 glass hover:glass-heavy rounded-full transition-all"
        >
          <span class="text-xl">💡</span>
          <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">
            View All Projects
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Query featured projects from content collection
const { data: featuredProjects } = await useAsyncData('featured-projects', async () => {
  const projects = await queryCollection('projects').all()
  
  // Filter featured projects
  return projects.filter((p: any) => p.featured === true)
})
</script>
