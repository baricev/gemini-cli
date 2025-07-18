/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { providerCommand } from './providerCommand.js';
import { type CommandContext } from './types.js';
import { createMockCommandContext } from '../../test-utils/mockCommandContext.js';
import { MessageType } from '../types.js';
import { AuthType } from '@google/gemini-cli-core';
import { SettingScope } from '../../config/settings.js';

describe('providerCommand', () => {
  let mockContext: CommandContext;
  const refreshAuth = vi.fn();
  const setModel = vi.fn();
  const getModel = vi.fn(() => 'deepseek-reasoner');
  const setValue = vi.fn();

  beforeEach(() => {
    mockContext = createMockCommandContext({
      services: {
        config: {
          refreshAuth,
          setModel,
          getModel,
        },
        settings: { setValue, merged: {} },
      },
    });
    refreshAuth.mockClear();
    setModel.mockClear();
    setValue.mockClear();
  });

  it('should return usage message when no args are provided', async () => {
    if (!providerCommand.action) throw new Error('no action');
    const result = await providerCommand.action(mockContext, '');
    expect(result).toEqual({
      type: 'message',
      messageType: 'error',
      content: 'Usage: /provider <google|gemini|vertex|deepseek> [model]',
    });
  });

  it('should refresh auth and set model', async () => {
    if (!providerCommand.action) throw new Error('no action');
    await providerCommand.action(mockContext, 'deepseek deepseek-reasoner');
    expect(refreshAuth).toHaveBeenCalledWith(AuthType.USE_DEEPSEEK);
    expect(setModel).toHaveBeenCalledWith('deepseek-reasoner');
    expect(setValue).toHaveBeenCalledWith(
      SettingScope.User,
      'selectedAuthType',
      AuthType.USE_DEEPSEEK,
    );
    expect(mockContext.ui.addItem).toHaveBeenCalledWith(
      {
        type: MessageType.INFO,
        text: expect.stringContaining('deepseek'),
      },
      expect.any(Number),
    );
  });
});
