// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'app',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/tailwindcss'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      langs: [
        'javascript',
        'typescript',
        'vue',
        'css',
        'html',
        'bash',
        'shell',
        'json',
        'yaml',
        'markdown',
        'python',
        'sql',
        'nginx',
        'php'
      ]
    }
  },
  runtimeConfig: {
    ai: {
      provider: process.env.AI_PROVIDER || 'openai',
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      localModelEndpoint: process.env.AI_LOCAL_ENDPOINT || 'http://localhost:11434/v1',
    }
  }
})