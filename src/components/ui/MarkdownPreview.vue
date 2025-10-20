<template>
  <div class="markdown-preview" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 200
  }
})

// Configure marked for preview (simpler, no syntax highlighting)
const previewRenderer = new marked.Renderer()

// Override some renderers for cleaner preview
previewRenderer.heading = (text, level) => {
  return `<strong>${text}</strong>`
}

previewRenderer.list = (tokensOrHtml, ordered) => {
  const toText = (val) => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (Array.isArray(val)) {
      return val
        .map((t) => t?.text || t?.raw || '')
        .filter(Boolean)
        .join(' ')
    }
    if (typeof val === 'object') return val.text || val.raw || ''
    return String(val)
  }
  const body = toText(tokensOrHtml)
  return `<div class="list-preview">${body}</div>`
}

previewRenderer.listitem = (tokenOrText) => {
  const text = typeof tokenOrText === 'string'
    ? tokenOrText
    : (tokenOrText?.text || tokenOrText?.raw || '')
  return `<span class="list-item">• ${text}</span>`
}

const renderedContent = computed(() => {
  if (!props.content) return ''

  try {
    // Normalize to string and truncate for preview
    const raw = typeof props.content === 'string'
      ? props.content
      : (Array.isArray(props.content)
          ? props.content.map(v => (typeof v === 'string' ? v : JSON.stringify(v))).join(' ')
          : JSON.stringify(props.content))

    const truncatedContent = raw.length > props.maxLength
      ? raw.substring(0, props.maxLength) + '...'
      : raw

    return marked.parse(truncatedContent, { renderer: previewRenderer })
  } catch (error) {
    console.error('Markdown preview parsing error:', error)
    const fallback = typeof props.content === 'string'
      ? props.content
      : JSON.stringify(props.content)
    return fallback.substring(0, props.maxLength) + (fallback.length > props.maxLength ? '...' : '')
  }
})
</script>

<style scoped>
.markdown-preview {
  @apply text-sm text-gray-500;
}

.markdown-preview :deep(p) {
  @apply mb-1 last:mb-0;
}

.markdown-preview :deep(strong) {
  @apply font-medium text-gray-700;
}

.markdown-preview :deep(em) {
  @apply italic;
}

.markdown-preview :deep(code) {
  @apply bg-gray-100 text-gray-700 px-1 rounded text-xs;
}

.markdown-preview :deep(.list-preview) {
  @apply space-y-1;
}

.markdown-preview :deep(.list-item) {
  @apply block;
}

.markdown-preview :deep(a) {
  @apply text-primary-600 hover:text-primary-700;
}
</style>
