/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GenerateContentParameters,
  GenerateContentResponse,
  Content,
  Part,
  Tool,
} from '@google/genai';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
}

export interface DeepSeekToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface DeepSeekChatRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stop?: string[];
  stream?: boolean;
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }>;
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}

export interface DeepSeekChatResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string | null;
      tool_calls?: DeepSeekToolCall[];
    };
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cache_hit_tokens?: number;
  };
}

export function convertGeminiToDeepSeek(request: GenerateContentParameters): DeepSeekChatRequest {
  const messages: DeepSeekMessage[] = [];
  
  // Convert system instruction if present
  if (request.config?.systemInstruction) {
    let systemText = '';
    if (typeof request.config.systemInstruction === 'string') {
      systemText = request.config.systemInstruction;
    } else if (request.config.systemInstruction && typeof request.config.systemInstruction === 'object') {
      if ('text' in request.config.systemInstruction) {
        systemText = request.config.systemInstruction.text || '';
      } else if ('parts' in request.config.systemInstruction) {
        systemText = extractTextFromParts(request.config.systemInstruction.parts || []);
      }
    }
    
    if (systemText) {
      messages.push({
        role: 'system',
        content: systemText
      });
    }
  }

  // Convert content messages
  if (request.contents) {
    const contents = Array.isArray(request.contents) ? request.contents : [request.contents];
    for (const content of contents) {
      if (typeof content === 'object' && 'parts' in content && 'role' in content) {
        const messageText = extractTextFromParts(content.parts || []);
        if (messageText) {
          messages.push({
            role: content.role === 'model' ? 'assistant' : content.role as 'user',
            content: messageText
          });
        }
      }
    }
  }

  const deepseekRequest: DeepSeekChatRequest = {
    model: request.model,
    messages,
    temperature: request.config?.temperature,
    top_p: request.config?.topP,
    max_tokens: request.config?.maxOutputTokens,
    stop: request.config?.stopSequences,
    stream: false
  };

  // Convert tools if present
  if (request.config?.tools && Array.isArray(request.config.tools) && request.config.tools.length > 0) {
    const tools = convertGeminiToolsToDeepSeek(request.config.tools);
    if (tools.length > 0) {
      deepseekRequest.tools = tools;
      deepseekRequest.tool_choice = 'auto';
    }
  }

  return deepseekRequest;
}

export function convertDeepSeekToGemini(response: DeepSeekChatResponse): GenerateContentResponse {
  const choice = response.choices[0];
  if (!choice) {
    throw new Error('No choices in DeepSeek response');
  }

  const parts: Part[] = [];
  
  // Add text content if present
  if (choice.message.content) {
    parts.push({ text: choice.message.content });
  }

  // Add function calls if present
  if (choice.message.tool_calls) {
    for (const toolCall of choice.message.tool_calls) {
      parts.push({
        functionCall: {
          name: toolCall.function.name,
          args: JSON.parse(toolCall.function.arguments)
        }
      });
    }
  }

  return {
    candidates: [{
      content: {
        parts,
        role: 'model'
      },
      finishReason: mapFinishReason(choice.finish_reason)
    }],
    usageMetadata: {
      promptTokenCount: response.usage.prompt_tokens,
      candidatesTokenCount: response.usage.completion_tokens,
      totalTokenCount: response.usage.total_tokens,
      cachedContentTokenCount: response.usage.cache_hit_tokens
    }
  } as any;
}

function extractTextFromParts(parts: Part[]): string {
  return parts
    .filter(part => part.text)
    .map(part => part.text || '')
    .join('');
}

function convertGeminiToolsToDeepSeek(tools: any[]): Array<{
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}> {
  const deepseekTools: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }> = [];

  for (const tool of tools) {
    if (tool.functionDeclarations) {
      for (const func of tool.functionDeclarations) {
        // Convert Gemini schema format to JSON Schema format compatible with DeepSeek
        const convertedParameters = convertGeminiSchemaToJsonSchema(func.parameters || {});
        
        deepseekTools.push({
          type: 'function',
          function: {
            name: func.name,
            description: func.description || '',
            parameters: convertedParameters
          }
        });
      }
    }
  }

  return deepseekTools;
}

function convertGeminiSchemaToJsonSchema(geminiSchema: any): Record<string, any> {
  if (!geminiSchema || typeof geminiSchema !== 'object') {
    return {
      type: 'object',
      properties: {},
      required: []
    };
  }

  const jsonSchema: any = {
    type: 'object',
    properties: {},
    required: []
  };

  if (geminiSchema.properties) {
    for (const [propName, propDef] of Object.entries(geminiSchema.properties)) {
      const propSchema: any = propDef;
      
      // Convert Gemini type format to JSON Schema format
      if (propSchema.type === 'STRING') {
        jsonSchema.properties[propName] = { type: 'string' };
      } else if (propSchema.type === 'NUMBER') {
        jsonSchema.properties[propName] = { type: 'number' };
      } else if (propSchema.type === 'INTEGER') {
        jsonSchema.properties[propName] = { type: 'integer' };
      } else if (propSchema.type === 'BOOLEAN') {
        jsonSchema.properties[propName] = { type: 'boolean' };
      } else if (propSchema.type === 'ARRAY') {
        jsonSchema.properties[propName] = { 
          type: 'array',
          items: propSchema.items ? convertGeminiSchemaToJsonSchema(propSchema.items) : {}
        };
      } else if (propSchema.type === 'OBJECT') {
        jsonSchema.properties[propName] = convertGeminiSchemaToJsonSchema(propSchema);
      } else {
        // Default to string if type is unknown
        jsonSchema.properties[propName] = { type: 'string' };
      }

      // Add description if available
      if (propSchema.description) {
        jsonSchema.properties[propName].description = propSchema.description;
      }
    }
  }

  // Add required fields
  if (geminiSchema.required && Array.isArray(geminiSchema.required)) {
    jsonSchema.required = geminiSchema.required;
  }

  return jsonSchema;
}

function mapFinishReason(reason: string): any {
  switch (reason) {
    case 'stop':
      return 'STOP';
    case 'length':
      return 'MAX_TOKENS';
    case 'tool_calls':
      return 'STOP'; // Gemini doesn't have a specific tool_calls finish reason
    case 'content_filter':
      return 'SAFETY';
    default:
      return 'OTHER';
  }
}