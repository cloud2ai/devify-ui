<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">A</span>
        </div>
        <div class="mt-6 flex items-center justify-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ t('auth.loginTitle') }}
          </h2>
          <div class="ml-3">
            <LanguageSwitcher />
          </div>
        </div>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ t('auth.noAccount') }}
          <router-link
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            {{ t('auth.signUp') }}
          </router-link>
        </p>
      </div>

      <BaseCard>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="form.username"
            :label="t('auth.username')"
            :placeholder="t('auth.username')"
            :error="errors.username"
            required
            :disabled="loading"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            :label="t('auth.password')"
            :placeholder="t('auth.password')"
            :error="errors.password"
            required
            :disabled="loading"
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                {{ t('auth.rememberMe') }}
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                {{ t('auth.forgotPassword') }}
              </a>
            </div>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-red-800">
                  {{ t('auth.loginError') }}
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>
                    {{ t('auth.loginFailedMessage') }}
                    <router-link to="/register" class="font-medium underline hover:text-red-800">
                      {{ t('auth.registerNewAccount') }}
                    </router-link>
                    {{ t('auth.period') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            block
          >
            {{ loading ? t('auth.signingIn') : t('auth.signIn') }}
          </BaseButton>
        </form>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { usePreferencesStore } from '@/store/preferences'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const preferencesStore = usePreferencesStore()

const form = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

const validateForm = () => {
  errors.username = ''
  errors.password = ''

  if (!form.username.trim()) {
    errors.username = t('auth.required.username')
    return false
  }

  if (!form.password) {
    errors.password = t('auth.required.password')
    return false
  }

  return true
}

// Watch for language changes and re-validate errors
watch(() => locale.value, () => {
  // Re-validate all fields with errors to update error messages
  if (errors.username) {
    if (!form.username.trim()) {
      errors.username = t('auth.required.username')
    } else {
      errors.username = ''
    }
  }

  if (errors.password) {
    if (!form.password) {
      errors.password = t('auth.required.password')
    } else {
      errors.password = ''
    }
  }
})

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    await userStore.login(form)
    router.push('/conversations')
  } catch (err) {
    console.error('Login error:', err)

    error.value = 'login_failed'
  } finally {
    loading.value = false
  }
}
</script>
