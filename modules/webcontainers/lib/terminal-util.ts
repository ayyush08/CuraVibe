// terminalUtils.ts
"use client";

// Import types for TS
import type { Terminal as TerminalType } from "xterm";
import type { FitAddon as FitAddonType } from "xterm-addon-fit";
import type { SearchAddon as SearchAddonType } from "xterm-addon-search";
import type { WebLinksAddon as WebLinksAddonType } from "xterm-addon-web-links";

// Runtime variables
let TerminalImpl: typeof TerminalType;
let FitAddonImpl: typeof FitAddonType;
let SearchAddonImpl: typeof SearchAddonType;
let WebLinksAddonImpl: typeof WebLinksAddonType;

// Only load at runtime
if (typeof window !== "undefined") {
    const xtermModule = await import("xterm");
    const fitModule = await import("xterm-addon-fit");
    const searchModule = await import("xterm-addon-search");
    const webLinksModule = await import("xterm-addon-web-links");

    TerminalImpl = xtermModule.Terminal;
    FitAddonImpl = fitModule.FitAddon;
    SearchAddonImpl = searchModule.SearchAddon;
    WebLinksAddonImpl = webLinksModule.WebLinksAddon;
}

// Export runtime classes for normal use
export const Terminal = TerminalImpl!;
export const FitAddon = FitAddonImpl!;
export const SearchAddon = SearchAddonImpl!;
export const WebLinksAddon = WebLinksAddonImpl!;

// Export types for TS
export type { TerminalType, FitAddonType, SearchAddonType, WebLinksAddonType };
