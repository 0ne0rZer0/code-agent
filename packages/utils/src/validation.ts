import type { GlobalConfig, ProjectConfig } from '@code-agent/types';

export function validateGlobalConfig(config: any): config is GlobalConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof config.defaultModel === 'string' &&
    typeof config.permissions === 'object'
  );
}

export function validateProjectConfig(config: any): config is ProjectConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof config.projectRoot === 'string' &&
    Array.isArray(config.excludePatterns) &&
    Array.isArray(config.includePatterns)
  );
}

export function isValidPath(path: string): boolean {
  // Basic path validation - no directory traversal
  return !path.includes('..') && !path.startsWith('/');
}

export function isDangerousCommand(command: string): boolean {
  const dangerousPatterns = [
    /rm\s+-rf/,
    /sudo/,
    /chmod\s+777/,
    /dd\s+if=/,
    /mkfs/,
    /format/,
    />.*\/dev\//
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(command));
}