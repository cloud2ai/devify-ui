<template>
  <div class="relative flex flex-wrap gap-2" :aria-busy="loading ? 'true' : 'false'">
    <template v-if="isArray">
      <div
        v-for="(chip, index) in chips"
        :key="index"
        :class="chipClasses"
      >
        <template v-if="editingIndex === index">
          <span class="flex items-center gap-1">
            <svg v-if="loading" class="w-3.5 h-3.5 animate-spin text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
              <path class="opacity-75" stroke-width="4" d="M4 12a8 8 0 018-8"/>
            </svg>
            <input
              v-model="inputValue"
              type="text"
              :class="inputClasses"
              @keydown.enter.prevent="commitEdit(index)"
              @keydown.esc.prevent="cancelEdit"
              autofocus
            />
            <button
              @mousedown.prevent="commitEdit(index)"
              class="text-green-600 hover:text-green-800"
              aria-label="Confirm"
              title="Confirm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button
              @mousedown.prevent="cancelEdit"
              class="text-red-600 hover:text-red-800"
              aria-label="Cancel"
              title="Cancel"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </span>
        </template>
        <template v-else>
          <span class="select-none inline-flex items-center" @click="startEdit(index)">{{ chip }}</span>
          <button class="ml-1 hover:text-red-600 inline-flex items-center" @click="removeChip(index)" aria-label="Remove">×</button>
        </template>
      </div>
      <button
        :class="addBtnClasses"
        @click="addChip"
        aria-label="Add"
        title="Add"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </template>

    <template v-else>
      <div :class="chipClasses">
        <template v-if="editingIndex === 0">
          <span class="flex items-center gap-1">
            <svg v-if="loading" class="w-3.5 h-3.5 animate-spin text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
              <path class="opacity-75" stroke-width="4" d="M4 12a8 8 0 018-8"/>
            </svg>
            <input
              v-model="inputValue"
              type="text"
              :class="inputClasses"
              @keydown.enter.prevent="commitEdit(0)"
              @keydown.esc.prevent="cancelEdit"
              autofocus
            />
            <button
              @mousedown.prevent="commitEdit(0)"
              class="text-green-600 hover:text-green-800"
              aria-label="Confirm"
              title="Confirm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button
              @mousedown.prevent="cancelEdit"
              class="text-red-600 hover:text-red-800"
              aria-label="Cancel"
              title="Cancel"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </span>
        </template>
        <template v-else>
          <span class="select-none inline-flex items-center" @click="startEdit(0)">
            <template v-if="isSingleEmpty">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m-6 14h10M6 19l.293-.293a1 1 0 00.293-.707V15a1 1 0 01.293-.707l8-8a2 2 0 112.828 2.828l-8 8A1 1 0 0110 17H6.707a1 1 0 00-.707.293L6 18v1z" />
              </svg>
            </template>
            <template v-else>{{ singleValueLabel }}</template>
          </span>
          <button v-if="canClear && !isSingleEmpty" class="ml-1 hover:text-red-600 inline-flex items-center" @click="clearSingle" aria-label="Clear">×</button>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, String, Number, Boolean, null], default: '' },
  emptyLabel: { type: String, default: '-' },
  variant: {
    type: String,
    default: 'gray'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isArray = computed(() => Array.isArray(props.modelValue))
const chips = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))
const singleValueLabel = computed(() => {
  if (chips.value.length === 0 && !isArray.value) {
    return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
      ? props.emptyLabel
      : String(props.modelValue)
  }
  return String(props.modelValue ?? props.emptyLabel)
})
const canClear = computed(() => !isArray.value && (props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''))

const editingIndex = ref(-1)
const inputValue = ref('')
const originalValue = ref('')

watch(() => props.modelValue, () => {
  editingIndex.value = -1
}, { immediate: false })

const startEdit = (index) => {
  if (props.disabled) return
  editingIndex.value = index
  if (isArray.value) {
    inputValue.value = chips.value[index] ?? ''
    originalValue.value = inputValue.value
  } else {
    inputValue.value = String(props.modelValue ?? '')
    originalValue.value = inputValue.value
  }
}

const cancelEdit = () => {
  // If canceling a newly added empty tag, remove it from the array
  if (isArray.value && editingIndex.value >= 0) {
    const originalWasEmpty = originalValue.value === ''
    if (originalWasEmpty) {
      const next = [...chips.value]
      next.splice(editingIndex.value, 1)
      emit('update:modelValue', next)
      emit('change', next)
    }
  }
  editingIndex.value = -1
}

const commitEdit = (index) => {
  if (isArray.value) {
    const trimmedValue = inputValue.value.trim()
    const next = [...chips.value]
    const originalWasEmpty = originalValue.value === ''

    if (trimmedValue === '') {
      // If empty value
      if (originalWasEmpty) {
        // Remove newly added empty tag
        next.splice(index, 1)
      } else {
        // Restore original value when editing existing tag
        next[index] = originalValue.value
      }
    } else {
      // Update with trimmed value
      next[index] = trimmedValue
    }

    emit('update:modelValue', next)
    emit('change', next)
  } else {
    const trimmedValue = inputValue.value.trim()
    emit('update:modelValue', trimmedValue)
    emit('change', trimmedValue)
  }
  editingIndex.value = -1
}

const addChip = () => {
  if (!isArray.value) return
  if (props.disabled) return

  let next = [...chips.value, '']
  emit('update:modelValue', next)
  // Start editing the new empty tag immediately
  requestAnimationFrame(() => {
    editingIndex.value = next.length - 1
    inputValue.value = ''
    originalValue.value = ''
  })
}

const removeChip = (index) => {
  if (!isArray.value) return
  if (props.disabled) return
  const next = chips.value.filter((_, i) => i !== index)
  emit('update:modelValue', next)
  emit('change', next)
}

const clearSingle = () => {
  if (isArray.value) return
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('change', '')
}

const isSingleEmpty = computed(() => {
  if (isArray.value) return false
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
})

const chipClasses = computed(() => {
  const base = 'inline-flex items-center gap-1 px-2 h-6 rounded-md ' +
    'text-xs font-medium select-none'
  const map = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    rose: 'bg-rose-100 text-rose-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-800'
  }
  return `${base} ${map[props.variant] || map.gray}`
})

const inputClasses = computed(() => {
  const base = 'px-1 py-0.5 rounded border focus:ring-0 focus:outline-none '
  const map = {
    blue: 'border-blue-300 focus:border-blue-500',
    green: 'border-green-300 focus:border-green-500',
    purple: 'border-purple-300 focus:border-purple-500',
    rose: 'border-rose-300 focus:border-rose-500',
    amber: 'border-amber-300 focus:border-amber-500',
    gray: 'border-gray-300 focus:border-gray-500'
  }
  return `${base} ${map[props.variant] || map.gray}`
})

const addBtnClasses = computed(() => {
  const base = 'inline-flex items-center justify-center h-6 w-6 rounded ' +
    'border bg-white hover:bg-gray-50'
  const map = {
    blue: 'text-blue-700 border-blue-200',
    green: 'text-green-700 border-green-200',
    purple: 'text-purple-700 border-purple-200',
    rose: 'text-rose-700 border-rose-200',
    amber: 'text-amber-700 border-amber-200',
    gray: 'text-gray-700 border-gray-200'
  }
  return `${base} ${map[props.variant] || map.gray}`
})
</script>

<style scoped>
</style>
