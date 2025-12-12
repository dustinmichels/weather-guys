import { ref } from 'vue'
import { AIService, createAIService } from '../services/ai.service'
import { LOCATION_STEREOTYPE_PROMPT } from '../prompts'
import { ERROR_MESSAGES } from '../constants'

export const useAI = () => {
  const aiResponse = ref<string | null>(null)
  const aiLoading = ref(false)
  const aiService = ref<AIService | null>(null)

  const initializeAI = (apiKey: string): boolean => {
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

  const generateResponse = async (location: string, customPrompt?: string): Promise<void> => {
    if (!location) {
      aiResponse.value = ERROR_MESSAGES.NO_LOCATION_PROVIDED
      return
    }

    // Check if MOCK mode is enabled
    const isMockMode = import.meta.env.VITE_MOCK === 'true'

    if (isMockMode) {
      aiLoading.value = true
      aiResponse.value = null

      // Simulate a brief delay to mimic API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockResponse = `Oh, you're from ${location}. That means you probably cycle everywhere in a tweed jacket, argue about the correct pronunciation of "scone," and have a punt with a tragic love story attached to it.`
      aiResponse.value = mockResponse

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
