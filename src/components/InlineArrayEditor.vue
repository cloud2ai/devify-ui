<template>
  <div class="relative">
    <!-- Display Mode -->
    <div v-if="!editing" class="group relative">
      <div class="flex items-start gap-2">
        <div class="flex-1 min-w-0">
          <slot name="display">
            <ul v-if="displayValue && displayValue.length > 0" class="space-y-2">
              <li
                v-for="(item, index) in displayValue"
                :key="index"
                class="flex items-start gap-2 text-sm text-gray-700"
              >
                <span class="text-primary-600 mt-1">•</span>
                <span class="flex-1">{{ item }}</span>
              </li>
            </ul>
            <span v-else class="text-gray-400 italic">{{ placeholder }}</span>
          </slot>
        </div>
        <div
          v-if="showEditButton && !disabled"
          class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <BaseButton
            @click="startEditing"
            variant="primary"
            size="sm"
          >
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {{ t('common.edit') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-3">
      <div>
        <label
          v-if="label"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          {{ label }}
        </label>
        <textarea
          ref="textareaRef"
          v-model="localText"
          :rows="rows"
          :placeholder="placeholder"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 resize-y font-mono"
          :class="{ 'border-red-300': error }"
        ></textarea>
        <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
        <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
      </div>
      <div class="flex items-center justify-end gap-2">
        <BaseButton
          @click="cancelEditing"
          variant="secondary"
          size="sm"
          :disabled="saving"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          @click="handleSave"
          variant="primary"
          size="sm"
          :loading="saving"
        >
          {{ t('common.save') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 8
  },
  disabled: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showEditButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const { t } = useI18n()

const editing = ref(false)
const localText = ref('')
const textareaRef = ref(null)
const originalValue = ref([])

const displayValue = computed(() => {
  return props.modelValue || []
})

const startEditing = () => {
  originalValue.value = [...(props.modelValue || [])]
  localText.value = (props.modelValue || []).join('\n')
  editing.value = true
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  })
}

const cancelEditing = () => {
  localText.value = originalValue.value.join('\n')
  editing.value = false
  emit('cancel')
}

const handleSave = () => {
  const lines = localText.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  emit('update:modelValue', lines)
  emit('save', lines)
}

defineExpose({
  startEditing
})

watch(
  () => props.saving,
  (newValue) => {
    if (!newValue && editing.value) {
      editing.value = false
    }
  }
)
</script>
