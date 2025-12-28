<template>
  <section id="tech-stack" class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl sm:text-5xl font-display font-extrabold mb-4">
          <span class="gradient-text">Tech Stack</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          T-Shaped skill set dengan fokus pada backend development, modern frontend, dan DevOps infrastructure
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        <!-- Backend Technologies -->
        <div v-for="tech in backendTech" :key="tech.name" class="animate-scale-in">
          <TechCard :tech="tech" />
        </div>

        <!-- Frontend Technologies -->
        <div v-for="tech in frontendTech" :key="tech.name" class="animate-scale-in" style="animation-delay: 0.1s;">
          <TechCard :tech="tech" />
        </div>

        <!-- Infrastructure -->
        <div v-for="tech in infrastructureTech" :key="tech.name" class="animate-scale-in" style="animation-delay: 0.2s;">
          <TechCard :tech="tech" />
        </div>

        <!-- Tools -->
        <div v-for="tech in toolsTech" :key="tech.name" class="animate-scale-in" style="animation-delay: 0.3s;">
          <TechCard :tech="tech" />
        </div>
      </div>

      <!-- Learning Section -->
      <div class="mt-12 text-center">
        <div class="inline-flex items-center gap-2 px-6 py-3 glass rounded-full">
          <Icon name="mdi:rocket-launch" class="text-2xl text-primary-600 dark:text-primary-400" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Currently Learning: <span class="font-bold text-primary-600 dark:text-primary-400">Go (Golang)</span> & 
            <span class="font-bold text-secondary-600 dark:text-secondary-400">AI Integration</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const backendTech = [
  {
    name: 'PHP',
    icon: 'logos:php',
    category: 'Backend',
    description: 'Core language'
  },
  {
    name: 'Slim Framework',
    icon: 'https://www.slimframework.com/assets/images/favicon.png',
    category: 'Backend',
    description: 'Micro framework'
  },
  {
    name: 'Go (Learning)',
    icon: 'logos:go',
    category: 'Backend',
    description: 'Modern backend'
  },
]

const frontendTech = [
  {
    name: 'Vue.js',
    icon: 'logos:vue',
    category: 'Frontend',
    description: 'Progressive framework'
  },
  {
    name: 'Nuxt',
    icon: 'logos:nuxt-icon',
    category: 'Frontend',
    description: 'Vue meta-framework'
  },
  {
    name: 'Tailwind CSS',
    icon: 'logos:tailwindcss-icon',
    category: 'Frontend',
    description: 'Utility-first CSS'
  },
]

const infrastructureTech = [
  {
    name: 'Docker',
    icon: 'logos:docker-icon',
    category: 'Infrastructure',
    description: 'Containerization'
  },
  {
    name: 'Ubuntu Server',
    icon: 'logos:ubuntu',
    category: 'Infrastructure',
    description: 'Linux server'
  },
  {
    name: 'Nginx',
    icon: 'logos:nginx',
    category: 'Infrastructure',
    description: 'Web server'
  },
  {
    name: 'Bun',
    icon: 'logos:bun',
    category: 'Infrastructure',
    description: 'Fast runtime'
  },
]

const toolsTech = [
  {
    name: 'Git',
    icon: 'logos:git-icon',
    category: 'Tools',
    description: 'Version control'
  },
  {
    name: 'VS Code',
    icon: 'logos:visual-studio-code',
    category: 'Tools',
    description: 'Code editor'
  },
  {
    name: 'Postman',
    icon: 'logos:postman-icon',
    category: 'Tools',
    description: 'API testing'
  },
]
</script>
