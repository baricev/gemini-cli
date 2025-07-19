## Repository map

#### Here are summaries of some files present in my git repository.
Do not propose changes to these files, treat them as *read-only*.
If you need to edit any of these files, ask me to *add them to the chat* first.


eslint-rules/no-relative-cross-package-imports.js:
⋮
│function findPackageName(filePath, root) {
│  let currentDir = path.dirname(path.resolve(filePath));
│  while (currentDir !== root) {
│    const parentDir = path.dirname(currentDir);
│    const packageJsonPath = path.join(currentDir, 'package.json');
│    if (fs.existsSync(packageJsonPath)) {
│      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
│      return pkg.name;
│    }
│
⋮

integration-tests/test-helper.js:
⋮
│function sanitizeTestName(name) {
│  return name
│    .toLowerCase()
│    .replace(/[^a-z0-9]/g, '-')
│    .replace(/-+/g, '-');
⋮

packages/cli/src/acp/acp.ts:
⋮
│type AnyMessage = AnyRequest | AnyResponse;
│
⋮
│type AnyResponse = { jsonrpc: '2.0'; id: number } & Result<unknown>;
│
⋮
│type ErrorResponse = {
│  code: number;
│  message: string;
│  data?: { details?: string };
⋮
│class Connection<D> {
│  #pendingResponses: Map<number, PendingResponse> = new Map();
│  #nextRequestId: number = 0;
│  #delegate: D;
│  #peerInput: WritableStream<Uint8Array>;
│  #writeQueue: Promise<void> = Promise.resolve();
│  #textEncoder: TextEncoder;
│
│  constructor(
│    delegate: D,
⋮
│export class RequestError extends Error {
│  data?: { details?: string };
│
│  constructor(
│    public code: number,
│    message: string,
│    details?: string,
│  ) {
│    super(message);
│    this.name = 'RequestError';
⋮
│export type AssistantMessageChunk =
│  | {
│      text: string;
│    }
│  | {
│      thought: string;
⋮
│export type ToolCallConfirmation =
│  | {
│      description?: string | null;
│      type: 'edit';
│    }
│  | {
│      description?: string | null;
│      type: 'execute';
│      command: string;
│      rootCommand: string;
⋮
│export type ToolCallStatus = 'running' | 'finished' | 'error';
│
│export type ToolCallId = number;
│
│export type ToolCallConfirmationOutcome =
│  | 'allow'
│  | 'alwaysAllow'
│  | 'alwaysAllowMcpServer'
│  | 'alwaysAllowTool'
│  | 'reject'
⋮
│export interface StreamAssistantMessageChunkParams {
│  chunk: AssistantMessageChunk;
⋮
│export interface RequestToolCallConfirmationParams {
│  confirmation: ToolCallConfirmation;
│  content?: ToolCallContent | null;
│  icon: Icon;
│  label: string;
│  locations?: ToolCallLocation[];
⋮
│export interface PushToolCallParams {
│  content?: ToolCallContent | null;
│  icon: Icon;
│  label: string;
│  locations?: ToolCallLocation[];
⋮
│export interface UpdateToolCallParams {
│  content: ToolCallContent | null;
│  status: ToolCallStatus;
│  toolCallId: ToolCallId;
⋮
│export interface InitializeParams {
│  /**
│   * The version of the protocol that the client supports.
│   * This should be the latest version supported by the client.
│   */
│  protocolVersion: string;
⋮
│export interface SendUserMessageParams {
│  chunks: UserMessageChunk[];
⋮
│export interface Error {
│  code: number;
│  data?: unknown;
│  message: string;
⋮

packages/cli/src/config/extension.ts:
⋮
│export interface ExtensionConfig {
│  name: string;
│  version: string;
│  mcpServers?: Record<string, MCPServerConfig>;
│  contextFileName?: string | string[];
│  excludeTools?: string[];
⋮

packages/cli/src/config/settings.ts:
⋮
│export enum SettingScope {
│  User = 'User',
│  Workspace = 'Workspace',
│  System = 'System',
⋮
│export interface CheckpointingSettings {
│  enabled?: boolean;
⋮
│export interface AccessibilitySettings {
│  disableLoadingPhrases?: boolean;
⋮
│export interface Settings {
│  theme?: string;
│  selectedAuthType?: AuthType;
│  sandbox?: boolean | string;
│  coreTools?: string[];
│  excludeTools?: string[];
│  toolDiscoveryCommand?: string;
│  toolCallCommand?: string;
│  mcpServerCommand?: string;
│  mcpServers?: Record<string, MCPServerConfig>;
⋮
│export interface SettingsFile {
│  settings: Settings;
│  path: string;
│}
│export class LoadedSettings {
│  constructor(
│    system: SettingsFile,
│    user: SettingsFile,
│    workspace: SettingsFile,
│    errors: SettingsError[],
│  ) {
│    this.system = system;
│    this.user = user;
│    this.workspace = workspace;
⋮

packages/cli/src/ui/commands/types.ts:
⋮
│export interface CommandContext {
│  // Core services and configuration
│  services: {
│    // TODO(abhipatel12): Ensure that config is never null.
│    config: Config | null;
│    settings: LoadedSettings;
│    git: GitService | undefined;
│    logger: Logger;
│  };
│  // UI state and history management
⋮
│export interface SlashCommand {
│  name: string;
│  altName?: string;
│  description?: string;
│
│  // The action to run. Optional for parent commands that only group sub-commands.
│  action?: (
│    context: CommandContext,
│    args: string,
│  ) =>
⋮

packages/cli/src/ui/components/AuthInProgress.tsx:
⋮
│interface AuthInProgressProps {
│  onTimeout: () => void;
⋮

packages/cli/src/ui/components/ContextSummaryDisplay.tsx:
⋮
│interface ContextSummaryDisplayProps {
│  geminiMdFileCount: number;
│  contextFileNames: string[];
│  mcpServers?: Record<string, MCPServerConfig>;
│  blockedMcpServers?: Array<{ name: string; extensionName: string }>;
│  showToolDescriptions?: boolean;
⋮

packages/cli/src/ui/components/GeminiRespondingSpinner.tsx:
⋮
│interface GeminiRespondingSpinnerProps {
│  /**
│   * Optional string to display when not in Responding state.
│   * If not provided and not Responding, renders null.
│   */
│  nonRespondingDisplay?: string;
│  spinnerType?: SpinnerName;
⋮

packages/cli/src/ui/components/SessionSummaryDisplay.tsx:
⋮
│interface SessionSummaryDisplayProps {
│  duration: string;
⋮

packages/cli/src/ui/components/ShowMoreLines.tsx:
⋮
│interface ShowMoreLinesProps {
│  constrainHeight: boolean;
⋮

packages/cli/src/ui/components/SuggestionsDisplay.tsx:
⋮
│interface SuggestionsDisplayProps {
│  suggestions: Suggestion[];
│  activeIndex: number;
│  isLoading: boolean;
│  width: number;
│  scrollOffset: number;
│  userInput: string;
⋮

packages/cli/src/ui/components/UpdateNotification.tsx:
⋮
│interface UpdateNotificationProps {
│  message: string;
⋮

packages/cli/src/ui/components/messages/GeminiMessageContent.tsx:
⋮
│interface GeminiMessageContentProps {
│  text: string;
│  isPending: boolean;
│  availableTerminalHeight?: number;
│  terminalWidth: number;
⋮

packages/cli/src/ui/components/messages/ToolMessage.tsx:
⋮
│export type TextEmphasis = 'high' | 'medium' | 'low';
│
⋮

packages/cli/src/ui/components/shared/text-buffer.ts:
⋮
│interface TextBufferState {
│  lines: string[];
│  cursorRow: number;
│  cursorCol: number;
│  preferredCol: number | null; // This is visual preferred col
│  undoStack: UndoHistoryEntry[];
│  redoStack: UndoHistoryEntry[];
│  clipboard: string | null;
│  selectionAnchor: [number, number] | null;
│  viewportWidth: number;
⋮

packages/cli/src/ui/contexts/SessionContext.tsx:
⋮
│export interface SessionStatsState {
│  sessionStartTime: Date;
│  metrics: SessionMetrics;
│  lastPromptTokenCount: number;
│  promptCount: number;
⋮

packages/cli/src/ui/editors/editorSettingsManager.ts:
⋮
│class EditorSettingsManager {
│  private readonly availableEditors: EditorDisplay[];
│
│  constructor() {
│    const editorTypes: EditorType[] = [
│      'zed',
│      'vscode',
│      'vscodium',
│      'windsurf',
│      'cursor',
⋮

packages/cli/src/ui/hooks/useKeypress.test.ts:
⋮
│class MockStdin extends EventEmitter {
│  isTTY = true;
│  setRawMode = vi.fn();
│  on = this.addListener;
│  removeListener = this.removeListener;
│  write = vi.fn();
│  resume = vi.fn();
│
│  private isLegacy = false;
│
⋮

packages/cli/src/ui/hooks/useKeypress.ts:
⋮
│export interface Key {
│  name: string;
│  ctrl: boolean;
│  meta: boolean;
│  shift: boolean;
│  paste: boolean;
│  sequence: string;
⋮

packages/cli/src/ui/privacy/CloudPaidPrivacyNotice.tsx:
⋮
│interface CloudPaidPrivacyNoticeProps {
│  onExit: () => void;
⋮

packages/cli/src/ui/privacy/GeminiPrivacyNotice.tsx:
⋮
│interface GeminiPrivacyNoticeProps {
│  onExit: () => void;
⋮

packages/cli/src/ui/themes/theme.ts:
⋮
│export type ThemeType = 'light' | 'dark' | 'ansi';
│
│export interface ColorsTheme {
│  type: ThemeType;
│  Background: string;
│  Foreground: string;
│  LightBlue: string;
│  AccentBlue: string;
│  AccentPurple: string;
│  AccentCyan: string;
│  AccentGreen: string;
│  AccentYellow: string;
⋮
│export class Theme {
│  /**
│   * The default foreground color for text when no specific highlight rule applies.
│   * This is an Ink-compatible color string (hex or name).
│   */
│  readonly defaultColor: string;
│  /**
│   * Stores the mapping from highlight.js class names (e.g., 'hljs-keyword')
│   * to Ink-compatible color strings (hex or name).
│   */
⋮

packages/cli/src/ui/types.ts:
⋮
│export enum ToolCallStatus {
│  Pending = 'Pending',
│  Canceled = 'Canceled',
│  Confirming = 'Confirming',
│  Executing = 'Executing',
│  Success = 'Success',
│  Error = 'Error',
⋮
│export interface ToolCallEvent {
│  type: 'tool_call';
│  status: ToolCallStatus;
│  callId: string;
│  name: string;
│  args: Record<string, never>;
│  resultDisplay: ToolResultDisplay | undefined;
│  confirmationDetails: ToolCallConfirmationDetails | undefined;
⋮
│export interface CompressionProps {
│  isPending: boolean;
│  originalTokenCount: number | null;
│  newTokenCount: number | null;
⋮

packages/cli/src/ui/utils/ConsolePatcher.ts:
⋮
│interface ConsolePatcherParams {
│  onNewMessage: (message: Omit<ConsoleMessageItem, 'id'>) => void;
│  debugMode: boolean;
⋮

packages/cli/src/utils/package.ts:
⋮
│export type PackageJson = BasePackageJson & {
│  config?: {
│    sandboxImageUri?: string;
│  };
⋮
│export async function getPackageJson(): Promise<PackageJson | undefined> {
│  if (packageJson) {
│    return packageJson;
│  }
│
│  const result = await readPackageUp({ cwd: __dirname });
│  if (!result) {
│    // TODO: Maybe bubble this up as an error.
│    return;
│  }
│
⋮

packages/cli/src/utils/userStartupWarnings.ts:
⋮
│type WarningCheck = {
│  id: string;
│  check: (workspaceRoot: string) => Promise<string | null>;
⋮

packages/core/src/code_assist/types.ts:
⋮
│export enum UserTierId {
│  FREE = 'free-tier',
│  LEGACY = 'legacy-tier',
│  STANDARD = 'standard-tier',
⋮

packages/core/src/config/config.ts:
⋮
│export enum ApprovalMode {
│  DEFAULT = 'default',
│  AUTO_EDIT = 'autoEdit',
│  YOLO = 'yolo',
⋮
│export interface AccessibilitySettings {
│  disableLoadingPhrases?: boolean;
⋮
│export interface BugCommandSettings {
│  urlTemplate: string;
⋮
│export interface TelemetrySettings {
│  enabled?: boolean;
│  target?: TelemetryTarget;
│  otlpEndpoint?: string;
│  logPrompts?: boolean;
⋮
│export class Config {
│  private toolRegistry!: ToolRegistry;
│  private readonly sessionId: string;
│  private contentGeneratorConfig!: ContentGeneratorConfig;
│  private readonly embeddingModel: string;
│  private readonly sandbox: SandboxConfig | undefined;
│  private readonly targetDir: string;
│  private readonly debugMode: boolean;
│  private readonly question: string | undefined;
│  private readonly fullContext: boolean;
⋮

packages/core/src/core/client.ts:
⋮
│export class GeminiClient {
│  private chat?: GeminiChat;
│  private contentGenerator?: ContentGenerator;
│  private embeddingModel: string;
│  private generateContentConfig: GenerateContentConfig = {
│    temperature: 0,
│    topP: 1,
│  };
│  private sessionTurnCount = 0;
│  private readonly MAX_TURNS = 100;
⋮

packages/core/src/core/contentGenerator.ts:
⋮
│export enum AuthType {
│  LOGIN_WITH_GOOGLE = 'oauth-personal',
│  USE_GEMINI = 'gemini-api-key',
│  USE_VERTEX_AI = 'vertex-ai',
│  CLOUD_SHELL = 'cloud-shell',
⋮
│export type ContentGeneratorConfig = {
│  model: string;
│  apiKey?: string;
│  vertexai?: boolean;
│  authType?: AuthType | undefined;
│  proxy?: string | undefined;
⋮

packages/core/src/core/coreToolScheduler.ts:
⋮
│export type CompletedToolCall =
│  | SuccessfulToolCall
│  | CancelledToolCall
⋮

packages/core/src/core/geminiChat.ts:
⋮
│export class GeminiChat {
│  // A promise to represent the current state of the message being sent to the
│  // model.
│  private sendPromise: Promise<void> = Promise.resolve();
│
│  constructor(
│    private readonly config: Config,
│    private readonly contentGenerator: ContentGenerator,
│    private readonly generationConfig: GenerateContentConfig = {},
│    private history: Content[] = [],
⋮

packages/core/src/core/logger.ts:
⋮
│export enum MessageSenderType {
│  USER = 'user',
⋮
│export interface LogEntry {
│  sessionId: string;
│  messageId: number;
│  timestamp: string;
│  type: MessageSenderType;
│  message: string;
⋮

packages/core/src/core/modelCheck.ts:
⋮
│export async function getEffectiveModel(
│  apiKey: string,
│  currentConfiguredModel: string,
│  proxy?: string,
⋮

packages/core/src/core/tokenLimits.ts:
⋮
│type TokenCount = number;
│
⋮

packages/core/src/core/turn.ts:
⋮
│export interface StructuredError {
│  message: string;
│  status?: number;
⋮
│export interface ToolCallRequestInfo {
│  callId: string;
│  name: string;
│  args: Record<string, unknown>;
│  isClientInitiated: boolean;
│  prompt_id: string;
⋮

packages/core/src/mcp/oauth-provider.ts:
⋮
│export interface MCPOAuthConfig {
│  enabled?: boolean; // Whether OAuth is enabled for this server
│  clientId?: string;
│  clientSecret?: string;
│  authorizationUrl?: string;
│  tokenUrl?: string;
│  scopes?: string[];
│  redirectUri?: string;
│  tokenParamName?: string; // For SSE connections, specifies the query parameter name for the token
⋮

packages/core/src/mcp/oauth-token-storage.ts:
⋮
│export interface MCPOAuthToken {
│  accessToken: string;
│  refreshToken?: string;
│  expiresAt?: number;
│  tokenType: string;
│  scope?: string;
⋮
│export interface MCPOAuthCredentials {
│  serverName: string;
│  token: MCPOAuthToken;
│  clientId?: string;
│  tokenUrl?: string;
│  updatedAt: number;
⋮

packages/core/src/services/fileDiscoveryService.ts:
⋮
│export interface FilterFilesOptions {
│  respectGitIgnore?: boolean;
│  respectGeminiIgnore?: boolean;
⋮
│export class FileDiscoveryService {
│  private gitIgnoreFilter: GitIgnoreFilter | null = null;
│  private geminiIgnoreFilter: GitIgnoreFilter | null = null;
│  private projectRoot: string;
│
│  constructor(projectRoot: string) {
│    this.projectRoot = path.resolve(projectRoot);
│    if (isGitRepository(this.projectRoot)) {
│      const parser = new GitIgnoreParser(this.projectRoot);
│      try {
⋮

packages/core/src/services/gitService.ts:
⋮
│export class GitService {
│  private projectRoot: string;
│
│  constructor(projectRoot: string) {
│    this.projectRoot = path.resolve(projectRoot);
│  }
│
│  private getHistoryDir(): string {
│    const hash = getProjectHash(this.projectRoot);
│    return path.join(os.homedir(), GEMINI_DIR, 'history', hash);
⋮

packages/core/src/telemetry/clearcut-logger/event-metadata-key.ts:
⋮
│export enum EventMetadataKey {
│  GEMINI_CLI_KEY_UNKNOWN = 0,
│
│  // ==========================================================================
│  // Start Session Event Keys
│  // ===========================================================================
│
│  // Logs the model id used in the session.
│  GEMINI_CLI_START_SESSION_MODEL = 1,
│
⋮

packages/core/src/telemetry/metrics.test.ts:
⋮
│function originalOtelMockFactory() {
│  return {
│    metrics: {
│      getMeter: vi.fn(),
│    },
│    ValueType: {
│      INT: 1,
│    },
│  };
⋮

packages/core/src/telemetry/types.ts:
⋮
│export enum ToolCallDecision {
│  ACCEPT = 'accept',
│  REJECT = 'reject',
│  MODIFY = 'modify',
⋮
│export class ToolCallEvent {
│  'event.name': 'tool_call';
│  'event.timestamp': string; // ISO 8601
│  function_name: string;
│  function_args: Record<string, unknown>;
│  duration_ms: number;
│  success: boolean;
│  decision?: ToolCallDecision;
│  error?: string;
│  error_type?: string;
⋮
│export class ApiErrorEvent {
│  'event.name': 'api_error';
│  'event.timestamp': string; // ISO 8601
│  model: string;
│  error: string;
│  error_type?: string;
│  status_code?: number | string;
│  duration_ms: number;
│  prompt_id: string;
│  auth_type?: string;
│
⋮
│export class ApiResponseEvent {
│  'event.name': 'api_response';
│  'event.timestamp': string; // ISO 8601
│  model: string;
│  status_code?: number | string;
│  duration_ms: number;
│  error?: string;
│  input_token_count: number;
│  output_token_count: number;
│  cached_content_token_count: number;
⋮
│export enum LoopType {
│  CONSECUTIVE_IDENTICAL_TOOL_CALLS = 'consecutive_identical_tool_calls',
│  CHANTING_IDENTICAL_SENTENCES = 'chanting_identical_sentences',
│  LLM_DETECTED_LOOP = 'llm_detected_loop',
⋮

packages/core/src/telemetry/uiTelemetry.ts:
⋮
│export interface ModelMetrics {
│  api: {
│    totalRequests: number;
│    totalErrors: number;
│    totalLatencyMs: number;
│  };
│  tokens: {
│    prompt: number;
│    candidates: number;
│    total: number;
⋮
│export interface SessionMetrics {
│  models: Record<string, ModelMetrics>;
│  tools: {
│    totalCalls: number;
│    totalSuccess: number;
│    totalFail: number;
│    totalDurationMs: number;
│    totalDecisions: {
│      [ToolCallDecision.ACCEPT]: number;
│      [ToolCallDecision.REJECT]: number;
⋮

packages/core/src/tools/glob.ts:
⋮
│export interface GlobToolParams {
│  /**
│   * The glob pattern to match files against
│   */
│  pattern: string;
│
│  /**
│   * The directory to search in (optional, defaults to current directory)
│   */
│  path?: string;
│
⋮

packages/core/src/tools/grep.ts:
⋮
│export interface GrepToolParams {
│  /**
│   * The regular expression pattern to search for in file contents
│   */
│  pattern: string;
│
│  /**
│   * The directory to search in (optional, defaults to current directory relative to root)
│   */
│  path?: string;
│
⋮

packages/core/src/tools/mcp-tool.ts:
⋮
│type ToolParams = Record<string, unknown>;
│
⋮

packages/core/src/tools/memoryTool.ts:
⋮
│interface SaveMemoryParams {
│  fact: string;
⋮

packages/core/src/tools/read-file.ts:
⋮
│export interface ReadFileToolParams {
│  /**
│   * The absolute path to the file to read
│   */
│  absolute_path: string;
│
│  /**
│   * The line number to start reading from (optional)
│   */
│  offset?: number;
│
⋮

packages/core/src/tools/read-many-files.ts:
⋮
│export interface ReadManyFilesParams {
│  /**
│   * An array of file paths or directory paths to search within.
│   * Paths are relative to the tool's configured target directory.
│   * Glob patterns can be used directly in these paths.
│   */
│  paths: string[];
│
│  /**
│   * Optional. Glob patterns for files to include.
⋮

packages/core/src/tools/tool-registry.ts:
⋮
│type ToolParams = Record<string, unknown>;
│
│export class DiscoveredTool extends BaseTool<ToolParams, ToolResult> {
│  constructor(
│    private readonly config: Config,
│    readonly name: string,
│    readonly description: string,
│    readonly parameterSchema: Record<string, unknown>,
│  ) {
│    const discoveryCmd = config.getToolDiscoveryCommand()!;
│    const callCommand = config.getToolCallCommand()!;
│    description += `
│
⋮
│export class ToolRegistry {
│  private tools: Map<string, Tool> = new Map();
│  private config: Config;
│
│  constructor(config: Config) {
│    this.config = config;
│  }
│
│  /**
│   * Registers a tool definition.
⋮

packages/core/src/tools/tools.ts:
⋮
│export type ToolResultDisplay = string | FileDiff;
│
⋮
│export interface ToolConfirmationPayload {
│  // used to override `modifiedProposedContent` for modifiable tools in the
│  // inline modify flow
│  newContent: string;
⋮
│export type ToolCallConfirmationDetails =
│  | ToolEditConfirmationDetails
│  | ToolExecuteConfirmationDetails
│  | ToolMcpConfirmationDetails
⋮
│export enum ToolConfirmationOutcome {
│  ProceedOnce = 'proceed_once',
│  ProceedAlways = 'proceed_always',
│  ProceedAlwaysServer = 'proceed_always_server',
│  ProceedAlwaysTool = 'proceed_always_tool',
│  ModifyWithEditor = 'modify_with_editor',
│  Cancel = 'cancel',
⋮
│export enum Icon {
│  FileSearch = 'fileSearch',
│  Folder = 'folder',
│  Globe = 'globe',
│  Hammer = 'hammer',
│  LightBulb = 'lightBulb',
│  Pencil = 'pencil',
│  Regex = 'regex',
│  Terminal = 'terminal',
⋮

packages/core/src/utils/editor.ts:
⋮
│export type EditorType =
│  | 'vscode'
│  | 'vscodium'
│  | 'windsurf'
│  | 'cursor'
│  | 'vim'
│  | 'neovim'
⋮

packages/core/src/utils/errorReporting.ts:
⋮
│interface ErrorReportData {
│  error: { message: string; stack?: string } | { message: string };
│  context?: unknown;
│  additionalInfo?: Record<string, unknown>;
⋮

packages/core/src/utils/fetch.ts:
⋮
│export class FetchError extends Error {
│  constructor(
│    message: string,
│    public code?: string,
│  ) {
│    super(message);
│    this.name = 'FetchError';
│  }
⋮

packages/core/src/utils/gitIgnoreParser.ts:
⋮
│export interface GitIgnoreFilter {
│  isIgnored(filePath: string): boolean;
│  getPatterns(): string[];
⋮
│export class GitIgnoreParser implements GitIgnoreFilter {
│  private projectRoot: string;
│  private ig: Ignore = ignore();
│  private patterns: string[] = [];
│
│  constructor(projectRoot: string) {
│    this.projectRoot = path.resolve(projectRoot);
│  }
│
│  loadGitRepoPatterns(): void {
│    if (!isGitRepository(this.projectRoot)) return;
│
│    // Always ignore .git directory regardless of .gitignore content
│    this.addPatterns(['.git']);
│
│    const patternFiles = ['.gitignore', path.join('.git', 'info', 'exclude')];
│    for (const pf of patternFiles) {
│      this.loadPatterns(pf);
│    }
⋮
│  loadPatterns(patternsFileName: string): void {
│    const patternsFilePath = path.join(this.projectRoot, patternsFileName);
│    let content: string;
│    try {
│      content = fs.readFileSync(patternsFilePath, 'utf-8');
│    } catch (_error) {
│      // ignore file not found
│      return;
│    }
│    const patterns = (content ?? '')
⋮
│  private addPatterns(patterns: string[]) {
│    this.ig.add(patterns);
│    this.patterns.push(...patterns);
⋮
│  isIgnored(filePath: string): boolean {
│    const relativePath = path.isAbsolute(filePath)
│      ? path.relative(this.projectRoot, filePath)
│      : filePath;
│
│    if (relativePath === '' || relativePath.startsWith('..')) {
│      return false;
│    }
│
│    let normalizedPath = relativePath.replace(/\\/g, '/');
⋮
│  getPatterns(): string[] {
│    return this.patterns;
⋮

packages/core/src/utils/memoryImportProcessor.ts:
⋮
│interface ImportState {
│  processedFiles: Set<string>;
│  maxDepth: number;
│  currentDepth: number;
│  currentFile?: string; // Track the current file being processed
⋮

packages/core/src/utils/quotaErrorDetection.ts:
⋮
│interface StructuredError {
│  message: string;
│  status?: number;
⋮

packages/core/src/utils/safeJsonStringify.ts:
⋮
│export function safeJsonStringify(
│  obj: unknown,
│  space?: string | number,
⋮

packages/core/src/utils/user_account.ts:
⋮
│interface UserAccounts {
│  active: string | null;
│  old: string[];
⋮

scripts/build_sandbox.js:
⋮
│function buildImage(imageName, dockerfile) {
│  console.log(`building ${imageName} ... (can be slow first time)`);
│  const buildCommand =
│    sandboxCommand === 'podman'
│      ? `${sandboxCommand} build --authfile=<(echo '{}')`
│      : `${sandboxCommand} build`;
│
│  const npmPackageVersion = JSON.parse(
│    readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
│  ).version;
│
⋮

scripts/copy_files.js:
⋮
│function copyFilesRecursive(source, target) {
│  if (!fs.existsSync(target)) {
│    fs.mkdirSync(target, { recursive: true });
│  }
│
│  const items = fs.readdirSync(source, { withFileTypes: true });
│
│  for (const item of items) {
│    const sourcePath = path.join(source, item.name);
│    const targetPath = path.join(target, item.name);
│
⋮

scripts/prepare-package.js:
⋮
│function copyFiles(packageName, filesToCopy) {
│  const packageDir = path.resolve(rootDir, 'packages', packageName);
│  if (!fs.existsSync(packageDir)) {
│    console.error(`Error: Package directory not found at ${packageDir}`);
│    process.exit(1);
│  }
│
│  console.log(`Preparing package: ${packageName}`);
│  for (const [source, dest] of Object.entries(filesToCopy)) {
│    const sourcePath = path.resolve(rootDir, source);
⋮

scripts/telemetry.js:
⋮
│function loadSettingsValue(filePath) {
│  try {
│    if (existsSync(filePath)) {
│      const content = readFileSync(filePath, 'utf-8');
│      const jsonContent = content.replace(/\/\/[^\n]*/g, '');
│      const settings = JSON.parse(jsonContent);
│      return settings.telemetry?.target;
│    }
│  } catch (e) {
│    console.warn(
⋮

scripts/telemetry_utils.js:
⋮
│export function fileExists(filePath) {
│  return fs.existsSync(filePath);
⋮


