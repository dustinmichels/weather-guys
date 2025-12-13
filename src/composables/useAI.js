import { ref } from 'vue'
import { MOCK_CONFIG, getRandomMockAIResponse } from '../config/mock.config.js'
import { ERROR_MESSAGES } from '../constants'
import { LOCATION_STEREOTYPE_PROMPT } from '../prompts'
import { AIService, createAIService } from '../services/ai.service'

export const useAI = () => {
  const aiResponse = ref(null)
  const aiLoading = ref(false)
  const aiService = ref(null)

  const initializeAI = (apiKey) => {
    if (!AIService.isApiKeyValid(apiKey)) {
      aiResponse.value = ERROR_MESSAGES.INVALID_API_KEY
      return false
    }

    try {
      aiService.value = createAIService(apiKey)
      return true
    } catch (err) {
      aiResponse.value = `Error initializing AI: ${err instanceof Error ? err.message : 'Unknown error'}`
      return false
    }
  }

  const generateResponse = async (location, customPrompt) => {
    if (!location) {
      aiResponse.value = ERROR_MESSAGES.NO_LOCATION_PROVIDED
      return
    }

    // Check if MOCK_AI mode is enabled
    const isMockAI = import.meta.env.VITE_MOCK_AI === 'true'

    if (isMockAI) {
      console.log('[MOCK MODE] Using mock AI response')
      aiLoading.value = true
      aiResponse.value = null

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, MOCK_CONFIG.DELAYS.ai))

      // Use random mock response or configured one
      const useRandom = import.meta.env.VITE_MOCK_AI_RANDOM === 'true'
      aiResponse.value = useRandom ? getRandomMockAIResponse() : MOCK_CONFIG.AI.response

      aiLoading.value = false
      return
    }

    if (!aiService.value) {
      aiResponse.value = ERROR_MESSAGES.AI_NOT_INITIALIZED
      return
    }

    aiLoading.value = true
    aiResponse.value = null

    try {
      const response = await aiService.value.generateContent({
        prompt: customPrompt || LOCATION_STEREOTYPE_PROMPT,
        location,
      })

      aiResponse.value = response
    } catch (err) {
      aiResponse.value = `Error getting AI response: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('AI Error:', err)
    } finally {
      aiLoading.value = false
    }
  }

  const reset = () => {
    aiResponse.value = null
    aiLoading.value = false
  }

  return {
    aiResponse,
    aiLoading,
    initializeAI,
    generateResponse,
    reset,
  }
}
