import apiClient from './index'

export const settingsApi = {
  async getSettings() {
    const response = await apiClient.get('/v1/settings')
    return response.data
  },

  async getSetting(id) {
    const response = await apiClient.get(`/v1/settings/${id}`)
    return response.data
  },

  async createSetting(data) {
    const response = await apiClient.post('/v1/settings', data)
    return response.data
  },

  async updateSetting(id, data) {
    const response = await apiClient.patch(
      `/v1/settings/${id}`,
      data
    )
    return response.data
  },

  async deleteSetting(id) {
    const response = await apiClient.delete(`/v1/settings/${id}`)
    return response.data
  },

  async updatePreferences(preferences) {
    const settings = await this.getSettings()
    const preferencesData = settings.data?.list || settings.data || []

    const languageSetting = preferencesData.find((s) => s.key === 'language')
    const timezoneSetting = preferencesData.find((s) => s.key === 'timezone')

    const promises = []

    if (languageSetting) {
      promises.push(
        this.updateSetting(languageSetting.id, {
          value: { language: preferences.language }
        })
      )
    } else if (preferences.language) {
      promises.push(
        this.createSetting({
          key: 'language',
          value: { language: preferences.language },
          description: 'User language preference'
        })
      )
    }

    if (timezoneSetting) {
      promises.push(
        this.updateSetting(timezoneSetting.id, {
          value: { timezone: preferences.timezone }
        })
      )
    } else if (preferences.timezone) {
      promises.push(
        this.createSetting({
          key: 'timezone',
          value: { timezone: preferences.timezone },
          description: 'User timezone preference'
        })
      )
    }

    await Promise.all(promises)
  },

  async getPreferences() {
    const settings = await this.getSettings()
    const settingsData = settings.data?.list || settings.data || []

    const languageSetting = settingsData.find((s) => s.key === 'language')
    const timezoneSetting = settingsData.find((s) => s.key === 'timezone')

    return {
      language: languageSetting?.value?.language || null,
      timezone: timezoneSetting?.value?.timezone || null
    }
  },

  async getEmailAliases() {
    const response = await apiClient.get('/v1/settings/email-aliases')
    return response.data
  },

  async createEmailAlias(alias) {
    const response = await apiClient.post(
      '/v1/settings/email-aliases',
      { alias }
    )
    return response.data
  },

  async deleteEmailAlias(id) {
    const response = await apiClient.delete(
      `/v1/settings/email-aliases/${id}`
    )
    return response.data
  },

  async validateAlias(alias) {
    const response = await apiClient.post(
      '/v1/settings/email-aliases/validate',
      { alias }
    )
    return response.data
  }
}
