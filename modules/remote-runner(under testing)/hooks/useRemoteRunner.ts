import { useState, useEffect, useCallback, useRef } from 'react';
import { TemplateFolder } from '@/modules/playground/lib/path-to-json';
import { RemoteRunnerAPI } from '../services/api';
import { toast } from 'sonner';

interface UseRemoteRunnerProps {
    templateData: TemplateFolder | null;
}

interface UseRemoteRunnerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    updateFiles: (files: TemplateFolder) => Promise<void>;
}

export const useRemoteRunner = ({ templateData }: UseRemoteRunnerProps): UseRemoteRunnerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Store latest template data to avoid stale closures in effects if needed
    const templateDataRef = useRef(templateData);

    useEffect(() => {
        templateDataRef.current = templateData;
    }, [templateData]);

    // Initial session start
    useEffect(() => {
        let mounted = true;

        async function initSession() {
            if (!templateData) return;

            // If already initialized or loading, skip
            if (sessionId || isLoading) return;

            try {
                setIsLoading(true);
                setError(null);

                const session = await RemoteRunnerAPI.startSession(templateData);

                if (mounted) {
                    setSessionId(session.sessionId);
                    setServerUrl(session.previewUrl);
                    setIsConnected(true);
                    toast.success("Remote development environment ready");
                }
            } catch (err) {
                console.error("Failed to start remote session:", err);
                if (mounted) {
                    setError("Failed to start remote runner session");
                    setIsConnected(false);
                    toast.error("Failed to connect to remote runner");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        initSession();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateData]); // Dependency on templateData (initially) is intentional for startup

    // Update function exposed to consumers
    const updateFiles = useCallback(async (files: TemplateFolder) => {
        if (!sessionId) {
            console.warn("Cannot update files: No active session");
            return;
        }

        try {
            await RemoteRunnerAPI.updateSession(sessionId, files);
        } catch (err) {
            console.error("Failed to update remote session:", err);
            toast.error("Failed to sync changes to remote runner");
        }
    }, [sessionId]);

    return {
        serverUrl,
        isLoading,
        error,
        isConnected,
        updateFiles
    };
};
