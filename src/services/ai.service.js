import { GoogleGenAI } from '@google/genai'

export class AIService {
  constructor(config) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey })
    this.model = config.model || 'gemini-2.0-flash-exp'
  }

  async generateContent(options) {
    const { prompt, location } = options

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: `${prompt}

Location Input: ${location}`,
    })

    return response.text ?? ''
  }

  static isApiKeyValid(apiKey) {
    return !!apiKey && apiKey !== 'your_api_key_here'
  }
}

export const createAIService = (apiKey, model) => {
  return new AIService({ apiKey, model })
}
