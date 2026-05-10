# @grully/i18n-commands

**A lightweight i18n wrapper for [`@grammyjs/commands`](https://www.npmjs.com/package/@grammyjs/commands) that integrates seamlessly with [`@grully/i18n`](https://www.npmjs.com/package/@grully/i18n).**

This utility automatically localizes your bot commands' description for multiple languages using the same translation files and renderer you already use with `@grully/i18n`. No extra configuration – just point to your i18n instance and command groups.

## Features

- 🔁 **Reuses your existing i18n setup** – translations are loaded from the same locale folders.
- 🧩 **Works with `@grammyjs/commands`** – calls `.localize()` on each command for every available language.
- 🌐 **Fully typed** – inherits context types from your bot.
- 🪶 **Zero overhead** – only loops through your command groups once at startup.

## Installation

```bash
npm install grammy @grammyjs/commands @grully/i18n@grully/i18n-commands
```

## Example

```typescript
/*
    You must have locale folders like this:
    locales/
        en/
            commands/
                start.pug
        ru/
            commands/
                start.pug
*/

import { env } from "bun"
import { Bot, Context, session, type SessionFlavor } from "grammy"
import i18n, { type GrullyI18nFlavor, type GrullyI18nSessionData } from '@grully/i18n'
import { CommandGroup, commands, type CommandsFlavor } from "@grammyjs/commands"
import { i18nCommands } from '@grully/i18n-commands'
import i18nPlugin from '@grully/i18n-pug'

type BotContext = Context & GrullyI18nFlavor & SessionFlavor<GrullyI18nSessionData> & CommandsFlavor
type MyBot = Bot<BotContext>

const TOKEN = env.TOKEN!

const bot: MyBot = new Bot(
    TOKEN
)

const botCommands = new CommandGroup<BotContext>()
botCommands.command(
    'start',
    'description',
    async ctx => {
        await ctx.reply(ctx.t('commands/start'))
    }
)

botCommands.command(
    'set_lang',
    'Set language',
    async ctx => {
        const lang = ctx.match || 'en'
        ctx.session.languageCode = lang

        await ctx.reply(lang)
    }
)

const i18nMiddleware = i18n<BotContext>({
    folder: 'locales',
    plugin: i18nPlugin(),
    defaultLocale: 'en'
})

const groups = i18nCommands<BotContext>({
    i18n: i18nMiddleware.i18n,
    groups: [
        botCommands
    ],
    startKey: 'commands'
})

bot.use(session({
    initial() {
        return {}
    },
}))
bot.use(i18nMiddleware)
bot.use(commands())
bot.use(...groups)

await botCommands.setCommands(bot)

bot.api.config.use(
    async (prev, method, payload, abort) => {
        return prev(
            method,
            {
                ...payload,
                parse_mode: 'HTML'
            },
            abort
        )
    }
)

bot.start({
    onStart: info => {
        console.log(info)
    }
})
```