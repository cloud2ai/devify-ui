import api from './index'

export const authApi = {
  // Login with username and password
  login(credentials) {
    return api.post('/v1/auth/login', credentials)
  },

  // Get user profile
  getProfile() {
    return api.get('/v1/auth/user')
  },

  // Update user profile
  updateProfile(profileData) {
    return api.patch('/v1/auth/user', profileData)
  },

  // Logout
  logout() {
    return api.post('/v1/auth/logout')
  },

  // Refresh token
  refreshToken() {
    return api.post('/v1/auth/token/refresh')
  },

  // Register (for future use)
  register(userData) {
    return api.post('/v1/auth/registration', userData)
  },

  // Reset password (for future use)
  resetPassword(email) {
    return api.post('/v1/auth/password/reset', { email })
  },

  // Change password
  changePassword(passwordData) {
    return api.post('/v1/auth/password/change', passwordData)
  }
}
