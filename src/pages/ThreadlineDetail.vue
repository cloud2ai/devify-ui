<template>
  <AppLayout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-sm text-gray-500">{{ t('common.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('chats.errorLoading') }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <BaseButton @click="loadThreadline" variant="primary">
          {{ t('common.tryAgain') }}
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
              {{ threadline.summary_title || threadline.subject || t('common.noSubject') }}
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
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </div>

      <!-- Metadata Information -->
      <div class="relative">
        <BaseCard v-if="threadline.metadata" :header-muted="true">
          <template #header>
            <div class="flex items-center gap-2 text-gray-800">
              <svg class="w-5 h-5 -mt-px flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <h3 class="text-base font-semibold leading-5">{{ t('metadata.sectionTitle') }}</h3>
            </div>
          </template>
          <template #default>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 分类 -->
              <div class="p-3 rounded-lg border border-blue-100 bg-blue-50">
                <p class="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5l7 7-7 7H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                  </svg>
                  {{ t('metadata.category.title') }}
                </p>
                <p class="text-xs text-blue-600/70 mb-2">{{ t('metadata.category.desc') }}</p>
                <MetadataChipsEditor
                  :model-value="threadline.metadata.category || ''"
                  :disabled="isSaving('category')"
                  variant="blue"
                  @update:modelValue="v => onChipsChange('category', v)"
                  @change="v => onChipsSave('category', v)"
                />
                <p v-if="fieldError('category')" class="mt-2 text-xs text-red-600">{{ fieldError('category') }}</p>
              </div>

              <!-- 参与者 -->
              <div class="p-3 rounded-lg border border-green-100 bg-green-50">
                <p class="text-sm font-semibold text-green-700 mb-1 flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-5.13a4 4 0 11-8 0 4 4 0 018 0zM7 10a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  {{ t('metadata.participants.title') }}
                </p>
                <p class="text-xs text-green-700/70 mb-2">{{ t('metadata.participants.desc') }}</p>
                <MetadataChipsEditor
                  :model-value="threadline.metadata.participants || []"
                  :disabled="isSaving('participants')"
                  variant="green"
                  @update:modelValue="v => onChipsChange('participants', v)"
                  @change="v => onChipsSave('participants', v)"
                />
                <p v-if="fieldError('participants')" class="mt-2 text-xs text-red-600">{{ fieldError('participants') }}</p>
              </div>

              <!-- 时间线 -->
              <div class="p-3 rounded-lg border border-purple-100 bg-purple-50">
                <p class="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ t('metadata.timeline.title') }}
                </p>
                <p class="text-xs text-purple-700/70 mb-2">{{ t('metadata.timeline.desc') }}</p>
                <MetadataChipsEditor
                  :model-value="threadline.metadata.timeline || []"
                  :disabled="isSaving('timeline')"
                  variant="purple"
                  @update:modelValue="v => onChipsChange('timeline', v)"
                  @change="v => onChipsSave('timeline', v)"
                />
                <p v-if="fieldError('timeline')" class="mt-2 text-xs text-red-600">{{ fieldError('timeline') }}</p>
              </div>
            </div>

            <!-- 标签独立一行 -->
            <div class="mt-4 p-3 rounded-lg border border-rose-100 bg-rose-50">
              <p class="text-sm font-semibold text-rose-700 mb-1 flex items-center gap-2">
                <svg class="w-4 h-4 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M3 7a4 4 0 014-4h5l7 7a2 2 0 010 2.828l-5.172 5.172a2 2 0 01-2.828 0L3 12V7z" />
                </svg>
                {{ t('metadata.keywords.title') }}
              </p>
              <p class="text-xs text-rose-700/70 mb-2">{{ t('metadata.keywords.desc') }}</p>
              <MetadataChipsEditor
                :model-value="threadline.metadata.keywords || []"
                :disabled="isSaving('keywords')"
                variant="rose"
                @update:modelValue="v => onChipsChange('keywords', v)"
                @change="v => onChipsSave('keywords', v)"
              />
              <p v-if="fieldError('keywords')" class="mt-2 text-xs text-red-600">{{ fieldError('keywords') }}</p>
            </div>
          </template>
        </BaseCard>
        <div v-if="isAnySaving" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <svg class="w-7 h-7 animate-spin text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
            <path class="opacity-75" stroke-width="4" d="M4 12a8 8 0 018-8"/>
          </svg>
        </div>
      </div>

      <!-- Summary Content -->
      <BaseCard :header-muted="true">
        <template #header>
          <div class="flex items-center gap-2 text-gray-800">
            <svg class="w-5 h-5 -mt-px flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M5 7h14" />
            </svg>
            <h3 class="text-base font-semibold leading-5">{{ t('chats.aiSummary') }}</h3>
          </div>
        </template>
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
      <BaseCard :header-muted="true">
        <template #header>
          <div class="flex items-center gap-2 text-gray-800">
            <svg class="w-5 h-5 -mt-px flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            <h3 class="text-base font-semibold leading-5">{{ t('chats.processedContent') }}</h3>
          </div>
        </template>
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
    <MetadataFieldEditor
      :show="showEditor"
      :field-key="editorKey"
      :value="editorValue"
      @cancel="closeEditor"
      @save="saveEditor"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import { formatDate as formatDateUtil } from '@/utils/timezone'
import { chatApi } from '@/api/chat'
import { metadataApi } from '@/api/metadata'
import MetadataFieldEditor from '@/components/MetadataFieldEditor.vue'
import MetadataChipsEditor from '@/components/MetadataChipsEditor.vue'
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

const showEditor = ref(false)
const editorKey = ref('')
const editorValue = ref(null)
const savingKeys = ref(new Set())
const errorsByKey = ref({})

const openEdit = (key) => {
  editorKey.value = key
  editorValue.value = threadline.value?.metadata ? threadline.value.metadata[key] : null
  showEditor.value = true
}

const openAdd = () => {
  const k = prompt('Enter new metadata key')
  if (!k) return
  editorKey.value = k
  editorValue.value = ''
  showEditor.value = true
}

const closeEditor = () => {
  showEditor.value = false
}

const saveEditor = async (newValue) => {
  if (!threadline.value) return
  const id = route.params.id
  const key = editorKey.value

  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  const next = { ...prev, [key]: newValue }

  threadline.value = { ...threadline.value, metadata: next }
  showEditor.value = false
  try {
    savingKeys.value.add(key)
    delete errorsByKey.value[key]
    await metadataApi.patchThreadlineMetadata(id, { [key]: newValue })
  } catch (err) {
    console.error('Failed to save metadata:', err)
    threadline.value = { ...threadline.value, metadata: prev }
    errorsByKey.value[key] = err?.response?.data?.message || '保存失败'
  } finally {
    savingKeys.value.delete(key)
  }
}

const onChipsChange = (key, value) => {
  if (!threadline.value) return
  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  const next = { ...prev, [key]: value }
  threadline.value = { ...threadline.value, metadata: next }
}

const onChipsSave = async (key, value) => {
  if (!threadline.value) return
  const id = route.params.id
  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  try {
    savingKeys.value.add(key)
    delete errorsByKey.value[key]
    await metadataApi.patchThreadlineMetadata(id, { [key]: value })
  } catch (err) {
    console.error('Failed to save metadata:', err)
    threadline.value = { ...threadline.value, metadata: prev }
    errorsByKey.value[key] = err?.response?.data?.message || '保存失败'
  } finally {
    savingKeys.value.delete(key)
  }
}

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

const isSaving = (key) => savingKeys.value.has(key)
const fieldError = (key) => errorsByKey.value[key]

const isAnySaving = computed(() => (
  isSaving('category') || isSaving('participants') || isSaving('timeline') || isSaving('keywords')
));
</script>
