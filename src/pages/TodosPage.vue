<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ t('todos.title') }}
        </h1>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="rounded-md bg-red-50 border border-red-200 p-3"
      >
        <div class="flex gap-2">
          <div class="flex-shrink-0 pt-0.5">
            <svg
              class="h-4 w-4 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>
          <button
            @click="errorMessage = ''"
            class="flex-shrink-0 text-red-400 hover:text-red-600"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="rounded-md bg-green-50 border border-green-200 p-3"
      >
        <div class="flex gap-2">
          <div class="flex-shrink-0 pt-0.5">
            <svg
              class="h-4 w-4 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-green-800">
              {{ successMessage }}
            </p>
          </div>
          <button
            @click="successMessage = ''"
            class="flex-shrink-0 text-green-400 hover:text-green-600"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard>
          <div class="p-4">
            <div class="text-sm font-medium text-gray-500">
              {{ t('todos.stats.total') }}
            </div>
            <div class="mt-2 text-2xl font-bold text-gray-900">
              {{ stats.total }}
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="p-4">
            <div class="text-sm font-medium text-gray-500">
              {{ t('todos.stats.completed') }}
            </div>
            <div class="mt-2 text-2xl font-bold text-green-600">
              {{ stats.completed }}
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="p-4">
            <div class="text-sm font-medium text-gray-500">
              {{ t('todos.stats.incomplete') }}
            </div>
            <div class="mt-2 text-2xl font-bold text-yellow-600">
              {{ stats.incomplete }}
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="p-4">
            <div class="text-sm font-medium text-gray-500">
              {{ t('todos.stats.completionRate') }}
            </div>
            <div class="mt-2 text-2xl font-bold text-primary-600">
              {{ completionRate }}%
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Filters -->
      <BaseCard>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('todos.filters.all') }}
              </label>
              <select
                v-model="filters.is_completed"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                @change="loadTodos"
              >
                <option :value="null">{{ t('todos.filters.all') }}</option>
                <option :value="false">
                  {{ t('todos.filters.incomplete') }}
                </option>
                <option :value="true">
                  {{ t('todos.filters.completed') }}
                </option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('todos.filters.priority') }}
              </label>
              <select
                v-model="filters.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                @change="loadTodos"
              >
                <option :value="null">{{ t('todos.filters.all') }}</option>
                <option value="high">{{ t('todos.priority.high') }}</option>
                <option value="medium">
                  {{ t('todos.priority.medium') }}
                </option>
                <option value="low">{{ t('todos.priority.low') }}</option>
              </select>
            </div>

            <!-- Owner Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('todos.filters.owner') }}
              </label>
              <input
                v-model="filters.owner"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('todos.filters.owner')"
                @input="debounceSearch"
              />
            </div>

            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('common.search') }}
              </label>
              <input
                v-model="filters.search"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('todos.filters.search')"
                @input="debounceSearch"
              />
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Calendar View -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                @click="previousMonth"
                class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ currentMonthLabel }}
              </h2>
              <button
                @click="nextMonth"
                class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <BaseButton @click="handleAddTodo" variant="primary" size="sm">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ t('todos.add') }}
            </BaseButton>
          </div>
        </template>

        <div class="p-4">
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2 mb-4">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-sm font-medium text-gray-700 py-2"
            >
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(date, index) in calendarDays"
              :key="index"
              :class="[
                'min-h-[80px] p-2 border rounded cursor-pointer transition-colors',
                date.isCurrentMonth
                  ? 'bg-white border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                  : 'bg-gray-50 border-gray-100 text-gray-400',
                date.isToday ? 'ring-2 ring-primary-500' : '',
                selectedDate && isSameDay(date.date, selectedDate)
                  ? 'bg-primary-100 border-primary-500'
                  : ''
              ]"
              @click="selectDate(date.date)"
            >
              <div class="text-sm font-medium mb-1">
                {{ date.day }}
              </div>
              <div class="space-y-1">
                <div
                  v-for="todo in getTodosForDate(date.date)"
                  :key="todo.id"
                  :class="[
                    'text-xs px-1 py-0.5 rounded truncate',
                    todo.is_completed
                      ? 'bg-gray-200 text-gray-600 line-through'
                      : todo.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : todo.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                  ]"
                  @click.stop="handleEditTodo(todo)"
                >
                  {{ todo.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Selected Date Todos -->
      <BaseCard v-if="selectedDate">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">
              {{ formatSelectedDate(selectedDate) }}
            </h3>
            <BaseButton
              @click="selectedDate = null"
              variant="secondary"
              size="sm"
            >
              {{ t('common.close') }}
            </BaseButton>
          </div>
        </template>

        <div class="p-4 space-y-2">
          <div v-if="selectedDateTodos.length > 0">
            <TodoItem
              v-for="todo in selectedDateTodos"
              :key="todo.id"
              :todo="todo"
              :loading="todoLoading[todo.id]"
              @toggle="handleToggleTodo"
              @save="handleSaveTodoInline"
              @delete="handleDeleteTodo"
            />
          </div>
          <div v-else class="text-gray-500 italic text-center py-8">
            <p>{{ t('todos.noTodosForDate') }}</p>
          </div>
        </div>
      </BaseCard>

      <!-- Todo Editor Modal -->
      <div
        v-if="showTodoEditor"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeTodoEditor"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ editingTodo ? t('todos.editTodo') : t('todos.addTodo') }}
              </h3>
              <button
                @click="closeTodoEditor"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <TodoEditor
              :todo="editingTodo"
              :email-message-id="null"
              :loading="savingTodo"
              @save="handleSaveTodo"
              @cancel="closeTodoEditor"
            />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import { formatDate as formatDateUtil } from '@/utils/timezone'
import { extractErrorMessage } from '@/utils/api'
import { todosApi } from '@/api/todos'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TodoItem from '@/components/TodoItem.vue'
import TodoEditor from '@/components/TodoEditor.vue'

const { t, locale } = useI18n()
const preferencesStore = usePreferencesStore()

const todos = ref([])
const stats = ref(null)
const loading = ref(false)
const currentMonth = ref(new Date())
const selectedDate = ref(null)

const filters = ref({
  is_completed: null,
  priority: null,
  owner: '',
  search: ''
})

const showTodoEditor = ref(false)
const editingTodo = ref(null)
const savingTodo = ref(false)
const todoLoading = ref({})
const errorMessage = ref('')
const successMessage = ref('')

let searchTimeout = null

const weekDays = computed(() => {
  const days =
    locale.value === 'zh-CN'
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days
})

const currentMonthLabel = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const date = new Date(year, month, 1)
  return formatDateUtil(
    date.toISOString(),
    preferencesStore.currentTimezone,
    locale.value === 'zh-CN' ? 'yyyy年MM月' : 'MMMM yyyy',
    locale.value
  )
})

const completionRate = computed(() => {
  if (!stats.value || stats.value.total === 0) return 0
  return Math.round((stats.value.completed / stats.value.total) * 100)
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateCopy = new Date(date)
    dateCopy.setHours(0, 0, 0, 0)

    days.push({
      date: dateCopy,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: dateCopy.getTime() === today.getTime()
    })
  }

  return days
})

const selectedDateTodos = computed(() => {
  if (!selectedDate.value) return []
  return getTodosForDate(selectedDate.value)
})

const loadTodos = async () => {
  loading.value = true
  try {
    const params = {
      page_size: 1000,
      ordering: '-created_at'
    }

    if (filters.value.is_completed !== null) {
      params.is_completed = filters.value.is_completed
    }

    if (filters.value.priority) {
      params.priority = filters.value.priority
    }

    if (filters.value.owner) {
      params.owner = filters.value.owner
    }

    if (filters.value.search) {
      params.search = filters.value.search
    }

    const response = await todosApi.getTodos(params)
    const responseData = response.data.data || response.data
    todos.value =
      responseData.list || responseData.results || responseData.data || []
  } catch (err) {
    console.error('Failed to load todos:', err)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await todosApi.getTodoStats()
    stats.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

const getTodosForDate = (date) => {
  if (!date) return []
  const dateStr = formatDateForComparison(date)
  return todos.value.filter((todo) => {
    if (!todo.deadline) return false
    const todoDate = formatDateForComparison(new Date(todo.deadline))
    return todoDate === dateStr
  })
}

const formatDateForComparison = (date) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate = (date, format) => {
  if (!date) return ''
  return formatDateUtil(
    date instanceof Date ? date.toISOString() : date,
    preferencesStore.currentTimezone,
    format,
    locale.value
  )
}

const formatSelectedDate = (date) => {
  const format = locale.value === 'zh-CN' ? 'yyyy年MM月dd日' : 'MMMM dd, yyyy'
  return formatDate(date, format)
}

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const previousMonth = () => {
  const newDate = new Date(currentMonth.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentMonth.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentMonth.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentMonth.value = newDate
}

const selectDate = (date) => {
  if (isSameDay(date, selectedDate.value)) {
    selectedDate.value = null
  } else {
    selectedDate.value = date
  }
}

const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadTodos()
  }, 500)
}

const handleAddTodo = () => {
  editingTodo.value = null
  if (selectedDate.value) {
    const d =
      selectedDate.value instanceof Date
        ? selectedDate.value
        : new Date(selectedDate.value)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    editingTodo.value = {
      deadline: `${year}-${month}-${day}T${hours}:${minutes}`
    }
  }
  showTodoEditor.value = true
}

const handleEditTodo = (todo) => {
  editingTodo.value = todo
  showTodoEditor.value = true
}

const closeTodoEditor = () => {
  showTodoEditor.value = false
  editingTodo.value = null
}

const handleSaveTodoInline = async (todoId, todoData) => {
  todoLoading.value[todoId] = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await todosApi.updateTodo(todoId, todoData)
    successMessage.value =
      t('todos.updateSuccess') || 'TODO updated successfully'
    await Promise.all([loadTodos(), loadStats()])

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to save todo:', err)
    errorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.save')
    )
    throw err // Re-throw to let TodoItem handle the error
  } finally {
    todoLoading.value[todoId] = false
  }
}

const handleSaveTodo = async (todoData) => {
  savingTodo.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    if (editingTodo.value && editingTodo.value.id) {
      await todosApi.updateTodo(editingTodo.value.id, todoData)
      successMessage.value =
        t('todos.updateSuccess') || 'TODO updated successfully'
    } else {
      await todosApi.createTodo(todoData)
      successMessage.value =
        t('todos.createSuccess') || 'TODO created successfully'
    }
    await Promise.all([loadTodos(), loadStats()])
    closeTodoEditor()

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to save todo:', err)
    errorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.save')
    )
  } finally {
    savingTodo.value = false
  }
}

const handleToggleTodo = async (todoId) => {
  todoLoading.value[todoId] = true
  errorMessage.value = ''
  try {
    const todo = todos.value.find((t) => t.id === todoId)
    if (!todo) return

    await todosApi.updateTodo(todoId, {
      is_completed: !todo.is_completed
    })
    await Promise.all([loadTodos(), loadStats()])
  } catch (err) {
    console.error('Failed to toggle todo:', err)
    errorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.markCompleted')
    )
  } finally {
    todoLoading.value[todoId] = false
  }
}

const handleDeleteTodo = async (todoId) => {
  todoLoading.value[todoId] = true
  errorMessage.value = ''
  try {
    await todosApi.deleteTodo(todoId)
    await Promise.all([loadTodos(), loadStats()])
    if (selectedDate.value) {
      const dateTodos = getTodosForDate(selectedDate.value)
      if (dateTodos.length === 0) {
        selectedDate.value = null
      }
    }
    successMessage.value =
      t('todos.deleteSuccess') || 'TODO deleted successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to delete todo:', err)
    errorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.delete')
    )
  } finally {
    todoLoading.value[todoId] = false
  }
}

onMounted(() => {
  loadTodos()
  loadStats()
})

watch(
  () => currentMonth.value,
  () => {
    loadTodos()
  }
)
</script>
