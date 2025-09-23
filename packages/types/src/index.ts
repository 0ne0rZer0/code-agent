// Core message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  tokenCount?: number;
  model?: string;
  cost?: number;
  streaming?: boolean;
  toolCallIds?: string[];
}

// Tool-related types
export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  type?: 'function';
}

export interface ToolResult {
  toolCallId: string;
  success: boolean;
  data?: any;
  error?: string;
  metadata?: ToolMetadata;
}

export interface ToolMetadata {
  executionTime?: number;
  resourcesUsed?: string[];
  permissionRequired?: boolean;
  permissionGranted?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameterSchema;
  requiresPermission?: boolean;
  dangerousOperation?: boolean;
  execute(params: Record<string, any>): Promise<ToolResult>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameterSchema;
}

export interface ToolParameterSchema {
  type: 'object';
  properties: Record<string, ToolParameter>;
  required?: string[];
}

export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: ToolParameter;
  properties?: Record<string, ToolParameter>;
}

// Configuration types
export interface GlobalConfig {
  apiKey?: string;
  apiEndpoint?: string;
  defaultModel: string;
  permissions: PermissionConfig;
  ui: UIConfig;
  analytics?: AnalyticsConfig;
  costLimits?: CostLimits;
  retryConfig?: RetryConfig;
}

export interface ProjectConfig {
  projectRoot: string;
  excludePatterns: string[];
  includePatterns: string[];
  customTools: string[];
  teamSettings?: TeamConfig;
  mcpServers?: MCPServerConfig[];
  workspaceSettings?: WorkspaceSettings;
}

export interface PermissionConfig {
  autoApprove: string[];
  alwaysDeny: string[];
  requireConfirmation: string[];
  rememberDuration?: number; // minutes
  projectBoundaryEnforcement: boolean;
}

export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  showCosts: boolean;
  showTokens: boolean;
  showProgress: boolean;
  terminalWidth?: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  userId?: string;
  endpoint?: string;
  collectUsageStats: boolean;
}

export interface TeamConfig {
  teamId: string;
  sharedSettings: Record<string, any>;
  syncEnabled: boolean;
}

export interface CostLimits {
  dailyLimit?: number;
  monthlyLimit?: number;
  warningThreshold?: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  disabled?: boolean;
  autoApprove?: string[];
}

export interface WorkspaceSettings {
  defaultShell?: string;
  environmentVariables?: Record<string, string>;
  pathMappings?: Record<string, string>;
}

// API types
export interface APIRequest {
  messages: Message[];
  model: string;
  tools?: ToolDefinition[];
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface APIResponse {
  id: string;
  model: string;
  content?: string;
  toolCalls?: ToolCall[];
  usage?: TokenUsage;
  finishReason?: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use';
  stopReason?: string;
}

export interface StreamingAPIResponse {
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
  index?: number;
  delta?: {
    type?: string;
    text?: string;
    partial_json?: string;
  };
  message?: Partial<APIResponse>;
  usage?: TokenUsage;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cachedTokens?: number;
  model: string;
  timestamp: Date;
}

export interface APIError {
  type: ErrorType;
  message: string;
  code?: string;
  statusCode?: number;
  retryable: boolean;
}

// Session and state types
export interface Session {
  id: string;
  messages: Message[];
  toolResults: ToolResult[];
  context: ConversationContext;
  startTime: Date;
  lastActivity: Date;
  metadata: SessionMetadata;
  persistent: boolean;
}

export interface ConversationContext {
  workingDirectory: string;
  environment: Record<string, string>;
  projectRoot?: string;
  shellState?: ShellState;
  gitRepository?: GitContext;
}

export interface SessionMetadata {
  totalTokens: number;
  totalCost: number;
  toolsUsed: string[];
  model: string;
  version: string;
}

export interface ShellState {
  currentDirectory: string;
  environmentVariables: Record<string, string>;
  shellType: 'bash' | 'zsh' | 'fish' | 'cmd' | 'powershell';
  history: string[];
}

export interface GitContext {
  repositoryRoot: string;
  currentBranch: string;
  hasUncommittedChanges: boolean;
  remoteUrl?: string;
}

// Permission types
export interface PermissionRequest {
  id: string;
  type: 'file_read' | 'file_write' | 'file_edit' | 'command_execute' | 'directory_list' | 'network_access' | 'system_info';
  resource: string;
  description: string;
  dangerous: boolean;
  context?: PermissionContext;
}

export interface PermissionResponse {
  requestId: string;
  approved: boolean;
  remember?: boolean;
  duration?: number; // minutes
}

export interface PermissionContext {
  toolName: string;
  operation: string;
  targetPath?: string;
  command?: string;
  reason: string;
}

export interface PermissionRule {
  pattern: string;
  action: 'allow' | 'deny' | 'prompt';
  scope: 'global' | 'project';
  expiresAt?: Date;
}

// Error types
export enum ErrorType {
  API_ERROR = 'api_error',
  TOOL_ERROR = 'tool_error',
  PERMISSION_ERROR = 'permission_error',
  CONFIGURATION_ERROR = 'configuration_error',
  NETWORK_ERROR = 'network_error',
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error'
}

export interface ErrorContext {
  operation: string;
  resource?: string;
  userId?: string;
  sessionId?: string;
  toolName?: string;
  timestamp: Date;
}

export interface ErrorResponse {
  handled: boolean;
  retry: boolean;
  message: string;
  suggestedAction?: string;
}

// Cost tracking types
export interface CostSummary {
  totalCost: number;
  dailyCost: number;
  monthlyCost: number;
  tokenUsage: TokenUsage[];
  costByModel: Record<string, number>;
}

export interface UsageAnalytics {
  totalSessions: number;
  averageSessionLength: number;
  mostUsedTools: string[];
  costTrends: CostTrend[];
  tokenEfficiency: number;
}

export interface CostTrend {
  date: Date;
  cost: number;
  tokens: number;
  sessions: number;
}

// MCP (Model Context Protocol) types
export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: ToolParameterSchema;
  serverName: string;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Event types for analytics
export interface AnalyticsEvent {
  type: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

// Notification types
export interface NotificationConfig {
  enabled: boolean;
  types: NotificationType[];
  sound: boolean;
  desktop: boolean;
}

export enum NotificationType {
  TASK_COMPLETE = 'task_complete',
  ERROR_OCCURRED = 'error_occurred',
  COST_LIMIT_REACHED = 'cost_limit_reached',
  PERMISSION_REQUIRED = 'permission_required'
}