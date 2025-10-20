<template>
  <AppLayout>
    <div class="space-y-6">
      <VirtualEmailBanner
        :virtual-email="userStore.userInfo?.virtual_email"
        :label="t('settings.emailAddressDesc')"
      />

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <dl>
                <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  {{ t('dashboard.stats.totalMessages') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalResults || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <dl>
                <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  {{ t('dashboard.stats.thisWeek') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.thisWeek || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <dl>
                <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  {{ t('dashboard.stats.pending') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.pending || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <dl>
                <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  {{ t('dashboard.stats.completed') }}
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.completed || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Email Messages List -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ t('dashboard.recentMessages') }}
            </h3>
            <BaseButton
              @click="refreshData"
              :loading="loading"
              variant="secondary"
              size="sm"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('common.refresh') }}
            </BaseButton>
          </div>
        </template>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-sm text-gray-500">{{ t('common.loading') }}</p>
        </div>

        <div v-else-if="results.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('chats.noConversations') }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ t('chats.noConversationsDesc') }}</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="result in results"
            :key="result.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewResult(result.id)"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="flex-1 min-w-0 space-y-2">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ result.summary_title || result.subject || `Email #${result.id}` }}
                </h4>
                <div class="text-sm text-gray-500 line-clamp-2">
                  <MarkdownPreview
                    v-if="result.summary_content"
                    :content="result.summary_content"
                    :max-length="150"
                  />
                  <span v-else class="break-words">{{ result.text_content || t('chats.noSummary') }}</span>
                </div>
                <div class="flex flex-wrap items-center text-xs text-gray-400 gap-x-2 gap-y-1">
                  <span class="whitespace-nowrap">{{ formatDateTime(result.received_at || result.created_at) }}</span>
                  <span class="hidden sm:inline">•</span>
                  <span class="truncate max-w-40">{{ t('chats.from') }}: {{ result.sender }}</span>
                  <span class="hidden sm:inline">•</span>
                  <span class="whitespace-nowrap">{{ t('chats.attachments', { count: result.attachments?.length || 0 }) }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="getStatusClass(result.status)"
                >
                  {{ result.status || 'Unknown' }}
                </span>
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import { useUserStore } from '@/store/user'
import { chatApi } from '@/api/chat'
import { formatDate, formatRelativeTime } from '@/utils/timezone'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MarkdownPreview from '@/components/ui/MarkdownPreview.vue'
import VirtualEmailBanner from '@/components/ui/VirtualEmailBanner.vue'

const { t } = useI18n()
const router = useRouter()
const preferencesStore = usePreferencesStore()
const userStore = useUserStore()

const loading = ref(false)
const results = ref([])
const stats = ref({
  totalResults: 0,
  thisWeek: 0,
  pending: 0,
  completed: 0
})

const loadData = async () => {
  loading.value = true

  try {
    const response = await chatApi.getThreadlines()
    // Handle the actual response format from backend
    const responseData = response.data.data || response.data
    results.value = responseData.list || responseData.results || []


    // Calculate stats
    stats.value = {
      totalResults: results.value.length,
      thisWeek: results.value.filter(r => isThisWeek(r.received_at || r.created_at)).length,
      pending: results.value.filter(r => r.status === 'pending').length,
      completed: results.value.filter(r => r.status === 'completed').length
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
}

const viewResult = (id) => {
  router.push(`/chats/${id}`)
}

const formatDateTime = (dateString) => {
  if (!dateString) return t('common.noData')
  return formatDate(
    dateString,
    preferencesStore.currentTimezone,
    'MMM dd, yyyy HH:mm',
    preferencesStore.currentLanguage
  )
}

const isThisWeek = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return date >= weekAgo
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

onMounted(async () => {
  // Ensure user data is loaded before rendering
  if (!userStore.user) {
    await userStore.checkAuthStatus()
  }
  loadData()
})
</script>
