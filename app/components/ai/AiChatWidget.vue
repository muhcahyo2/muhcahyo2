<script setup lang="ts">
const { 
  messages, 
  isLoading, 
  sendMessage, 
  fetchHistory, 
  isLoadingHistory, 
  hasMoreHistory 
} = useAiChat()

const { render } = useMarkdown()

const isOpen = ref(false)
const input = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const toggleChat = () => isOpen.value = !isOpen.value

const handleSubmit = async () => {
  if (!input.value.trim()) return
  const content = input.value
  input.value = ''
  await sendMessage(content)
  
  // Scroll to bottom after sending a message
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleLoadMore = async () => {
  if (!messagesContainer.value) return
  
  const oldScrollHeight = messagesContainer.value.scrollHeight
  await fetchHistory()
  
  // Keep scroll position stable after loading more messages
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight - oldScrollHeight
    }
  })
}

// Auto-scroll to bottom only when new messages are added by the user or AI,
// not when loading history.
watch(messages, (newMessages, oldMessages) => {
  if (!messagesContainer.value) return
  
  // Only auto-scroll if the new message is the last one (not history being prepended)
  if (newMessages.length > oldMessages.length) {
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage && (lastMessage.role === 'user' || (lastMessage.role === 'assistant' && lastMessage.content !== ''))) {
       nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }
  }
}, { deep: true })

onMounted(() => {
  // When chat opens, scroll to bottom
  watch(isOpen, (newIsOpen) => {
    if (newIsOpen) {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }
  })

  // Listen for external open chat events
  const handleOpenChat = () => {
    isOpen.value = true
  }
  window.addEventListener('open-ai-chat', handleOpenChat)

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('open-ai-chat', handleOpenChat)
  })
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans">
    <!-- Chat Window -->
    <div 
      v-if="isOpen"
      class="mb-4 w-[350px] h-[500px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
    >
      <!-- Header -->
      <div class="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 class="font-semibold">AI Assistant</h3>
        </div>
        <button @click="toggleChat" class="hover:bg-indigo-700 p-1 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        <div v-if="hasMoreHistory" class="text-center">
          <button 
            @click="handleLoadMore" 
            :disabled="isLoadingHistory"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
          >
            <span v-if="isLoadingHistory">Loading...</span>
            <span v-else>Load More</span>
          </button>
        </div>

        <div v-if="messages.length === 0 && !isLoadingHistory" class="text-center text-gray-500 mt-8 text-sm">
          <p class="font-medium text-gray-900 dark:text-gray-100 mb-1">Hi! I'm an AI assistant.</p>
          <p>Ask me anything about this portfolio.</p>
        </div>
        
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed"
            :class="msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm text-gray-800 dark:text-gray-200'"
          >
            <div 
              v-if="msg.role === 'user'"
              class="whitespace-pre-wrap markdown-content"
              v-html="render(msg.content)"
            ></div>
            <div 
              v-else
              class="markdown-content"
            >
              <span v-html="render(msg.content)"></span>
              <!-- Blinking cursor while typing -->
              <span 
                v-if="isLoading && idx === messages.length - 1 && msg.content"
                class="typing-cursor"
              >▊</span>
            </div>
          </div>
        </div>

        <div v-if="isLoading && messages[messages.length-1]?.role === 'user'" class="flex justify-start">
          <div class="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form @submit.prevent="handleSubmit" class="flex gap-2">
          <input 
            v-model="input"
            type="text" 
            placeholder="Type a message..." 
            class="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
            :disabled="isLoading"
          />
          <button 
            type="submit" 
            class="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            :disabled="!input.trim() || isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>

    <!-- Toggle Button -->
    <button 
      v-if="!isOpen"
      @click="toggleChat"
      class="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* Blinking cursor animation for typing effect */
.typing-cursor {
  display: inline-block;
  color: #6366f1;
  animation: cursor-blink 0.8s step-end infinite;
  margin-left: 1px;
  font-weight: normal;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
