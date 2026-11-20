export type Status = 'idle' | 'working' | { error: string }

declare module 'claude-code' {
  interface PluginState {
    'prompt-master': { status: Status; previous: string | null }
  }
}
