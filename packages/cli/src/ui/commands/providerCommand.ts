/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType } from '@google/gemini-cli-core';
import {
  type CommandContext,
  type SlashCommand,
  type SlashCommandActionReturn,
} from './types.js';
import { MessageType } from '../types.js';
import { SettingScope } from '../../config/settings.js';

const PROVIDER_MAP: Record<string, AuthType> = {
  google: AuthType.LOGIN_WITH_GOOGLE,
  gemini: AuthType.USE_GEMINI,
  vertex: AuthType.USE_VERTEX_AI,
  deepseek: AuthType.USE_DEEPSEEK,
  cloudshell: AuthType.CLOUD_SHELL,
};

export const providerCommand: SlashCommand = {
  name: 'provider',
  description: 'switch provider and model. Usage: /provider <provider> [model]',
  async action(context: CommandContext, args: string): Promise<void | SlashCommandActionReturn> {
    const parts = args.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return {
        type: 'message',
        messageType: 'error',
        content: 'Usage: /provider <google|gemini|vertex|deepseek> [model]',
      };
    }
    const providerArg = parts[0].toLowerCase();
    const modelArg = parts[1];
    const authType = PROVIDER_MAP[providerArg];
    if (!authType) {
      return {
        type: 'message',
        messageType: 'error',
        content: `Unknown provider: ${providerArg}`,
      };
    }
    const config = context.services.config;
    if (!config) {
      return {
        type: 'message',
        messageType: 'error',
        content: 'Configuration unavailable.',
      };
    }

    await config.refreshAuth(authType);
    if (modelArg) {
      config.setModel(modelArg);
    }
    context.services.settings.setValue(SettingScope.User, 'selectedAuthType', authType);

    context.ui.addItem(
      {
        type: MessageType.INFO,
        text: `Switched provider to ${providerArg} using model ${config.getModel()}.`,
      },
      Date.now(),
    );
  },
};
