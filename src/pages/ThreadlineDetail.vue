<template>
  <AppLayout>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">{{ t('common.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div
        class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center"
      >
        <svg
          class="h-6 w-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ t('chats.errorLoading') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <BaseButton @click="loadThreadline" variant="primary">
          {{ t('common.tryAgain') }}
        </BaseButton>
      </div>
    </div>

    <div v-else-if="threadline" class="space-y-6">
      <!-- Todo Error Message -->
      <div
        v-if="todoErrorMessage"
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
            <p class="text-sm font-medium text-red-800">
              {{ todoErrorMessage }}
            </p>
          </div>
          <button
            @click="todoErrorMessage = ''"
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

      <!-- Todo Success Message -->
      <div
        v-if="todoSuccessMessage"
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
              {{ todoSuccessMessage }}
            </p>
          </div>
          <button
            @click="todoSuccessMessage = ''"
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

      <!-- Top Actions Bar -->
      <div class="mb-1">
        <div class="flex items-center justify-between gap-3">
          <!-- Back Button -->
          <button
            @click="goBack"
            class="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
            :title="t('common.back')"
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <!-- Right Actions: Retry Button + More Menu -->
          <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
            <!-- Retry Button - Hide text on mobile, show icon only -->
            <BaseButton
              @click="handleRetryClick"
              variant="primary"
              size="sm"
              :loading="retrying || isProcessing"
              :disabled="deleting || retrying || isProcessing"
              class="px-2 sm:px-3"
            >
              <svg
                v-if="!retrying && !isProcessing"
                class="w-4 h-4 sm:mr-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="hidden sm:inline">
                {{
                  retrying || isProcessing
                    ? t('common.status.processing')
                    : t('retry.retryButton')
                }}
              </span>
            </BaseButton>

            <!-- More Menu Button -->
            <div class="relative" ref="actionMenuRef">
              <button
                @click="showActionMenu = !showActionMenu"
                class="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                :title="t('common.moreActions')"
              >
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu (Only Delete) -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showActionMenu"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="py-1">
                    <button
                      @click="() => { deleteThreadline(); showActionMenu = false }"
                      class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="retrying || isProcessing || deleting"
                    >
                      <svg
                        v-if="!deleting"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>
                        {{ deleting ? t('common.deleting') : t('common.delete') }}
                      </span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Title and Metadata Card -->
      <BaseCard class="mb-4 sm:mb-6">
        <div class="space-y-3 sm:space-y-4">
          <!-- Title -->
          <div class="relative">
              <!-- Display Mode -->
              <button
                v-if="!editingTitle"
                type="button"
                class="group relative inline-flex items-start gap-2 w-full text-left rounded transition-colors"
                @click="startEditingTitle"
                :disabled="isProcessing"
              >
                <h2
                  class="text-xl font-bold leading-7 text-gray-900 sm:text-2xl flex-1 pr-6"
                >
                  {{
                    threadline.summary_title ||
                    threadline.subject ||
                    t('common.noSubject')
                  }}
                  <svg
                    class="inline-block w-3.5 h-3.5 ml-1.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity align-text-bottom"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="margin-top: -0.1em;"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </h2>
              </button>
              <!-- Edit Mode -->
              <div v-else class="space-y-1">
                <div
                  class="relative bg-blue-50 border-2 border-blue-200 rounded-md"
                  style="padding: 0.75rem 1rem;"
                >
                <textarea
                  ref="titleInputRef"
                  v-model="editingTitleValue"
                  rows="2"
                  class="w-full px-0 py-0 text-xl font-bold leading-7 text-gray-900 sm:text-2xl border-0 focus:outline-none bg-transparent resize-none overflow-hidden"
                  :class="{ 'border-red-300': titleError }"
                  :disabled="savingTitle"
                  style="line-height: 1.75rem; min-height: 3.5rem; height: 3.5rem;"
                ></textarea>
                <p v-if="titleError" class="mt-2 text-xs text-red-600">
                  {{ titleError }}
                </p>
                </div>
                <!-- Save/Cancel Icons - Right bottom below input -->
                <div class="flex items-center justify-end gap-1">
                <div
                  class="flex items-center bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    @click="saveTitle"
                    type="button"
                    :disabled="savingTitle"
                    class="p-1.5 pr-2 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                    :title="t('common.save')"
                  >
                    <svg
                      v-if="!savingTitle"
                      class="w-4 h-4"
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
                    <svg
                      v-else
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <div class="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
                  </button>
                  <button
                    @click="cancelEditingTitle"
                    type="button"
                    :disabled="savingTitle"
                    class="p-1.5 pl-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="t('common.cancel')"
                  >
                    <svg
                      class="w-4 h-4"
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
              </div>
              </div>

          <!-- Divider -->
          <div class="border-t border-gray-200"></div>

          <!-- Date/Time and Metadata -->
          <div class="pt-2 sm:pt-3">
            <div class="space-y-2 sm:space-y-3">
              <!-- Created Time and Category -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <!-- Created Time -->
                <div class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <svg
                  class="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ formatDate(threadline.received_at || threadline.created_at) }}</span>
              </div>

                <!-- Category -->
                <div v-if="threadline.metadata" class="flex items-center gap-2 min-w-0">
                  <svg
                    class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-xs sm:text-sm text-gray-500 flex-shrink-0">{{ t('metadata.category.title') }}</span>
                  <MetadataChipsEditor
                    :model-value="threadline.metadata.category || ''"
                    variant="blue"
                    :disabled="isSaving('category')"
                    :loading="isSaving('category')"
                    @update:modelValue="(v) => onChipsChange('category', v)"
                    @change="(v) => onChipsSave('category', v)"
                  />
                </div>
              </div>
            </div>

              <!-- Participants -->
              <div v-if="threadline.metadata" class="flex items-center gap-2 min-w-0">
                <svg
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-xs sm:text-sm text-gray-500 flex-shrink-0">{{ t('metadata.participants.title') }}</span>
                <MetadataChipsEditor
                  :model-value="threadline.metadata.participants || []"
                  variant="green"
                  :disabled="isSaving('participants')"
                  :loading="isSaving('participants')"
                  :max-display="6"
                  @update:modelValue="(v) => onChipsChange('participants', v)"
                  @change="(v) => onChipsSave('participants', v)"
                />
              </div>
            </div>

              <!-- Tags -->
              <div v-if="threadline.metadata" class="flex items-center gap-2 min-w-0">
                <svg
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M3 7a4 4 0 014-4h5l7 7a2 2 0 010 2.828l-5.172 5.172a2 2 0 01-2.828 0L3 12V7z"
                  />
                </svg>
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-xs sm:text-sm text-gray-500 flex-shrink-0">{{ t('metadata.keywords.title') }}</span>
                <MetadataChipsEditor
                  :model-value="threadline.metadata.keywords || []"
                  variant="rose"
                  :disabled="isSaving('keywords')"
                  :loading="isSaving('keywords')"
                  :max-display="6"
                  @update:modelValue="(v) => onChipsChange('keywords', v)"
                  @change="(v) => onChipsSave('keywords', v)"
                />
              </div>
            </div>

              <!-- Error Message -->
              <p
                v-if="fieldError('keywords') || fieldError('category') || fieldError('participants')"
                class="text-xs sm:text-sm text-red-600"
              >
                {{ fieldError('keywords') || fieldError('category') || fieldError('participants') }}
              </p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Summary Content - New Format or Old Format -->
      <div v-if="hasNewFormat" class="space-y-6">
        <!-- Details Section -->
        <BaseCard :header-muted="true">
          <template #header>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2 text-gray-800">
                <svg
                  class="w-5 h-5 -mt-px flex-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-base font-semibold leading-5">
                  {{ t('todos.newFormat.details') }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton
                  size="sm"
                  variant="primary"
                  @click="openDetailsEditor"
                  :disabled="isProcessing || editingDetails"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {{ t('common.edit') }}
                </BaseButton>
                <button
                  v-if="summaryData.details"
                  @click="copyContent(summaryData.details, 'details')"
                  class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  :title="t('common.copy')"
                >
                  <svg
                    v-if="!copiedStates.details"
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
                    {{
                      copiedStates.details
                        ? t('common.copied')
                        : t('common.copy')
                    }}
                  </span>
                </button>
              </div>
            </div>
          </template>
          <InlineMarkdownEditor
            ref="detailsEditorRef"
            v-model="detailsValue"
            :label="t('todos.newFormat.details')"
            :placeholder="t('todos.newFormat.details')"
            :hint="t('common.markdownSupported')"
            :saving="savingDetails"
            :error="detailsError"
            :disabled="isProcessing"
            :show-edit-button="false"
            @save="saveDetails"
            @cancel="cancelEditingDetails"
          >
            <template #display>
              <MarkdownRenderer :content="summaryData.details" />
            </template>
          </InlineMarkdownEditor>
        </BaseCard>

        <!-- TODOs Section -->
        <BaseCard :header-muted="true">
          <template #header>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2 text-gray-800">
                <svg
                  class="w-5 h-5 -mt-px flex-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 class="text-base font-semibold leading-5">
                  {{ t('todos.newFormat.todos') }}
                </h3>
              </div>
              <BaseButton
                @click="handleAddTodo"
                variant="primary"
                size="sm"
                :disabled="!!tempNewTodo || savingNewTodo || editingTodoIds.size > 0"
              >
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
          <TransitionGroup
            name="todo-list"
            tag="div"
            class="space-y-2"
          >
            <!-- New Todo Item (in edit mode) -->
            <TodoItem
              v-if="tempNewTodo"
              :key="tempNewTodo.id"
              :todo="tempNewTodo"
              :loading="savingNewTodo"
              :email-message-id="threadline?.id"
              :is-new="true"
              @toggle="() => {}"
              @save="saveNewTodo"
              @delete="() => {}"
              @cancel-new="cancelNewTodo"
              @editing-change="(editing) => handleTodoEditingChange(tempNewTodo.id, editing)"
            />

            <!-- Existing Todo Items -->
            <TodoItem
              v-for="todo in threadlineTodos"
              :key="todo.id"
              :todo="todo"
              :loading="todoLoading[todo.id]"
              :email-message-id="threadline?.id"
              @toggle="handleToggleTodo"
              @save="handleSaveTodoInline"
              @delete="handleDeleteTodo"
              @editing-change="(editing) => handleTodoEditingChange(todo.id, editing)"
            />
          </TransitionGroup>
          <div v-if="threadlineTodos.length === 0 && !tempNewTodo" class="text-gray-500 italic text-center py-8">
            <p>{{ t('todos.noTodos') }}</p>
          </div>
        </BaseCard>

        <!-- Key Process Section -->
        <BaseCard :header-muted="true">
          <template #header>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2 text-gray-800">
                <svg
                  class="w-5 h-5 -mt-px flex-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 class="text-base font-semibold leading-5">
                  {{ t('todos.newFormat.keyProcess') }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton
                  size="sm"
                  variant="primary"
                  @click="openKeyProcessEditor"
                  :disabled="isProcessing || editingKeyProcess"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {{ t('common.edit') }}
                </BaseButton>
                <button
                  v-if="summaryData.key_process && summaryData.key_process.length > 0"
                  @click="copyKeyProcess"
                  class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  :title="t('common.copy')"
                >
                  <svg
                    v-if="!copiedStates.keyProcess"
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
                    {{
                      copiedStates.keyProcess
                        ? t('common.copied')
                        : t('common.copy')
                    }}
                  </span>
                </button>
              </div>
            </div>
          </template>
          <InlineArrayEditor
            ref="keyProcessEditorRef"
            v-model="keyProcessValue"
            :label="t('todos.newFormat.keyProcess')"
            :placeholder="t('todos.newFormat.keyProcessPlaceholder')"
            :hint="t('todos.newFormat.keyProcessHint')"
            :saving="savingKeyProcess"
            :error="keyProcessError"
            :disabled="isProcessing"
            :show-edit-button="false"
            @save="saveKeyProcess"
            @cancel="cancelEditingKeyProcess"
          />
        </BaseCard>
      </div>

      <!-- Old Format Summary -->
      <BaseCard v-else :header-muted="true">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2 text-gray-800">
              <svg
                class="w-5 h-5 -mt-px flex-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6M5 7h14"
                />
              </svg>
              <h3 class="text-base font-semibold leading-5">
                {{ t('chats.aiSummary') }}
              </h3>
            </div>
            <button
              v-if="threadline.summary_content"
              @click="copyContent(threadline.summary_content, 'summary')"
              class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
              :title="t('common.copy')"
            >
              <svg
                v-if="!copiedStates.summary"
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
                {{
                  copiedStates.summary ? t('common.copied') : t('common.copy')
                }}
              </span>
            </button>
          </div>
        </template>
        <div
          v-if="threadline.summary_title || threadline.summary_content"
          class="space-y-4"
        >
          <div v-if="threadline.summary_title">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ threadline.summary_title }}
            </h3>
          </div>
          <div v-if="threadline.summary_content">
            <MarkdownRenderer :content="threadline.summary_content" />
          </div>
        </div>
        <div v-else class="text-gray-500 italic text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>{{ t('chats.summaryProcessing') }}</p>
          <p class="text-sm mt-2">
            {{ t('common.status') }}: {{ threadline.status || 'pending' }}
          </p>
        </div>
      </BaseCard>

      <!-- LLM Content (AI Processed) -->
      <BaseCard :header-muted="true">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2 text-gray-800">
              <svg
                class="w-5 h-5 -mt-px flex-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                />
              </svg>
              <h3 class="text-base font-semibold leading-5">
                {{ t('chats.processedContent') }}
              </h3>
            </div>
            <button
              v-if="threadline.llm_content"
              @click="copyContent(threadline.llm_content, 'llm')"
              class="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
              :title="t('common.copy')"
            >
              <svg
                v-if="!copiedStates.llm"
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
                {{ copiedStates.llm ? t('common.copied') : t('common.copy') }}
              </span>
            </button>
          </div>
        </template>
        <div v-if="threadline.llm_content">
          <MarkdownRenderer :content="threadline.llm_content" />
        </div>
        <div v-else class="text-gray-500 italic text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p>{{ t('chats.processedContentProcessing') }}</p>
          <p class="text-sm mt-2">{{ t('chats.processedContentDesc') }}</p>
        </div>
      </BaseCard>
    </div>
    <MetadataFieldEditor
      :show="showEditor"
      :field-key="editorKey"
      :value="editorValue"
      @cancel="closeEditor"
      @save="saveEditor"
    />
    <RetryDialog
      :show="showRetryDialog"
      :status="threadline?.status"
      @close="showRetryDialog = false"
      @confirm="handleRetry"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/store/preferences'
import { useToast } from '@/composables/useToast'
import { formatDate as formatDateUtil } from '@/utils/timezone'
import { extractErrorMessage } from '@/utils/api'
import { chatApi } from '@/api/chat'
import { metadataApi } from '@/api/metadata'
import { todosApi } from '@/api/todos'
import MetadataFieldEditor from '@/components/MetadataFieldEditor.vue'
import MetadataChipsEditor from '@/components/MetadataChipsEditor.vue'
import RetryDialog from '@/components/RetryDialog.vue'
import TodoItem from '@/components/TodoItem.vue'
import TodoEditor from '@/components/TodoEditor.vue'
import InlineMarkdownEditor from '@/components/InlineMarkdownEditor.vue'
import InlineArrayEditor from '@/components/InlineArrayEditor.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const preferencesStore = usePreferencesStore()
const toast = useToast()

const threadline = ref(null)
const loading = ref(false)
const error = ref('')
const deleting = ref(false)
const retrying = ref(false)
const showRetryDialog = ref(false)
const showActionMenu = ref(false)
const actionMenuRef = ref(null)
let retryPollInterval = null
let retryPollStartTime = null
const MAX_POLL_DURATION = 5 * 60 * 1000 // 5 minutes max polling

// Copy states for different content sections
const copiedStates = ref({
  summary: false,
  llm: false,
  details: false,
  keyProcess: false
})

const detailsEditorRef = ref(null)
const keyProcessEditorRef = ref(null)

const showEditor = ref(false)
const editorKey = ref('')
const editorValue = ref(null)
const savingKeys = ref(new Set())
const errorsByKey = ref({})

const openEdit = (key) => {
  editorKey.value = key
  editorValue.value = threadline.value?.metadata
    ? threadline.value.metadata[key]
    : null
  showEditor.value = true
}

const openAdd = () => {
  const k = prompt('Enter new metadata key')
  if (!k) return
  editorKey.value = k
  editorValue.value = ''
  showEditor.value = true
}

const closeEditor = () => {
  showEditor.value = false
}

const saveEditor = async (newValue) => {
  if (!threadline.value) return
  const id = route.params.id
  const key = editorKey.value

  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  const next = { ...prev, [key]: newValue }

  threadline.value = { ...threadline.value, metadata: next }
  showEditor.value = false
  try {
    savingKeys.value.add(key)
    delete errorsByKey.value[key]
    await metadataApi.patchThreadlineMetadata(id, { [key]: newValue })
  } catch (err) {
    console.error('Failed to save metadata:', err)
    threadline.value = { ...threadline.value, metadata: prev }
    errorsByKey.value[key] = err?.response?.data?.message || '保存失败'
  } finally {
    savingKeys.value.delete(key)
  }
}

const onChipsChange = (key, value) => {
  if (!threadline.value) return
  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  const next = { ...prev, [key]: value }
  threadline.value = { ...threadline.value, metadata: next }
}

const onChipsSave = async (key, value) => {
  if (!threadline.value) return
  const id = route.params.id
  const prev = threadline.value.metadata ? { ...threadline.value.metadata } : {}
  try {
    savingKeys.value.add(key)
    delete errorsByKey.value[key]
    const response = await metadataApi.patchThreadlineMetadata(id, { [key]: value })
    // Update local state with the saved value from response
    // Response format: { code, message, data: { uuid, metadata } }
    if (response && response.data && response.data.metadata) {
      threadline.value.metadata = response.data.metadata
    } else {
      // Fallback: update with the value we sent
      if (threadline.value.metadata) {
        threadline.value.metadata[key] = value
      } else {
        threadline.value.metadata = { [key]: value }
      }
    }
  } catch (err) {
    console.error('Failed to save metadata:', err)
    threadline.value = { ...threadline.value, metadata: prev }
    errorsByKey.value[key] = err?.response?.data?.message || '保存失败'
  } finally {
    savingKeys.value.delete(key)
  }
}

const loadThreadline = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await chatApi.getThreadline(route.params.id)
    // Handle the actual response format from backend
    const data = response.data.data || response.data
    threadline.value = data

    // If status is processing, start polling and show loading state
    if (data.status === 'processing') {
      retrying.value = true
      stopRetryPolling() // Clear any existing polling
      retryPollStartTime = Date.now()
      retryPollInterval = setInterval(pollThreadlineStatus, 2000)
      // Poll immediately
      pollThreadlineStatus()
    }
  } catch (err) {
    console.error('Failed to load threadline:', err)

    // If resource not found (404), redirect to 404 page
    if (err.response?.status === 404) {
      router.push({ name: 'NotFound' })
      return
    }

    error.value = err.response?.data?.message || 'Failed to load threadline'
  } finally {
    loading.value = false
  }
}

const deleteThreadline = async () => {
  if (!confirm('Are you sure you want to delete this threadline?')) return

  deleting.value = true

  try {
    await chatApi.deleteThreadline(route.params.id)
    router.push('/dashboard')
  } catch (err) {
    console.error('Delete failed:', err)
    toast.showError(
      extractErrorMessage(err, t('common.error') + ': ' + t('common.delete'))
    )
  } finally {
    deleting.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}

const stopRetryPolling = () => {
  if (retryPollInterval) {
    clearInterval(retryPollInterval)
    retryPollInterval = null
  }
  retryPollStartTime = null
}

const pollThreadlineStatus = async () => {
  try {
    // Check if we've been polling too long
    if (
      retryPollStartTime &&
      Date.now() - retryPollStartTime > MAX_POLL_DURATION
    ) {
      stopRetryPolling()
      retrying.value = false
      console.warn('Polling timeout: exceeded maximum duration')
      return
    }

    const response = await chatApi.getThreadline(route.params.id)
    const data = response.data.data || response.data
    threadline.value = data

    // Check if processing is complete
    const status = data.status

    // Keep retrying state true if status is processing
    if (status === 'processing') {
      retrying.value = true
      // Continue polling, don't stop
      return
    }

    if (status === 'success' || status === 'failed') {
      // Processing complete, stop polling
      stopRetryPolling()
      retrying.value = false

      // Success or failure is already visible in the UI through status update
      // No need for alert
    }
    // For other statuses (like fetched), continue polling until we get processing or final status
  } catch (err) {
    console.error('Failed to poll threadline status:', err)
    // On error, stop polling
    stopRetryPolling()
    retrying.value = false
  }
}

const handleRetryClick = () => {
  // Prevent opening dialog if already processing or retrying
  if (isProcessing.value || retrying.value || deleting.value) {
    return
  }
  showRetryDialog.value = true
}

const handleRetry = async (options) => {
  showRetryDialog.value = false
  retrying.value = true

  try {
    await chatApi.retryThreadline(route.params.id, options)

    // Backend now immediately sets status to PROCESSING
    // Start polling for status updates right away
    stopRetryPolling() // Clear any existing polling
    retryPollStartTime = Date.now()
    retryPollInterval = setInterval(pollThreadlineStatus, 2000)

    // Poll immediately to get the updated status
    await pollThreadlineStatus()
  } catch (err) {
    console.error('Retry failed:', err)
    stopRetryPolling()
    retrying.value = false
    retryPollStartTime = null
    toast.showError(err.response?.data?.message || t('retry.retryError'))
  }
}

const formatDate = (dateString) => {
  if (!dateString) return t('common.noData')

  // Use different date format based on language
  const dateFormat =
    preferencesStore.currentLanguage === 'zh-CN'
      ? 'yyyy年MM月dd日 HH:mm'
      : 'MMM dd, yyyy HH:mm'

  return formatDateUtil(
    dateString,
    preferencesStore.currentTimezone,
    dateFormat,
    preferencesStore.currentLanguage
  )
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleClickOutside = (event) => {
  if (actionMenuRef.value && !actionMenuRef.value.contains(event.target)) {
    showActionMenu.value = false
  }
}

onMounted(() => {
  loadThreadline()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopRetryPolling()
  document.removeEventListener('click', handleClickOutside)
})

const isSaving = (key) => savingKeys.value.has(key)
const fieldError = (key) => errorsByKey.value[key]

// Check if email is currently processing
const isProcessing = computed(() => {
  return threadline.value?.status === 'processing'
})

const isAnySaving = computed(
  () =>
    isSaving('category') ||
    isSaving('participants') ||
    isSaving('keywords')
)

const captureScrollPosition = () => {
  if (typeof window === 'undefined') {
    return 0
  }
  return window.scrollY || 0
}

const restoreScrollPosition = async (position) => {
  if (typeof window === 'undefined') {
    return
  }
  await nextTick()
  window.scrollTo({
    top: position,
    behavior: 'auto'
  })
}

// Format detection
const hasNewFormat = computed(() => {
  if (!threadline.value || !threadline.value.summary_data) {
    return false
  }
  let sd = threadline.value.summary_data
  // Handle string format (should be parsed by backend, but handle both)
  if (typeof sd === 'string') {
    try {
      sd = JSON.parse(sd)
    } catch (e) {
      return false
    }
  }
  return (
    (sd.details && sd.details.trim()) ||
    (Array.isArray(sd.key_process) && sd.key_process.length > 0)
  )
})

const summaryData = computed(() => {
  if (!threadline.value || !threadline.value.summary_data) {
    return { details: '', key_process: [] }
  }
  let sd = threadline.value.summary_data
  // Handle string format (should be parsed by backend, but handle both)
  if (typeof sd === 'string') {
    try {
      sd = JSON.parse(sd)
    } catch (e) {
      return { details: '', key_process: [] }
    }
  }
  return {
    details: sd.details || '',
    key_process: sd.key_process || []
  }
})

const threadlineTodos = computed(() => {
  if (!threadline.value || !threadline.value.todos) {
    return []
  }

  const todos = [...threadline.value.todos]

  // Sort by deadline from earliest to latest
  return todos.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0
    if (!a.deadline) return 1 // No deadline goes to end
    if (!b.deadline) return -1
    return new Date(a.deadline) - new Date(b.deadline)
  })
})

// TODO management
const showTodoEditor = ref(false)
const editingTodo = ref(null)
const savingTodo = ref(false)
const todoLoading = ref({})
const todoErrorMessage = ref('')
const todoSuccessMessage = ref('')
const tempNewTodo = ref(null)
const savingNewTodo = ref(false)
const editingTodoIds = ref(new Set())

const handleAddTodo = () => {
  if (!threadline.value || !threadline.value.id) {
    todoErrorMessage.value =
      t('todos.error.noEmailMessage') ||
      'Cannot create TODO: Email message not loaded'
    return
  }

  // Create temporary todo with default values
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  tempNewTodo.value = {
    id: `temp-${Date.now()}`,
    content: '',
    priority: null, // Empty by default
    owner: '',
    deadline: `${year}-${month}-${day}T${hours}:${minutes}`, // Current time
    location: '',
    is_completed: false,
    isNew: true
  }
}

const saveNewTodo = async (todoId, todoData) => {
  // Validate - content is required
  if (!todoData.content || !todoData.content.trim()) {
    // This validation should be handled by TodoItem component
    // but we also check here as a safeguard
    throw new Error(t('todos.content') + ' ' + (t('common.required') || '必填'))
  }

  savingNewTodo.value = true
  todoErrorMessage.value = ''
  todoSuccessMessage.value = ''
  const tempId = tempNewTodo.value?.id

  try {
    const response = await todosApi.createTodo({
      ...todoData,
      email_message_id: threadline.value?.id
    })
    const newTodo = response.data.data || response.data

    // Add new todo to actual todos list
    if (threadline.value) {
      if (!threadline.value.todos) {
        threadline.value.todos = []
      }
      threadline.value.todos.push(newTodo)
    }

    // Wait for next tick to ensure TodoItem has processed the save
    // and emitted editing-change event, then clear states
    await nextTick()

    // Clear editing state for the temp todo
    if (tempId) {
      editingTodoIds.value.delete(tempId)
    }

    // Clear tempNewTodo to re-enable the add button
    tempNewTodo.value = null

    todoSuccessMessage.value =
      t('todos.createSuccess') || 'TODO created successfully'

    setTimeout(() => {
      todoSuccessMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to create todo:', err)
    // Clear editing state even on error
    if (tempId) {
      editingTodoIds.value.delete(tempId)
    }
    todoErrorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.save')
    )
    throw err // Re-throw to let TodoItem handle the error
  } finally {
    savingNewTodo.value = false
  }
}

const cancelNewTodo = () => {
  if (tempNewTodo.value) {
    editingTodoIds.value.delete(tempNewTodo.value.id)
  }
  tempNewTodo.value = null
}

const handleTodoEditingChange = (todoId, isEditing) => {
  if (!todoId) {
    console.warn('handleTodoEditingChange called without todoId')
    return
  }

  if (isEditing) {
    editingTodoIds.value.add(todoId)
  } else {
    editingTodoIds.value.delete(todoId)
  }
}

const handleEditTodo = (todo) => {
  editingTodo.value = todo
  showTodoEditor.value = true
}

const handleSaveTodoInline = async (todoId, todoData) => {
  todoLoading.value[todoId] = true
  todoErrorMessage.value = ''
  todoSuccessMessage.value = ''
  try {
    const response = await todosApi.updateTodo(todoId, todoData)
    const updatedTodo = response.data.data || response.data

    // Update local state instead of reloading entire threadline
    if (threadline.value && threadline.value.todos) {
      const index = threadline.value.todos.findIndex((t) => t.id === todoId)
      if (index !== -1) {
        threadline.value.todos[index] = updatedTodo
      }
    }

    todoSuccessMessage.value =
      t('todos.updateSuccess') || 'TODO updated successfully'

    setTimeout(() => {
      todoSuccessMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to save todo:', err)
    todoErrorMessage.value = extractErrorMessage(
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
  todoErrorMessage.value = ''
  todoSuccessMessage.value = ''
  try {
    if (editingTodo.value) {
      const response = await todosApi.updateTodo(editingTodo.value.id, todoData)
      const updatedTodo = response.data.data || response.data

      // Update local state instead of reloading entire threadline
      if (threadline.value && threadline.value.todos) {
        const index = threadline.value.todos.findIndex(
          (t) => t.id === editingTodo.value.id
        )
        if (index !== -1) {
          threadline.value.todos[index] = updatedTodo
        }
      }

      todoSuccessMessage.value =
        t('todos.updateSuccess') || 'TODO updated successfully'
    } else {
      const response = await todosApi.createTodo(todoData)
      const newTodo = response.data.data || response.data

      // Add new todo to local state instead of reloading entire threadline
      if (threadline.value) {
        if (!threadline.value.todos) {
          threadline.value.todos = []
        }
        threadline.value.todos.push(newTodo)
      }

      todoSuccessMessage.value =
        t('todos.createSuccess') || 'TODO created successfully'
    }
    showTodoEditor.value = false
    editingTodo.value = null

    setTimeout(() => {
      todoSuccessMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to save todo:', err)
    todoErrorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.save')
    )
  } finally {
    savingTodo.value = false
  }
}

const handleToggleTodo = async (todoId) => {
  todoLoading.value[todoId] = true
  todoErrorMessage.value = ''
  try {
    const todo = threadlineTodos.value.find((t) => t.id === todoId)
    if (!todo) return

    const response = await todosApi.updateTodo(todoId, {
      is_completed: !todo.is_completed
    })
    const updatedTodo = response.data.data || response.data

    // Update local state instead of reloading entire threadline
    if (threadline.value && threadline.value.todos) {
      const index = threadline.value.todos.findIndex((t) => t.id === todoId)
      if (index !== -1) {
        threadline.value.todos[index] = updatedTodo
      }
    }
  } catch (err) {
    console.error('Failed to toggle todo:', err)
    todoErrorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.markCompleted')
    )
  } finally {
    todoLoading.value[todoId] = false
  }
}

const handleDeleteTodo = async (todoId) => {
  todoLoading.value[todoId] = true
  todoErrorMessage.value = ''
  try {
    await todosApi.deleteTodo(todoId)

    // Remove todo from local state instead of reloading entire threadline
    if (threadline.value && threadline.value.todos) {
      threadline.value.todos = threadline.value.todos.filter(
        (t) => t.id !== todoId
      )
    }

    todoSuccessMessage.value =
      t('todos.deleteSuccess') || 'TODO deleted successfully'
    setTimeout(() => {
      todoSuccessMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to delete todo:', err)
    todoErrorMessage.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('todos.delete')
    )
  } finally {
    todoLoading.value[todoId] = false
  }
}

// Title editing
const editingTitle = ref(false)
const editingTitleValue = ref('')
const savingTitle = ref(false)
const titleError = ref('')
const titleInputRef = ref(null)

const startEditingTitle = () => {
  editingTitleValue.value =
    threadline.value?.summary_title ||
    threadline.value?.subject ||
    ''
  editingTitle.value = true
  nextTick(() => {
    if (titleInputRef.value) {
      titleInputRef.value.focus()
    }
  })
}

const cancelEditingTitle = () => {
  editingTitle.value = false
  editingTitleValue.value = ''
  titleError.value = ''
}

const saveTitle = async () => {
  if (!threadline.value) return
  savingTitle.value = true
  titleError.value = ''

  const id = route.params.id
  const originalTitle = threadline.value.summary_title

  try {
    const response = await chatApi.updateThreadline(id, {
      summary_title: editingTitleValue.value.trim()
    })
    const updatedData = response.data.data || response.data
    threadline.value = { ...threadline.value, ...updatedData }
    editingTitle.value = false
  } catch (err) {
    console.error('Failed to save title:', err)
    titleError.value =
      extractErrorMessage(err, t('common.error') + ': ' + t('common.save'))
  } finally {
    savingTitle.value = false
  }
}

// Details editing
const detailsValue = computed({
  get: () => summaryData.value.details || '',
  set: (val) => {
    if (!threadline.value) return
    if (!threadline.value.summary_data) {
      threadline.value.summary_data = {}
    }
    threadline.value.summary_data = {
      ...threadline.value.summary_data,
      details: val
    }
  }
})
const savingDetails = ref(false)
const detailsError = ref('')
const editingDetails = ref(false)
const editingKeyProcess = ref(false)

const cancelEditingDetails = () => {
  detailsError.value = ''
  editingDetails.value = false
}

const saveDetails = async (value) => {
  if (!threadline.value) return
  savingDetails.value = true
  detailsError.value = ''

  const id = route.params.id
  const currentSummaryData = threadline.value.summary_data || {}
  const originalDetails = currentSummaryData.details

  try {
    const updatedSummaryData = {
      ...currentSummaryData,
      details: value
    }
    const response = await chatApi.updateThreadline(id, {
      summary_data: updatedSummaryData
    })
    const updatedData = response.data.data || response.data
    threadline.value = { ...threadline.value, ...updatedData }
    editingDetails.value = false
  } catch (err) {
    console.error('Failed to save details:', err)
    detailsError.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('common.save')
    )
    if (threadline.value.summary_data) {
      threadline.value.summary_data.details = originalDetails
    }
  } finally {
    savingDetails.value = false
  }
}

// Key process editing
const keyProcessValue = computed({
  get: () => summaryData.value.key_process || [],
  set: (val) => {
    if (!threadline.value) return
    if (!threadline.value.summary_data) {
      threadline.value.summary_data = {}
    }
    threadline.value.summary_data = {
      ...threadline.value.summary_data,
      key_process: val
    }
  }
})
const savingKeyProcess = ref(false)
const keyProcessError = ref('')

const cancelEditingKeyProcess = () => {
  keyProcessError.value = ''
  editingKeyProcess.value = false
}

const saveKeyProcess = async (value) => {
  if (!threadline.value) return
  savingKeyProcess.value = true
  keyProcessError.value = ''

  const id = route.params.id
  const currentSummaryData = threadline.value.summary_data || {}
  const originalKeyProcess = currentSummaryData.key_process

  try {
    const updatedSummaryData = {
      ...currentSummaryData,
      key_process: value
    }
    const response = await chatApi.updateThreadline(id, {
      summary_data: updatedSummaryData
    })
    const updatedData = response.data.data || response.data
    threadline.value = { ...threadline.value, ...updatedData }
    editingKeyProcess.value = false
  } catch (err) {
    console.error('Failed to save key process:', err)
    keyProcessError.value = extractErrorMessage(
      err,
      t('common.error') + ': ' + t('common.save')
    )
    if (threadline.value.summary_data) {
      threadline.value.summary_data.key_process = originalKeyProcess
    }
  } finally {
    savingKeyProcess.value = false
  }
}

// Copy content function
const copyContent = async (content, section) => {
  if (!content) return

  try {
    // Extract plain text from markdown content
    // Remove markdown syntax but preserve line breaks
    let textContent = content
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove headers
      .replace(/^#+\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    await navigator.clipboard.writeText(textContent)
    copiedStates.value[section] = true
    setTimeout(() => {
      copiedStates.value[section] = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy content:', error)
  }
}

const openDetailsEditor = () => {
  if (isProcessing.value || editingDetails.value) return
  detailsEditorRef.value?.startEditing()
  editingDetails.value = true
}

const openKeyProcessEditor = () => {
  if (isProcessing.value || editingKeyProcess.value) return
  keyProcessEditorRef.value?.startEditing()
  editingKeyProcess.value = true
}

// Copy key process function
const copyKeyProcess = async () => {
  if (!summaryData.value.key_process || summaryData.value.key_process.length === 0) {
    return
  }

  try {
    const textContent = summaryData.value.key_process
      .map((item, index) => `${index + 1}. ${item}`)
      .join('\n')

    await navigator.clipboard.writeText(textContent)
    copiedStates.value.keyProcess = true
    setTimeout(() => {
      copiedStates.value.keyProcess = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy key process:', error)
  }
}
</script>

<style scoped>
/* Todo list animation */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
