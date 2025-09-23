import * as path from 'path';

export function normalizePath(filePath: string): string {
  return path.normalize(filePath);
}

export function isWithinProject(filePath: string, projectRoot: string): boolean {
  const normalizedPath = path.resolve(filePath);
  const normalizedRoot = path.resolve(projectRoot);
  return normalizedPath.startsWith(normalizedRoot);
}

export function getRelativePath(filePath: string, basePath: string): string {
  return path.relative(basePath, filePath);
}

export function joinPaths(...paths: string[]): string {
  return path.join(...paths);
}