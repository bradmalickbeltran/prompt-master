import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Status } from '../types'

const status = atom({ plugin: 'prompt-master', key: 'status' } as const, 'idle' as Status)
const previous = atom({ plugin: 'prompt-master', key: 'previous' } as const, null as string | null)

const SYSTEM = `You are Prompt Master, an expert prompt engineer. The user gives you a rough prompt they are about to send to Claude, an AI assistant. Rewrite it into a better prompt.

Rules:
- Keep the user's intent, facts, names, code, paths and constraints exactly. Never invent requirements, data or context they did not give.
- Make the goal explicit and specific; state the desired output (format, length, audience) when it can be inferred.
- Add structure (short paragraphs or a brief list) only when it helps; keep simple asks short.
- Write in the user's voice, as the request itself, in the same language they used.
- Fix spelling and grammar. Remove filler.
- If key details are missing, do not ask questions; make the prompt invite Claude to state reasonable assumptions instead.
- Output ONLY the rewritten prompt: no preamble, no quotes, no explanation.`

async function run($: EngineInterface, rough?: string): Promise<void> {
  {
    if ((await read($, status)) === 'working') return
    const draft = (rough ?? (await $.prompt.read()).text).trim()
    if (!draft) {
      $.ui.toast('Prompt Master: type a rough prompt first')
      return
    }
    await update($, status, () => 'working' as Status)
    const r = await $.model.complete({
      model: 'sonnet',
      system: SYSTEM,
      prompt: `Rough prompt:\n<<<\n${draft}\n>>>`,
      maxTokens: 4000,
      effort: 'low',
    })
    if (!r.isAnswered || !r.text.trim()) {
      const why = r.isAnswered ? 'empty reply' : r.reason
      await update($, status, () => ({ error: why }) as Status)
      $.ui.toast(`Prompt Master failed: ${why}`)
      return
    }
    const filled = await $.prompt.fill({ text: r.text.trim(), mode: 'replace' })
    if (!filled.isFilled) {
      await update($, status, () => ({ error: 'could not write to the prompt box' }) as Status)
      return
    }
    await update($, previous, () => draft)
    await update($, status, () => 'idle' as Status)
    $.ui.toast('Prompt Master rewrote your prompt. Review it, then send.')
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await update($, status, () => 'idle' as Status)
    await $.command.register({
      name: 'promptmaster',
      description: 'Rewrite your rough prompt into a better one (puts it in the prompt box)',
    })
    return next(e)
  })

  on('command.run', { command: 'promptmaster' }, async ($, e) => {
    const text = e.args.trim()
    if (!text) return { text: 'Usage: /promptmaster <your rough prompt>, or use the ✨ Prompt Master button above the prompt box.' }
    void run($, text)
    return { text: 'Prompt Master is rewriting it; the result will land in your prompt box.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const s = await read($, status)
    const prior = await read($, previous)

    return (
      <Box flexDirection="row" gap={1}>
        <Button
          key="prompt-master"
          label={s === 'working' ? '✨ Rewriting…' : '✨ Prompt Master'}
          onPress={() => run($)}
        />
        {prior !== null && s !== 'working' ? (
          <Button
            key="prompt-master-undo"
            label="Undo"
            dimColor
            onPress={async () => {
              await $.prompt.fill({ text: prior, mode: 'replace' })
              await update($, previous, () => null)
            }}
          />
        ) : null}
        {typeof s === 'object' ? <Text color="red">{s.error}</Text> : null}
      </Box>
    )
  })
}
