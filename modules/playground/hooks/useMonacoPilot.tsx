"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    registerCompletion,
    type CompletionRegistration,
    type Monaco,
    type StandaloneCodeEditor,
} from "monacopilot";

interface MonacoPilotState {
    isPilotLoading: boolean;
    isPilotEnabled: boolean;
    hasActiveSuggestion?: boolean;

}

interface UseMonacoPilotReturn extends MonacoPilotState {
    toggleEnabled: () => void;
    fetchSuggestion: (editor: StandaloneCodeEditor, monaco: Monaco) => void;
}

export const useMonacoPilot = (): UseMonacoPilotReturn => {
    const [state, setState] = useState<MonacoPilotState>({
        isPilotLoading: false,
        isPilotEnabled: true,
        hasActiveSuggestion: false,
    });

    const completionRef = useRef<CompletionRegistration | null>(null);
    const stateRef = useRef<MonacoPilotState>(state);

    console.log("AI Suggestion State:", state);
    console.log("Completion Ref:", completionRef.current);
    

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Toggle enable/disable AI
    const toggleEnabled = useCallback(() => {
        setState((prev) => {
            const isPilotEnabled = !prev.isPilotEnabled;
            if (!isPilotEnabled) {
                completionRef.current?.deregister();
                completionRef.current = null;
            }
            return { ...prev, isPilotEnabled };
        });
    }, []);

    // Register Monacopilot completion
    const register = useCallback(
        (editor: StandaloneCodeEditor, monaco: Monaco) => {
            // if (completionRef.current || !stateRef.current.isPilotEnabled) return;

            completionRef.current = registerCompletion(monaco, editor, {
                endpoint: "/api/code-completion-new",
                language: editor.getModel()?.getLanguageId() || "javascript",
                onCompletionRequested: () =>
                    setState((prev) => ({ ...prev, isPilotLoading: true })),
                onCompletionRequestFinished: () =>
                    setState((prev) => ({ ...prev, isPilotLoading: false })),
                onCompletionShown: () =>
                    setState((prev) => ({ ...prev, isPilotLoading: false, hasActiveSuggestion: true })),
                onCompletionAccepted() {
                    setState((prev) => ({ ...prev, hasActiveSuggestion: false }));
                },
                onCompletionRejected() {
                    setState((prev) => ({ ...prev, hasActiveSuggestion: false }));
                    completionRef.current?.deregister();
                    completionRef.current = null;
                },
            });
        },
        []
    );

    // Trigger suggestion manually
    const fetchSuggestion = useCallback(
        (editor: StandaloneCodeEditor, monaco: Monaco) => {
            if (!stateRef.current.isPilotEnabled) return;
            if (!completionRef.current)
            register(editor, monaco);
            completionRef.current?.trigger();
        },
        [register]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            completionRef.current?.deregister();
            completionRef.current = null;
        };
    }, []);

    return {
        ...state,
        toggleEnabled,
        fetchSuggestion,
        hasActiveSuggestion: state.hasActiveSuggestion,
    };
};
