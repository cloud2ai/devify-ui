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

    async syncToBackend(settingsApi) {
      try {
        await settingsApi.updatePreferences({
          language: this.language,
          timezone: this.timezone
        })
      } catch (error) {
        console.error('Failed to sync preferences to backend:', error)
        throw error
      }
    },

    loadFromBackend(preferences) {
      if (preferences.language) {
        this.language = preferences.language
        i18n.global.locale.value = preferences.language
        localStorage.setItem('userLanguage', preferences.language)
      }

      if (preferences.timezone) {
        this.timezone = preferences.timezone
        localStorage.setItem('userTimezone', preferences.timezone)
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
