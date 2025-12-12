import { GoogleGenAI } from '@google/genai'
import type { AIServiceConfig, GenerateContentOptions } from '../types'

export class AIService {
  private ai: GoogleGenAI
  private model: string

  constructor(config: AIServiceConfig) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey })
    this.model = config.model || 'gemini-2.0-flash-exp'
  }

  async generateContent(options: GenerateContentOptions): Promise<string> {
    const { prompt, location } = options

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: `${prompt}

Location Input: ${location}`,
    })

    return response.text ?? ''
  }

  static isApiKeyValid(apiKey: string | undefined): boolean {
    return !!apiKey && apiKey !== 'your_api_key_here'
  }
}

export const createAIService = (apiKey: string, model?: string): AIService => {
  return new AIService({ apiKey, model })
}
