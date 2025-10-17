<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mt-6 flex items-center justify-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ t('auth.registerTitle') }}
          </h2>
          <div class="ml-3">
            <LanguageSwitcher />
          </div>
        </div>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.haveAccount') }}
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            {{ t('auth.signIn') }}
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <BaseInput
            v-model="formData.username"
            :label="t('auth.username')"
            type="text"
            name="username"
            autocomplete="username"
            required
            :error="errors.username"
            @blur="validateField('username')"
          />

          <BaseInput
            v-model="formData.email"
            :label="t('auth.email')"
            type="email"
            name="email"
            autocomplete="email"
            required
            :error="errors.email"
            @blur="validateField('email')"
          />

          <BaseInput
            v-model="formData.password1"
            :label="t('auth.password')"
            type="password"
            name="password1"
            autocomplete="new-password"
            required
            :error="errors.password1"
            @blur="validateField('password1')"
          />

          <BaseInput
            v-model="formData.password2"
            :label="t('auth.confirmPassword')"
            type="password"
            name="password2"
            autocomplete="new-password"
            required
            :error="errors.password2"
            @blur="validateField('password2')"
          />
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 border border-red-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
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
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-red-800">
                {{ t('auth.registerError') }}
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ t('auth.registerErrorDetail') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-xs text-gray-500 space-y-1">
          <p>
            {{ t('settings.detectedText') + ' ' + t('settings.language') + ': ' + getFriendlyLanguageName(detectedLanguage) }}
          </p>
          <p>
            {{ t('settings.detectedText') + ' ' + t('settings.timezone') + ': ' + getFriendlyTimezoneName(detectedTimezone) }}
          </p>
        </div>

        <div>
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? t('auth.signingUp') : t('auth.signUp') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { usePreferencesStore } from '@/store/preferences'
import { settingsApi } from '@/api/settings'
import { detectTimezone, detectLanguage, getFriendlyLanguageName, getFriendlyTimezoneName } from '@/utils/timezone'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const preferencesStore = usePreferencesStore()

const formData = ref({
  username: '',
  email: '',
  password1: '',
  password2: ''
})

const errors = ref({
  username: '',
  email: '',
  password1: '',
  password2: ''
})

const loading = ref(false)
const errorMessage = ref('')
const detectedTimezone = ref(detectTimezone())
const detectedLanguage = ref(detectLanguage())

const isFormValid = computed(() => {
  return (
    formData.value.username &&
    formData.value.email &&
    formData.value.password1 &&
    formData.value.password2 &&
    !Object.values(errors.value).some(error => error)
  )
})

const validateField = (field) => {
  errors.value[field] = ''

  switch (field) {
    case 'username':
      if (!formData.value.username) {
        errors.value.username = t('auth.required.username')
      }
      break

    case 'email':
      if (!formData.value.email) {
        errors.value.email = t('auth.required.email')
      } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
        errors.value.email = t('auth.invalid.email')
      }
      break

    case 'password1':
      if (!formData.value.password1) {
        errors.value.password1 = t('auth.required.password')
      } else if (formData.value.password1.length < 8) {
        errors.value.password1 = t('auth.invalid.passwordLength')
      }
      break

    case 'password2':
      if (!formData.value.password2) {
        errors.value.password2 = t('auth.required.confirmPassword')
      } else if (formData.value.password1 !== formData.value.password2) {
        errors.value.password2 = t('auth.invalid.passwordMatch')
      }
      break
  }
}

// Watch for language changes and re-validate errors
watch(() => locale.value, () => {
  // Re-validate all fields with errors to update error messages
  Object.keys(errors.value).forEach(field => {
    if (errors.value[field]) {
      validateField(field)
    }
  })
})

const handleRegister = async () => {
  Object.keys(formData.value).forEach(validateField)

  if (!isFormValid.value) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await userStore.register(formData.value)

    await settingsApi.updatePreferences({
      language: detectedLanguage.value,
      timezone: detectedTimezone.value
    })

    preferencesStore.setLanguage(detectedLanguage.value)
    preferencesStore.setTimezone(detectedTimezone.value)

    router.push('/conversations')
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = 'registration_failed'
  } finally {
    loading.value = false
  }
}
</script>
