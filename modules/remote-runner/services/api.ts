import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

export interface RunnerSession {
    sessionId: string;
    previewUrl: string;
}

export interface RunnerAPI {
    startSession(files: TemplateFolder): Promise<RunnerSession>;
    updateSession(sessionId: string, files: TemplateFolder): Promise<void>;
}

const RUNNER_SERVICE_URL = "https://curavibe-runner-service.onrender.com";

export const RemoteRunnerAPI: RunnerAPI = {
    async startSession(files: TemplateFolder): Promise<RunnerSession> {
        console.log("[RemoteRunnerAPI] Starting session...");

        try {
            const response = await fetch(`${RUNNER_SERVICE_URL}/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(files),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to start session: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            // The service returns the session ID. 
            // The preview URL is constructed based on the service's structure.
            // Based on user code: app.use("/preview/:sessionId", ...)
            const sessionId = data.sessionId;

            return {
                sessionId,
                previewUrl: `${RUNNER_SERVICE_URL}/preview/${sessionId}`
            };
        } catch (error) {
            console.error("[RemoteRunnerAPI] Start session error:", error);
            throw error;
        }
    },

    async updateSession(sessionId: string, files: TemplateFolder): Promise<void> {
        console.log(`[RemoteRunnerAPI] Updating session ${sessionId}...`);

        try {
            const response = await fetch(`${RUNNER_SERVICE_URL}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId,
                    files
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update session: ${response.status} ${errorText}`);
            }

            return;
        } catch (error) {
            console.error("[RemoteRunnerAPI] Update session error:", error);
            throw error;
        }
    }
};
