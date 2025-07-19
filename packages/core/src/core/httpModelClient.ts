import {
  CountTokensParameters,
  CountTokensResponse,
  GenerateContentParameters,
  GenerateContentResponse,
  EmbedContentParameters,
  EmbedContentResponse,
} from '@google/genai';
import { ContentGenerator } from './contentGenerator.js';

export class HttpModelClient implements ContentGenerator {
  constructor(private baseUrl: string, private apiKey: string) {}

  private async request<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  }

  async generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse> {
    return this.request<GenerateContentResponse>('generate', request);
  }

  async generateContentStream(
    request: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const res = await fetch(`${this.baseUrl}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Stream request failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    async function* streamGenerator(): AsyncGenerator<GenerateContentResponse> {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        try {
          yield JSON.parse(chunk) as GenerateContentResponse;
        } catch {
          // Ignore parse errors for partial chunks
        }
      }
    }

    return streamGenerator();
  }

  async countTokens(request: CountTokensParameters): Promise<CountTokensResponse> {
    return this.request<CountTokensResponse>('countTokens', request);
  }

  async embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse> {
    return this.request<EmbedContentResponse>('embed', request);
  }
}
