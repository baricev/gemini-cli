/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from 'openai';
import {
  GenerateContentParameters,
  GenerateContentResponse,
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
  Part,
  Content,
} from '@google/genai';
import { ContentGenerator } from './contentGenerator.js';

function partsToText(parts: Part[]): string {
  return parts
    .map((p) => {
      if ('text' in p && typeof p.text === 'string') {
        return p.text;
      }
      return JSON.stringify(p);
    })
    .join(' ');
}

function contentToMessage(content: Content) {
  return {
    role: content.role === 'model' ? 'assistant' : (content.role ?? 'user'),
    content: partsToText(content.parts ?? []),
  } as OpenAI.ChatCompletionMessageParam;
}

export class DeepSeekGenerator implements ContentGenerator {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string, baseUrl?: string) {
    this.model = model;
    this.openai = new OpenAI({
      apiKey,
      baseURL: baseUrl ?? 'https://api.deepseek.com/v1',
    });
  }

  async generateContent(
    req: GenerateContentParameters,
  ): Promise<GenerateContentResponse> {
    const messages = (
      Array.isArray(req.contents) ? req.contents : [req.contents]
    ).map((c) => contentToMessage(c as Content));
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages,
    });
    return {
      candidates: [
        {
          content: {
            role: 'model',
            parts: [{ text: completion.choices[0]?.message?.content ?? '' }],
          },
          finishReason: completion.choices[0]?.finish_reason ?? undefined,
        },
      ],
      usageMetadata: {
        promptTokenCount: completion.usage?.prompt_tokens,
        candidatesTokenCount: completion.usage?.completion_tokens,
        totalTokenCount: completion.usage?.total_tokens,
      },
    } as unknown as GenerateContentResponse;
  }

  async generateContentStream(
    req: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const messages = (
      Array.isArray(req.contents) ? req.contents : [req.contents]
    ).map((c) => contentToMessage(c as Content));
    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
    });
    const streamIterator =
      stream as unknown as AsyncIterable<OpenAI.ChatCompletionChunk>;
    return (async function* () {
      for await (const chunk of streamIterator) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          yield {
            candidates: [{ content: { role: 'model', parts: [{ text }] } }],
          } as unknown as GenerateContentResponse;
        }
      }
    })();
  }

  async countTokens(req: CountTokensParameters): Promise<CountTokensResponse> {
    const messages = (
      Array.isArray(req.contents) ? req.contents : [req.contents]
    ).map((c) => contentToMessage(c as Content));
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 0,
    });
    return {
      totalTokens: completion.usage?.total_tokens,
    } as CountTokensResponse;
  }

  async embedContent(
    req: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    const inputContent = Array.isArray(req.contents)
      ? req.contents[0]
      : req.contents;
    const input = partsToText((inputContent as Content).parts ?? []);
    const embedding = await this.openai.embeddings.create({
      model: this.model,
      input,
    });
    return {
      embeddings: embedding.data.map((e) => ({ values: e.embedding })),
    } as EmbedContentResponse;
  }
}
