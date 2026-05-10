import type { Context } from "grammy"
import type { GrullyCommandsOptions } from "./types"
import type { CommandGroup } from "@grammyjs/commands"
import type { LanguageCode } from "grammy/types"

/**
 * Applies i18n translations to command descriptions using a key-based lookup from `@grully/i18n`
 */
export const i18nCommands = <C extends Context>({
    i18n,
    groups,
    separator = '/',
    startKey
}: GrullyCommandsOptions<C>): CommandGroup<C>[] => {
    const {
        locales
    } = i18n

    for (const group of groups) {
        const commands = group.commands

        for (const command of commands) {
            const name = command.stringName
            const fullKey = `${startKey}${separator}${name}`
            
            const langs = locales[fullKey]
            if(!langs) continue

            for (const lang in langs) {
                const description = langs[lang]
                if(!description) continue

                command.localize(
                    lang as LanguageCode,
                    name,
                    description({
                        commandName: name,
                        fullKey,
                    })
                )
            }
        }
    }
    return groups
}