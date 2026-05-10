import type { CommandGroup } from "@grammyjs/commands"
import type { GrullyI18nFlavor } from "@grully/i18n"
import type { Context } from "grammy"

/**
 * Configuration options for the `i18nCommands` plugin.
 *
 * Provides everything needed to automatically localize command descriptions
 * using translation keys built from a `startKey` and each command's name.
 */
export type GrullyCommandsOptions<C extends Context> = {
    /**
     * The i18n instance from `@grully/i18n`. 
     * 
     * Must contain a `locales` object mapping full keys (e.g., `"start_commands/help"`) to language-specific description factories.
     */
    i18n: GrullyI18nFlavor['i18n']
    /**
     * An array of command groups created via `@grammyjs/commands`. 
     * 
     * Each group contains commands whose descriptions will be localized.
     */
    groups: CommandGroup<C>[]
    /**
     * A string used to join `startKey` and the command name
     * @default '/'
     */
    separator?: string
    /**
     * The prefix for the translation key (e.g., `"start_commands"`). 
     * 
     * The full key becomes `${startKey}${separator}${command.stringName}`.
     */
    startKey: string
}

