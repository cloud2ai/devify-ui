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
        <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <BaseButton
            @click="exportThreadline"
            variant="secondary"
            :loading="exporting"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
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

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Attachments</p>
              <p class="text-sm text-gray-900">{{ threadline.attachments?.length || 0 }}</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Summary Content -->
      <BaseCard v-if="threadline.summary_title || threadline.summary_content" title="Summary">
        <div class="space-y-4">
          <div v-if="threadline.summary_title">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ threadline.summary_title }}</h3>
          </div>
          <div v-if="threadline.summary_content">
            <MarkdownRenderer :content="threadline.summary_content" />
          </div>
        </div>
      </BaseCard>

      <!-- Email Content -->
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

      <!-- Attachments -->
      <BaseCard v-if="threadline.attachments && threadline.attachments.length > 0" title="Attachments">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="attachment in threadline.attachments"
            :key="attachment.id"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ attachment.filename }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatFileSize(attachment.file_size) }}
              </p>
            </div>
            <div class="ml-3">
              <BaseButton
                @click="downloadAttachment(attachment)"
                variant="secondary"
                size="sm"
              >
                Download
              </BaseButton>
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
import { chatApi } from '@/api/chat'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()

const threadline = ref(null)
const loading = ref(false)
const error = ref('')
const exporting = ref(false)
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

const exportThreadline = async () => {
  exporting.value = true

  try {
    const response = await chatApi.exportThreadline(route.params.id)

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `threadline-${route.params.id}.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Export failed:', err)
  } finally {
    exporting.value = false
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

const downloadAttachment = (attachment) => {
  // This would need to be implemented based on your backend
  // TODO: Implement attachment download functionality
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
