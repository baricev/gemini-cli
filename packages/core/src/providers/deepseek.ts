/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GenerateContentParameters,
  GenerateContentResponse,
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
} from '@google/genai';
import { ContentGenerator } from '../core/contentGenerator.js';
import {
  convertGeminiToDeepSeek,
  convertDeepSeekToGemini,
  DeepSeekChatResponse
} from './deepseek-converter.js';
import { UserTierId } from '../code_assist/types.js';

export class DeepSeekContentGenerator implements ContentGenerator {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com';
  private proxy?: string;

  constructor(apiKey: string, proxy?: string) {
    this.apiKey = apiKey;
    this.proxy = proxy;
  }

  async generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse> {
    const deepseekRequest = convertGeminiToDeepSeek(request);

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'GeminiCLI-DeepSeek'
      },
      body: JSON.stringify(deepseekRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const deepseekResponse: DeepSeekChatResponse = await response.json();
    return convertDeepSeekToGemini(deepseekResponse);
  }

  async generateContentStream(request: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>> {
    const self = this;

    return (async function* (): AsyncGenerator<GenerateContentResponse> {
      const deepseekRequest = convertGeminiToDeepSeek(request);
      deepseekRequest.stream = true;

      const response = await fetch(`${self.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${self.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'GeminiCLI-DeepSeek'
        },
        body: JSON.stringify(deepseekRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming request');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                return;
              }

              try {
                const parsed: DeepSeekChatResponse = JSON.parse(data);
                yield convertDeepSeekToGemini(parsed);
              } catch (error) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    })();
  }

  async countTokens(request: CountTokensParameters): Promise<CountTokensResponse> {
    // DeepSeek doesn't have a specific token counting endpoint
    // We'll estimate based on the text content
    let totalTokens = 0;

    if (request.contents) {
      const contents = Array.isArray(request.contents) ? request.contents : [request.contents];
      for (const content of contents) {
        if (typeof content === 'object' && 'parts' in content) {
          for (const part of content.parts || []) {
            if (part.text) {
              // Rough estimation: 1 token ≈ 4 characters for English text
              totalTokens += Math.ceil(part.text.length / 4);
            }
          }
        }
      }
    }

    return {
      totalTokens
    };
  }

  async embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse> {
    // DeepSeek doesn't provide embedding endpoints
    // This would need to be implemented if embedding functionality is required
    throw new Error('Embedding is not supported by DeepSeek provider');
  }

  async getTier(): Promise<UserTierId | undefined> {
    // DeepSeek doesn't have tier information like Google's Code Assist
    return undefined;
  }
}
