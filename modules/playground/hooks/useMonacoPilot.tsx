import { useCallback, useEffect, useRef, useState } from "react";
import {
    registerCompletion,
    type CompletionRegistration,
    type Monaco,
    type StandaloneCodeEditor,
} from "monacopilot";

interface AISuggestionsState {
    suggestion: string | null; // kept for compatibility, but filled by monacopilot if needed
    isLoading: boolean;
    position: { line: number; column: number } | null;
    isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
    toggleEnabled: () => void;
    fetchSuggestion: (type: string, editor: StandaloneCodeEditor, monaco: Monaco) => Promise<void>;
    acceptSuggestion: (editor: StandaloneCodeEditor, monaco: Monaco) => void;
    rejectSuggestion: (editor: StandaloneCodeEditor) => void;
    clearSuggestion: (editor: StandaloneCodeEditor) => void;
}

export const useAISuggestion = (): UseAISuggestionsReturn => {
    const [state, setState] = useState<AISuggestionsState>({
        suggestion: null,
        isLoading: false,
        position: null,
        isEnabled: true,
    });

    const completionRef = useRef<CompletionRegistration | null>(null);

    const toggleEnabled = useCallback(() => {
        setState((prev) => {
            const isEnabled = !prev.isEnabled;
            if (!isEnabled) {
                completionRef.current?.deregister();
            }
            return { ...prev, isEnabled };
        });
    }, []);

    const fetchSuggestion = useCallback(
        async (type: string, editor: StandaloneCodeEditor, monaco: Monaco) => {
            if (!state.isEnabled || !editor) return;

            // Register monacopilot once per editor instance
            if (!completionRef.current) {
                setState((prev) => ({ ...prev, isLoading: true }));

                completionRef.current = registerCompletion(monaco, editor, {
                    endpoint: "/api/code-completion", // your backend route
                    language: editor.getModel()?.getLanguageId() ?? "javascript",
                });

                setState((prev) => ({ ...prev, isLoading: false }));
            }

            // NOTE: monacopilot internally fetches suggestions and handles ghost text,
            // so here we just set a "trigger" state
            setState((prev) => {
                const pos = editor.getPosition();
                return {
                    ...prev,
                    suggestion: null, // ghost text is rendered by monacopilot directly
                    position:
                        pos && typeof pos.lineNumber === "number" && typeof pos.column === "number"
                            ? { line: pos.lineNumber, column: pos.column }
                            : null,
                };
            });
        },
        [state.isEnabled]
    );

    const acceptSuggestion = useCallback(
        (editor: StandaloneCodeEditor, monaco: Monaco) => {
            // monacopilot already wires Tab/Enter to accept suggestions,
            // but if you want manual trigger, you could simulate here.
            // Keeping stub for API compatibility.
            console.log("acceptSuggestion: handled by monacopilot internally.");
        },
        []
    );

    const rejectSuggestion = useCallback((editor: StandaloneCodeEditor) => {
        console.log("rejectSuggestion: handled by monacopilot internally.");
    }, []);

    const clearSuggestion = useCallback((editor: StandaloneCodeEditor) => {
        console.log("clearSuggestion: handled by monacopilot internally.");
    }, []);

    useEffect(() => {
        return () => {
            completionRef.current?.deregister();
        };
    }, []);

    return {
        ...state,
        toggleEnabled,
        fetchSuggestion,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestion,
    };
};
