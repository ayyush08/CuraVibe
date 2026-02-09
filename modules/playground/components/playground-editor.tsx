"use client";

import { useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { TemplateFile } from "../lib/path-to-json";
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from "../lib/editor-config";

interface PlaygroundEditorProps {
    activeFile: TemplateFile | undefined;
    content: string;
    onContentChange: (value: string) => void;
    fetchSuggestion: (editor: any, monaco: Monaco) => void;
    aiEnabled: boolean;
    suggestionLoading: boolean;
    hasActiveSuggestion?: boolean;
}

export const PlaygroundEditor = ({
    activeFile,
    content,
    onContentChange,
    fetchSuggestion,
    aiEnabled,
    suggestionLoading,
    hasActiveSuggestion,
}: PlaygroundEditorProps) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const idleTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        configureMonaco(monaco);

        editor.updateOptions({
            ...defaultEditorOptions,
            inlineSuggest: {
                enabled: true,
                mode: "prefix",
                suppressSuggestions: false,
            },
            // Disable some conflicting suggest features
            suggest: {
                preview: false, // Disable preview to avoid conflicts
                showInlineDetails: false,
                insertMode: "replace",
            },
            // Quick suggestions
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false,
            },
            // Smooth cursor
            cursorSmoothCaretAnimation: "on",
        });

        // Trigger suggestion manually on Ctrl+Space
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
            fetchSuggestion(editor, monaco);
        });

        // Trigger AI when user stops typing
        editor.onDidChangeModelContent(() => {
            if (!aiEnabled) return;

            if (idleTimeout.current) clearTimeout(idleTimeout.current);

            // wait 500ms after typing stops
            idleTimeout.current = setTimeout(() => {
                fetchSuggestion(editor, monaco);
            }, 500);
        });
    };

    return (
        <div className="h-full relative">
            {aiEnabled && suggestionLoading && (
                <div className="absolute top-2 right-2 z-10 bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    AI thinking...
                </div>
            )}
            {/* Active suggestion indicator */}
            {aiEnabled && hasActiveSuggestion && !suggestionLoading && (
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Press Tab to accept
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Esc to reject
                    </div>
                </div>

            )}

            <Editor
                height="100%"
                value={content}
                onChange={(value) => onContentChange(value || "")}
                onMount={handleEditorDidMount}
                language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
                //@ts-ignore
                options={defaultEditorOptions}
            />
        </div>
    );
};
