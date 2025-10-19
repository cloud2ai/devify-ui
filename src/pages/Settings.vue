<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900">
          {{ t('settings.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('settings.preferences') }}
        </p>
      </div>

      <BaseCard :title="t('settings.emailAddress')">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
          <div class="flex items-center justify-between gap-2 sm:gap-3">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <div class="flex-shrink-0">
                <svg
                  class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                  <span class="text-xs font-medium text-blue-800 whitespace-nowrap">
                    {{ t('settings.emailAddressDesc') }}:
                  </span>
                  <code
                    class="text-xs sm:text-sm font-mono font-medium text-blue-900 truncate"
                    :title="userEmail"
                  >
                    {{ userEmail }}
                  </code>
                </div>
              </div>
            </div>

            <button
              @click="copyEmail"
              class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
              :title="t('settings.copyEmail')"
            >
              <svg
                v-if="!emailCopied"
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                class="h-3.5 w-3.5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="hidden sm:inline">
                {{ emailCopied ? t('common.copied') : t('common.copy') }}
              </span>
            </button>
          </div>
        </div>
      </BaseCard>

      <BaseCard :title="t('settings.preferences')">
        <form @submit.prevent="saveSettings" class="space-y-6">
          <div>
            <label for="language" class="block text-sm font-medium text-gray-700">
              {{ t('settings.language') }}
            </label>
            <p class="mt-1 text-xs text-gray-500">
              {{ t('settings.languageDesc') }}
            </p>
            <select
              id="language"
              v-model="formData.language"
              class="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="en">{{ t('settings.languages.en') }}</option>
              <option value="zh-CN">{{ t('settings.languages.zh-CN') }}</option>
            </select>
            <p class="mt-1 text-xs text-gray-400">
              {{ t('settings.detected', { value: detectedLanguage === 'zh-CN' ? '简体中文' : 'English' }) }}
            </p>
          </div>

          <div>
            <label for="timezone" class="block text-sm font-medium text-gray-700">
              {{ t('settings.timezone') }}
            </label>
            <p class="mt-1 text-xs text-gray-500">
              {{ t('settings.timezoneDesc') }}
            </p>
            <select
              id="timezone"
              v-model="formData.timezone"
              class="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option
                v-for="tz in timezones"
                :key="tz.value"
                :value="tz.value"
              >
                {{ tz.label }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-400">
              {{ t('settings.detected', { value: detectedTimezone }) }}
            </p>
          </div>

          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="saving"
              :disabled="saving"
            >
              {{ saving ? t('common.loading') : t('settings.saveSettings') }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { usePreferencesStore } from '@/store/preferences'
import { settingsApi } from '@/api/settings'
import { detectTimezone, detectLanguage, getTimezoneList } from '@/utils/timezone'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const userStore = useUserStore()
const preferencesStore = usePreferencesStore()

const formData = reactive({
  language: preferencesStore.currentLanguage,
  timezone: preferencesStore.currentTimezone
})

const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const emailCopied = ref(false)
const detectedLanguage = ref(detectLanguage())
const detectedTimezone = ref(detectTimezone())
const timezones = ref(getTimezoneList())

const userEmail = ref(
  userStore.userInfo?.virtual_email || 'user@example.com'
)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(userEmail.value)
    emailCopied.value = true
    setTimeout(() => {
      emailCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy email:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await settingsApi.updatePreferences({
      language: formData.language,
      timezone: formData.timezone
    })

    preferencesStore.setLanguage(formData.language)
    preferencesStore.setTimezone(formData.timezone)

    successMessage.value = t('settings.settingsSaved')
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save settings:', error)
    errorMessage.value = error.response?.data?.message || t('settings.settingsError')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  formData.language = preferencesStore.currentLanguage
  formData.timezone = preferencesStore.currentTimezone
})
</script>
