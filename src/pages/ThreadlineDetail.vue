<template>
  <AppLayout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-sm text-gray-500">Loading threadline...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading threadline</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <BaseButton @click="loadThreadline" variant="primary">
          Try again
        </BaseButton>
      </div>
    </div>

    <div v-else-if="threadline" class="space-y-6">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ threadline.summary_title || threadline.subject || 'No Subject' }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            From: {{ threadline.sender }} • {{ formatDate(threadline.received_at || threadline.created_at) }}
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <BaseButton
            @click="deleteThreadline"
            variant="danger"
            :loading="deleting"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </BaseButton>
        </div>
      </div>

      <!-- Status and Metadata -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Status</p>
              <p class="text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(threadline.status)"
                >
                  {{ threadline.status || 'Unknown' }}
                </span>
              </p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Recipients</p>
              <p class="text-sm text-gray-900">{{ threadline.recipients || 'N/A' }}</p>
            </div>
          </div>
        </BaseCard>

      </div>

      <!-- Summary Content -->
      <BaseCard title="Summary">
        <div v-if="threadline.summary_title || threadline.summary_content" class="space-y-4">
          <div v-if="threadline.summary_title">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ threadline.summary_title }}</h3>
          </div>
          <div v-if="threadline.summary_content">
            <MarkdownRenderer :content="threadline.summary_content" />
          </div>
        </div>
        <div v-else class="text-gray-500 italic text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>AI summary is being processed...</p>
          <p class="text-sm mt-2">Status: {{ threadline.status || 'pending' }}</p>
        </div>
      </BaseCard>

      <!-- LLM Content (AI Processed) -->
      <BaseCard title="Processed Content">
        <div v-if="threadline.llm_content">
          <MarkdownRenderer :content="threadline.llm_content" />
        </div>
        <div v-else class="text-gray-500 italic text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>LLM content is being processed...</p>
          <p class="text-sm mt-2">This section will show AI-processed content when available</p>
        </div>
      </BaseCard>

      <!-- Email Content (Original) -->
      <BaseCard title="Email Content">
        <div class="space-y-4">
          <!-- HTML Content -->
          <div v-if="threadline.html_content" class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-700 mb-2">HTML Content:</h4>
            <div v-html="threadline.html_content"></div>
          </div>

          <!-- Text Content -->
          <div v-if="threadline.text_content" class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Text Content:</h4>
            <div class="whitespace-pre-wrap text-gray-700">{{ threadline.text_content }}</div>
          </div>

          <!-- Raw Content (if no other content available) -->
          <div v-if="!threadline.html_content && !threadline.text_content && threadline.raw_content" class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Raw Content:</h4>
            <div class="whitespace-pre-wrap text-gray-700 text-xs">{{ threadline.raw_content }}</div>
          </div>

          <div v-if="!threadline.html_content && !threadline.text_content && !threadline.raw_content" class="text-gray-500 italic">
            No content available
          </div>
        </div>
      </BaseCard>

      <!-- Metadata/Tags -->
      <BaseCard v-if="threadline.metadata && Object.keys(threadline.metadata).length > 0" title="Metadata">
        <div class="space-y-4">
          <div v-if="threadline.metadata.keywords && threadline.metadata.keywords.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Keywords</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(keyword, index) in threadline.metadata.keywords"
                :key="index"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
          <div v-if="threadline.metadata.category" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Category</h4>
            <p class="text-sm text-gray-600">{{ threadline.metadata.category }}</p>
          </div>
          <div v-if="threadline.metadata.scene" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Scene</h4>
            <p class="text-sm text-gray-600">{{ threadline.metadata.scene }}</p>
          </div>
          <div v-if="threadline.metadata.participants && threadline.metadata.participants.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Participants</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(participant, index) in threadline.metadata.participants"
                :key="index"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
              >
                {{ participant }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>

    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import { formatDate as formatDateUtil } from '@/utils/timezone'
import { chatApi } from '@/api/chat'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const preferencesStore = usePreferencesStore()

const threadline = ref(null)
const loading = ref(false)
const error = ref('')
const deleting = ref(false)

const loadThreadline = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await chatApi.getThreadline(route.params.id)
    // Handle the actual response format from backend
    const data = response.data.data || response.data
    threadline.value = data

  } catch (err) {
    console.error('Failed to load threadline:', err)
    error.value = err.response?.data?.message || 'Failed to load threadline'
  } finally {
    loading.value = false
  }
}

const deleteThreadline = async () => {
  if (!confirm('Are you sure you want to delete this threadline?')) return

  deleting.value = true

  try {
    await chatApi.deleteThreadline(route.params.id)
    router.push('/dashboard')
  } catch (err) {
    console.error('Delete failed:', err)
  } finally {
    deleting.value = false
  }
}


const formatDate = (dateString) => {
  if (!dateString) return t('common.noData')

  // Use different date format based on language
  const dateFormat = preferencesStore.currentLanguage === 'zh-CN'
    ? 'yyyy年MM月dd日 HH:mm'
    : 'MMM dd, yyyy HH:mm'

  return formatDateUtil(
    dateString,
    preferencesStore.currentTimezone,
    dateFormat,
    preferencesStore.currentLanguage
  )
}


const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadThreadline()
})
</script>
