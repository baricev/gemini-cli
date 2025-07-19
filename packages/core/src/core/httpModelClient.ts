/**
 * Vendor-neutral HTTP client that communicates with a model server using
 * a base URL and API key authentication.
 */
import type {
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
  GenerateContentParameters,
  GenerateContentResponse,
} from '@google/genai';

export interface HttpModelClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export class HttpModelClient {
  constructor(private readonly config: HttpModelClientConfig) {}

  private async request<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  }

  async generateContent(
    req: GenerateContentParameters,
  ): Promise<GenerateContentResponse> {
    return this.request<GenerateContentResponse>('/generate', {
      model: this.config.model,
      ...req,
    });
  }

  async generateContentStream(
    req: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const resp = await this.request<GenerateContentResponse>('/generate', {
      model: this.config.model,
      ...req,
    });
    async function* gen() {
      yield resp;
    }
    return gen();
  }

  async countTokens(
    req: CountTokensParameters,
  ): Promise<CountTokensResponse> {
    return this.request<CountTokensResponse>('/countTokens', req);
  }

  async embedContent(
    req: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    return this.request<EmbedContentResponse>('/embed', req);
  }
}
