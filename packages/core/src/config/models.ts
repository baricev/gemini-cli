/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Provider } from '../core/providers.js';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-pro';
export const DEFAULT_GEMINI_FLASH_MODEL = 'gemini-2.5-flash';
export const DEFAULT_GEMINI_EMBEDDING_MODEL = 'gemini-embedding-001';

export const DEEPSEEK_MODELS = {
  CHAT: 'deepseek-chat',
  REASONER: 'deepseek-reasoner'
} as const;

export const DEFAULT_DEEPSEEK_MODEL = DEEPSEEK_MODELS.CHAT;

export const PROVIDER_MODELS = {
  [Provider.GEMINI]: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-embedding-001'
  ],
  [Provider.DEEPSEEK]: [
    DEEPSEEK_MODELS.CHAT,
    DEEPSEEK_MODELS.REASONER
  ]
} as const;

export function getDefaultModelForProvider(provider: Provider): string {
  switch (provider) {
    case Provider.GEMINI:
      return DEFAULT_GEMINI_MODEL;
    case Provider.DEEPSEEK:
      return DEFAULT_DEEPSEEK_MODEL;
    default:
      return DEFAULT_GEMINI_MODEL;
  }
}

export function isValidModelForProvider(provider: Provider, model: string): boolean {
  const validModels = PROVIDER_MODELS[provider];
  return validModels.some(validModel => validModel === model);
}
