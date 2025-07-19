/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Provider {
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek'
}

export const SUPPORTED_PROVIDERS = [Provider.GEMINI, Provider.DEEPSEEK] as const;

export type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

export function isValidProvider(provider: string): provider is SupportedProvider {
  return SUPPORTED_PROVIDERS.includes(provider as SupportedProvider);
}