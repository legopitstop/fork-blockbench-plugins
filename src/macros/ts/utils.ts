import { ID } from "./constants";

/**
 * Whether or not this plugin is installed.
 * @param {string} pluginId
 * @returns {boolean}
 */
export function hasPlugin(pluginId: string): boolean {
  return Plugins.installed.some((plugin) => plugin.id === pluginId);
}

export function saveJson(key: string, data: any): void {
  localStorage.setItem(`${ID}:${key}`, JSON.stringify(data));
}

export function loadJson<T>(key: string, defaultValue?: T): T | undefined {
  const v = localStorage.getItem(`${ID}:${key}`);
  if (!v) return defaultValue;
  return JSON.parse(v);
}
