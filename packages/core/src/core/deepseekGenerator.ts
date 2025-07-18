/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import OpenAI from 'openai';
import { ContentGenerator } from './contentGenerator.js';
import {
  GenerateContentParameters,
  GenerateContentResponse,
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
  Part,
  PartUnion,
  Content,
} from '@google/genai';

const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function normalizeContent(
  value: Content | PartUnion | string | Array<PartUnion | string>,
): Content {
  if (Array.isArray(value)) {
    return {
      role: 'user',
      parts: value.map((v) => (typeof v === 'string' ? { text: v } : v)),
    };
  }
  if (typeof value === 'string') {
    return { role: 'user', parts: [{ text: value }] };
  }
  if ('parts' in (value as Content)) {
    return value as Content;
  }
  return { role: 'user', parts: [value as Part] };
}

function toOpenAIMessages(
  contents: Array<Content | PartUnion | string | Array<PartUnion | string>>,
): ChatMessage[] {
  return contents.map((c) => {
    const normalized = normalizeContent(c);
    const text = (normalized.parts ?? [])
      .map((p: Part | string) => {
        if (typeof p === 'string') return p;
        return 'text' in p && (p as Part).text
          ? ((p as Part).text as string)
          : '';
      })
      .join('');
    const role =
      normalized.role === 'model' ? 'assistant' : (normalized.role ?? 'user');
    return { role: role as ChatMessage['role'], content: text };
  });
}

function fromOpenAI(content: string): GenerateContentResponse {
  const response = new GenerateContentResponse();
  response.candidates = [
    {
      content: { role: 'model', parts: [{ text: content }] },
    },
  ];
  return response;
}

export function createDeepseekGenerator(
  apiKey: string,
  model: string,
  baseUrl?: string,
): ContentGenerator {
  const client = new OpenAI({ apiKey, baseURL: baseUrl || DEFAULT_BASE_URL });

  return {
    async generateContent(params: GenerateContentParameters) {
      const messages = toOpenAIMessages(
        Array.isArray(params.contents) ? params.contents : [params.contents],
      );
      const resp = await client.chat.completions.create({
        model: params.model ?? model,
        messages,
      });
      const text = resp.choices[0]?.message?.content ?? '';
      return fromOpenAI(text);
    },

    async generateContentStream(params: GenerateContentParameters) {
      const result = await this.generateContent(params);
      async function* gen() {
        yield result;
      }
      return gen();
    },

    async countTokens(params: CountTokensParameters) {
      const messages = toOpenAIMessages(
        Array.isArray(params.contents) ? params.contents : [params.contents],
      );
      const resp = await client.chat.completions.create({
        model: params.model ?? model,
        messages,
        max_tokens: 0,
      });
      return {
        totalTokens: resp.usage?.prompt_tokens ?? 0,
      } as CountTokensResponse;
    },

    async embedContent(params: EmbedContentParameters) {
      const text = (
        Array.isArray(params.contents) ? params.contents : [params.contents]
      ).map((c: Content | PartUnion | string) => {
        const normalized = normalizeContent(c);
        return (normalized.parts ?? [])
          .map((p: Part | string) =>
            typeof p === 'string' ? p : ((p as Part).text ?? ''),
          )
          .join('');
      });
      const resp = await client.embeddings.create({
        model: params.model ?? 'deepseek-embedding',
        input: text,
      });
      return {
        embeddings: resp.data.map((d) => ({ values: d.embedding })),
      } as EmbedContentResponse;
    },
  } as ContentGenerator;
}
