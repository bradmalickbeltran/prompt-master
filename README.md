# Prompt Master

Prompt Master turns a rough, half-finished prompt into a clear, specific one before you send it to Claude. It keeps your intent, facts, names, code and constraints exactly as you wrote them. It makes the goal and the expected output explicit, adds structure only when it helps, and fixes spelling. It never invents details you didn't give.

## What you get

| Where | How you use it |
| --- | --- |
| **Claude Code** (terminal, desktop app Code tab, VS Code) | A **✨ Prompt Master** button above the prompt box rewrites your draft in place, and **Undo** restores it. You can also type `/promptmaster <rough prompt>`, or use the `/prompt-master` skill. |
| **Regular Claude chats** (claude.ai, desktop and mobile apps) | Upload the skill once, then type `/prompt master <rough prompt>` or `prompt master: <rough prompt>`. Claude replies with the improved prompt, ready to copy. |

## Install in Claude Code

At the prompt of a Claude Code terminal session:

```
/plugin install prompt-master --marketplace bradmalickbeltran/prompt-master
```

Answer `y` to add the marketplace, then press Enter to install for your user. From a shell instead:

```
claude plugin install prompt-master --marketplace bradmalickbeltran/prompt-master
```

In the Claude desktop app's Code tab, where `/plugin` doesn't run: click **+** next to the prompt box, then **Plugins**, then **Add marketplace** with `bradmalickbeltran/prompt-master`, then **Add plugin**.

Each rewrite is one small model call (Sonnet) and counts toward your usage.

## Install in regular Claude chats

1. Download [`claude-ai/prompt-master.zip`](claude-ai/prompt-master.zip).
2. In Claude, open **Settings → Capabilities** and turn on **Code execution and file creation**.
3. Under **Skills**, choose **Upload skill**, pick the zip, and make sure it's switched on.
4. In a new chat, type: `/prompt master give me a 3 day workout plan idk im a beginner`

Custom skills need a paid plan (Pro, Max, Team or Enterprise). On Team and Enterprise, an admin may need to allow them. Menu names can vary by app version.

## Files

- `hooks/register.tsx`: the button, the Undo button, and the `/promptmaster` command (Claude Code).
- `skills/prompt-master/SKILL.md`: the rewrite instructions used by the skill.
- `claude-ai/prompt-master.zip`: the same skill, packaged for upload to claude.ai.

## License

MIT
