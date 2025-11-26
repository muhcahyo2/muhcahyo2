<template>
  <div class="code-block-wrapper group relative my-6">
    <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click="copyCode"
        class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-colors flex items-center gap-1.5"
        :class="{ 'bg-green-600 hover:bg-green-600': copied }"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre :class="$props.class"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const copied = ref(false)

const copyCode = async () => {
  try {
    // Get the code content from the slot or props
    const codeElement = document.querySelector('.code-block-wrapper pre code')
    const code = props.code || codeElement?.textContent || ''
    
    await navigator.clipboard.writeText(code)
    copied.value = true
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<style scoped>
.code-block-wrapper {
  @apply rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700;
}

.code-block-wrapper pre {
  @apply m-0 p-6 overflow-x-auto bg-gray-50 dark:bg-gray-900;
}

.code-block-wrapper pre code {
  @apply text-sm font-mono;
}
</style>
