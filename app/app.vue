<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Personal Web
        </h1>
        <nav class="flex gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          <a href="#" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</a>
          <a href="#" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projects</a>
          <a href="#" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
          Intelligent Portfolio
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Welcome to my AI-enhanced personal website. Explore my background and skills through dynamically generated content and interactive chat.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <AiProfileSection section="bio" title="About Me" />
        <AiProfileSection section="skills" title="Technical Skills" />
      </div>

      <AiProfileSection section="projects" title="Featured Projects" class="mb-12" />
      
      <AiProfileSection section="experience" title="Work Experience" />
    </main>

    <AiChatWidget />
  </div>
</template>

<style>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
