import { defineStore } from 'pinia'
import { detectTimezone, detectLanguage } from '@/utils/timezone'
import i18n from '@/i18n'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    language: detectLanguage(),
    timezone: detectTimezone(),
    detectedLanguage: detectLanguage(),
    detectedTimezone: detectTimezone(),
    isLoaded: false
  }),

  getters: {
    currentLanguage: (state) => state.language,
    currentTimezone: (state) => state.timezone,
    isAutoDetected: (state) => {
      return (
        state.language === state.detectedLanguage &&
        state.timezone === state.detectedTimezone
      )
    }
  },

  actions: {
    setLanguage(language) {
      this.language = language
      i18n.global.locale.value = language
      localStorage.setItem('userLanguage', language)
    },

    setTimezone(timezone) {
      this.timezone = timezone
      localStorage.setItem('userTimezone', timezone)
    },

    loadFromLocalStorage() {
      const savedLanguage = localStorage.getItem('userLanguage')
      const savedTimezone = localStorage.getItem('userTimezone')

      if (savedLanguage) {
        this.language = savedLanguage
        i18n.global.locale.value = savedLanguage
      }

      if (savedTimezone) {
        this.timezone = savedTimezone
      }

      this.isLoaded = true
    },

    // DEPRECATED: This method is no longer used
    // Timezone is a frontend-only setting and should not be synced to backend
    // AI prompt language is managed separately via prompt_config
    async syncToBackend(settingsApi) {
      console.warn('syncToBackend is deprecated. Use Settings.vue to update prompt_config instead.')
      // Note: timezone should NOT be synced to backend as it's frontend-only
      // AI prompt language is managed via prompt_config in Settings.vue
    },

    loadFromBackend(preferences) {
      // Note: preferences.language here is AI prompt language, not UI language
      // UI language should remain separate and be managed independently
      // We do NOT sync AI prompt language to UI language anymore

      // Note: timezone is no longer returned from backend
      // It's a frontend-only setting and should be loaded from localStorage
      // or auto-detected, not from backend preferences

      // Timezone handling is now frontend-only
      // Load from localStorage if available, otherwise keep auto-detected value
      const savedTimezone = localStorage.getItem('userTimezone')
      if (savedTimezone) {
        this.timezone = savedTimezone
      }

      this.isLoaded = true
    },

    reset() {
      this.language = this.detectedLanguage
      this.timezone = this.detectedTimezone
      i18n.global.locale.value = this.detectedLanguage
      localStorage.removeItem('userLanguage')
      localStorage.removeItem('userTimezone')
    }
  }
})
