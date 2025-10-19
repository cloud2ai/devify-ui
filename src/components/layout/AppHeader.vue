<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and title -->
        <div class="flex items-center">
          <router-link
            to="/chats"
            class="flex items-center space-x-2"
          >
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">A</span>
            </div>
            <span class="text-xl font-semibold text-gray-900">{{ t('common.appName') }}</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            to="/chats"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Chats' }"
          >
            {{ t('chats.title') }}
          </router-link>
          <router-link
            to="/settings"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Settings' }"
          >
            {{ t('common.settings') }}
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          <LanguageSwitcher />
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1"
            >
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-gray-600 font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <span class="hidden sm:block">{{ userStore.userInfo?.username || 'User' }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200"
              >
                <!-- User Info -->
                <div class="px-4 py-2">
                  <div class="font-semibold text-gray-900 truncate">{{ userStore.userInfo?.username || 'User' }}</div>
                </div>

                <!-- Login Email -->
                <div class="px-4 py-2">
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-xs text-gray-500 font-medium">{{ t('auth.loginEmail') }}</span>
                  </div>
                  <div class="text-gray-700 text-xs truncate pl-6" :title="userStore.userInfo?.email || ''">
                    {{ userStore.userInfo?.email || '' }}
                  </div>
                </div>

                <!-- AI Email Card -->
                <div v-if="userStore.userInfo?.virtual_email" class="px-4 py-2">
                  <div class="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-3 border border-primary-100">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span class="text-xs text-primary-700 font-semibold">{{ t('virtualEmail.yourAddress') }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 min-w-0">
                        <div class="text-primary-900 text-sm font-medium truncate" :title="userStore.userInfo?.virtual_email">
                          {{ userStore.userInfo?.virtual_email }}
                        </div>
                      </div>
                      <button
                        @click.stop="copyVirtualEmail"
                        class="flex-shrink-0 p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-md transition-all"
                        :title="t('settings.copyEmail')"
                      >
                        <svg
                          v-if="!copied"
                          class="w-4 h-4"
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
                          class="w-4 h-4 text-green-600"
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
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-100 my-1"></div>

                <!-- Logout Button -->
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ t('common.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const showUserMenu = ref(false)
const userMenuRef = ref(null)
const copied = ref(false)

const userInitials = computed(() => {
  const username = userStore.userInfo?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (!showUserMenu.value) {
    copied.value = false
  }
}

const copyVirtualEmail = async () => {
  try {
    const virtualEmail = userStore.userInfo?.virtual_email
    if (virtualEmail) {
      await navigator.clipboard.writeText(virtualEmail)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to copy email:', error)
  }
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
  showUserMenu.value = false
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
    copied.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.nav-link-active {
  @apply text-primary-600 bg-primary-50;
}
</style>
