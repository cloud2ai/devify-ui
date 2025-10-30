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
      <div class="md:flex md:items-start md:justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-3">
            <h2
              class="text-xl font-bold leading-7 text-gray-900 sm:text-2xl flex-1"
              style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
            >
              {{ threadline.summary_title || threadline.subject || 'No Subject' }}
            </h2>
          </div>
          <!-- Date/Time -->
          <p class="mt-2 text-sm text-gray-500">
            {{ formatDate(threadline.received_at || threadline.created_at) }}
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          <BaseButton
            @click="goBack"
            variant="secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t('common.back') }}
          </BaseButton>
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

      <!-- Metadata Information -->
      <BaseCard v-if="threadline.metadata && Object.keys(threadline.metadata).length > 0" :title="t('chats.basicInformation')">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Category -->
          <div v-if="threadline.metadata.category" class="flex items-start space-x-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-blue-600 uppercase">{{ t('chats.category') }}</p>
              <p class="text-sm text-blue-900 font-medium">{{ threadline.metadata.category }}</p>
            </div>
          </div>

          <!-- Scene -->
          <div v-if="threadline.metadata.scene" class="flex items-start space-x-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-purple-600 uppercase">{{ t('chats.scene') }}</p>
              <p class="text-sm text-purple-900 font-medium">{{ threadline.metadata.scene }}</p>
            </div>
          </div>

          <!-- Project -->
          <div v-if="threadline.metadata.project_name" class="flex items-start space-x-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6a3 3 0 013-3h10a1 1 0 01.832 1.555L18 9l1.832 1.445A1 1 0 0120 11H8a3 3 0 01-2.12-.879L4 8.586V6zM8 18h8M8 15h8" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-indigo-600 uppercase">{{ t('chats.project') }}</p>
              <p class="text-sm text-indigo-900 font-medium">{{ threadline.metadata.project_name }}</p>
            </div>
          </div>

          <!-- Participants -->
          <div v-if="threadline.metadata.participants && threadline.metadata.participants.length > 0" class="space-y-2">
            <p class="text-xs font-medium text-gray-500 uppercase">{{ t('chats.participants') }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(p, i) in threadline.metadata.participants" :key="i"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ p }}
              </span>
            </div>
          </div>

          <!-- Locations -->
          <div v-if="threadline.metadata.locations && threadline.metadata.locations.length > 0" class="space-y-2">
            <p class="text-xs font-medium text-gray-500 uppercase">{{ t('chats.locations') }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(l, i) in threadline.metadata.locations" :key="i"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                {{ l }}
              </span>
            </div>
          </div>

          <!-- Timeline -->
          <div v-if="threadline.metadata.timeline && threadline.metadata.timeline.length > 0" class="space-y-2">
            <p class="text-xs font-medium text-gray-500 uppercase">{{ t('chats.timeline') }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(d, i) in threadline.metadata.timeline" :key="i"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {{ d }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="threadline.metadata.keywords && threadline.metadata.keywords.length > 0" class="mt-6 space-y-2">
          <p class="text-xs font-medium text-gray-500 uppercase">{{ t('chats.tags') }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(k, i) in threadline.metadata.keywords" :key="i"
              class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {{ k }}
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Summary Content -->
      <BaseCard :title="t('chats.aiSummary')">
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
          <p>{{ t('chats.summaryProcessing') }}</p>
          <p class="text-sm mt-2">{{ t('common.status') }}: {{ threadline.status || 'pending' }}</p>
        </div>
      </BaseCard>

      <!-- LLM Content (AI Processed) -->
      <BaseCard :title="t('chats.processedContent')">
        <div v-if="threadline.llm_content">
          <MarkdownRenderer :content="threadline.llm_content" />
        </div>
        <div v-else class="text-gray-500 italic text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>{{ t('chats.processedContentProcessing') }}</p>
          <p class="text-sm mt-2">{{ t('chats.processedContentDesc') }}</p>
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

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
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
