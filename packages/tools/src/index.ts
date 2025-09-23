// Tools for AI capabilities

// Re-export types that tools might need
export type { 
  Tool, 
  ToolCall, 
  ToolResult, 
  ToolDefinition,
  PermissionRequest,
  PermissionResponse 
} from '@code-agent/types';

import type { Tool, ToolDefinition } from '@code-agent/types';

// Tool implementations will be added in later tasks
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }));
  }
}