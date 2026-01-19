'use client'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TemplateFile, TemplateFolder } from '@/modules/playground/lib/path-to-json'
import { TemplateFileTree } from '@/modules/playground/components/playground-explorer'
import { useFileExplorer } from '@/modules/playground/hooks/useFileExplorer'
import { usePlayground } from '@/modules/playground/hooks/usePlayground'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, FileText, FolderOpen, Save, Settings, X, Cpu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { PlaygroundEditor } from '@/modules/playground/components/playground-editor'
import LoadingStep from '@/modules/playground/components/loader'
import { findFilePath } from '@/modules/playground/lib'
import { toast } from 'sonner'
import ToggleAI from '@/modules/playground/components/toggle-ai'
import { useMonacoPilot } from '@/modules/playground/hooks/useMonacoPilot'

// NEW IMPORTS
import { useRemoteRunner } from '@/modules/remote-runner/hooks/useRemoteRunner'
import RemoteRunnerPreview from '@/modules/remote-runner/components/remote-runner-preview'

const RemoteRunnerPage = () => {
    const { id } = useParams<{ id: string }>()
    const [isPreviewVisible, setIsPreviewVisible] = useState(true)

    // Use existing playground hooks for data loading
    const { playgroundData, templateData, isLoading, error, loadPlayground, saveTemplateData } = usePlayground(id)

    const aiSuggestions = useMonacoPilot()

    const {
        setTemplateData,
        setActiveFileId,
        setPlaygroundId,
        setOpenFiles,
        activeFileId,
        closeAllFiles,
        closeFile,
        openFile,
        openFiles,
        openFiles: openFilesList, // Alias for clarity if needed

        handleAddFile,
        handleAddFolder,
        handleDeleteFile,
        handleDeleteFolder,
        handleRenameFile,
        handleRenameFolder,
        updateFileContent
    } = useFileExplorer();

    // NEW EXECTUION HOOK
    const {
        serverUrl,
        isLoading: runnerLoading,
        error: runnerError,
        isConnected,
        updateFiles: updateRemoteFiles
    } = useRemoteRunner({ templateData })

    useEffect(() => {
        setPlaygroundId(id)
    }, [id, setPlaygroundId])

    useEffect(() => {
        if (templateData && !openFiles.length) {
            setTemplateData(templateData)
        }
    }, [templateData, setTemplateData, openFiles.length])

    // --- WRAPPED HANDLERS (Modified to not use WebContainer primitives) ---

    // Note: Remote Runner doesn't support direct file system operations like writeFileSync locally
    // in the same way WebContainers do. We rely on the `updateRemoteFiles` sync.
    // For local state updates, we just pass the standard handlers.

    const wrappedHandleAddFile = useCallback(
        async (newFile: TemplateFile, parentPath: string) => {
            // We pass null for primitives we don't have/use here
            return handleAddFile(
                newFile,
                parentPath,
                undefined, // writeFileSync
                null, // instance
                saveTemplateData
            );
        },
        [handleAddFile, saveTemplateData]
    );

    const wrappedHandleAddFolder = useCallback(
        (newFolder: TemplateFolder, parentPath: string) => {
            return handleAddFolder(newFolder, parentPath, null, saveTemplateData);
        },
        [handleAddFolder, saveTemplateData]
    );

    const wrappedHandleDeleteFile = useCallback(
        (file: TemplateFile, parentPath: string) => {
            return handleDeleteFile(file, parentPath, saveTemplateData);
        },
        [handleDeleteFile, saveTemplateData]
    );

    const wrappedHandleDeleteFolder = useCallback(
        (folder: TemplateFolder, parentPath: string) => {
            return handleDeleteFolder(folder, parentPath, saveTemplateData);
        },
        [handleDeleteFolder, saveTemplateData]
    );

    const wrappedHandleRenameFile = useCallback(
        (
            file: TemplateFile,
            newFilename: string,
            newExtension: string,
            parentPath: string
        ) => {
            return handleRenameFile(
                file,
                newFilename,
                newExtension,
                parentPath,
                saveTemplateData
            );
        },
        [handleRenameFile, saveTemplateData]
    );

    const wrappedHandleRenameFolder = useCallback(
        (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
            return handleRenameFolder(
                folder,
                newFolderName,
                parentPath,
                saveTemplateData
            );
        },
        [handleRenameFolder, saveTemplateData]
    );


    const activeFile = openFiles.find((file) => file.id === activeFileId)
    const hasUnsavedChanges = openFiles.some(file => file.hasUnsavedChanges);


    const handleFileSelect = (file: TemplateFile) => {
        openFile(file)
    }

    const handleSave = useCallback(async (
        fileId?: string
    ) => {
        const targetFileId = fileId || activeFileId;
        if (!targetFileId) return;

        const fileToSave = openFiles.find((f) => f.id == targetFileId)
        if (!fileToSave) return;

        const latestTemplateData = useFileExplorer.getState().templateData;
        if (!latestTemplateData) return;

        try {
            // Update local template state
            const updatedTemplateData = JSON.parse(
                JSON.stringify(latestTemplateData)
            );

            // @ts-ignore
            const updateContentRecursive = (items: any[]) =>
                // @ts-ignore
                items.map((item) => {
                    if ("folderName" in item) {
                        return { ...item, items: updateContentRecursive(item.items) };
                    } else if (
                        item.filename === fileToSave.filename &&
                        item.fileExtension === fileToSave.fileExtension
                    ) {
                        return { ...item, content: fileToSave.content };
                    }
                    return item;
                });

            updatedTemplateData.items = updateContentRecursive(
                updatedTemplateData.items
            );

            // Save to DB
            const newTemplateData = await saveTemplateData(updatedTemplateData);
            setTemplateData(newTemplateData! || updatedTemplateData);

            // Sync with Remote Runner
            // We sync the ENTIRE template data on save for this mock implementation
            // A real diffing implementation would be better for performance
            await updateRemoteFiles(newTemplateData! || updatedTemplateData);


            // Update open files state
            const updatedOpenFiles = openFiles.map((f) =>
                f.id === targetFileId
                    ? {
                        ...f,
                        content: fileToSave.content,
                        originalContent: fileToSave.content,
                        hasUnsavedChanges: false,
                    }
                    : f
            );
            setOpenFiles(updatedOpenFiles);

            toast.success(
                `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
            );


        } catch (error) {
            console.error("Error saving file:", error);
            toast.error(
                `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
            );
        }

    }, [
        activeFileId,
        openFiles,
        saveTemplateData,
        setTemplateData,
        setOpenFiles,
        updateRemoteFiles // Dependency on remote runner sync
    ])

    const handleSaveAll = async () => {
        const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

        if (unsavedFiles.length === 0) {
            toast.info("No unsaved changes");
            return;
        }

        try {
            await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
            toast.success(`Saved ${unsavedFiles.length} file(s)`);
        } catch (error) {
            toast.error(`Failed to save some files: ${error}`);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);



    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="destructive">
                    Try Again
                </Button>
            </div>
        );
    }

    // Initial loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Loading Remote Environment
                    </h2>
                    <div className="mb-8">
                        <LoadingStep
                            currentStep={1}
                            step={1}
                            label="Loading playground data"
                        />
                        {/* We repurpose loading steps here visually */}
                        <LoadingStep
                            currentStep={runnerLoading ? 2 : 3}
                            step={2}
                            label="Connecting to remote runner"
                        />
                        <LoadingStep currentStep={isConnected ? 3 : 2} step={3} label="Ready to code" />
                    </div>
                </div>
            </div>
        );
    }

    // No template data
    if (!templateData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
                <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-semibold text-amber-600 mb-2">
                    No template data available
                </h2>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Template
                </Button>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <TemplateFileTree
                    data={templateData!}
                    onFileSelect={handleFileSelect}
                    selectedFile={activeFile}
                    title="File Explorer"
                    onAddFile={wrappedHandleAddFile}
                    onAddFolder={wrappedHandleAddFolder}
                    onDeleteFile={wrappedHandleDeleteFile}
                    onDeleteFolder={wrappedHandleDeleteFolder}
                    onRenameFile={wrappedHandleRenameFile}
                    onRenameFolder={wrappedHandleRenameFolder}
                />
                <SidebarInset>
                    <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-purple-50/10 dark:bg-purple-900/5'>
                        <SidebarTrigger className='mr-1' />
                        <Separator orientation='vertical' className='mr-2' />
                        {/* Visual indicator that we are in Remote Mode */}
                        <div className="flex flex-1 items-center gap-2">
                            <div className="bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-md">
                                <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <h1 className='text-sm font-medium flex items-center gap-2'>
                                    {playgroundData?.title || "Code Playground"}
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                        Remote Runner
                                    </span>
                                </h1>
                                <p className='text-xs text-muted-foreground'>
                                    {openFiles.length} File(s) Open
                                    {hasUnsavedChanges && " • Unsaved Changes"}
                                </p>
                            </div>

                            {/* Toolbar Buttons */}
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>

                                        <span>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                onClick={() => handleSave()}
                                                disabled={!activeFile || !activeFile.hasUnsavedChanges}

                                            >
                                                <Save className='h-4 w-4' />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save (Ctrl+S)
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={handleSaveAll}
                                            disabled={!hasUnsavedChanges}

                                        >
                                            <Save className='h-4 w-4' /> All
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save All (Ctrl+Shift+S)
                                    </TooltipContent>
                                </Tooltip>

                                <ToggleAI
                                    isEnabled={aiSuggestions.isPilotEnabled}
                                    onToggle={aiSuggestions.toggleEnabled}
                                    suggestionLoading={aiSuggestions.isPilotEnabled}
                                />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                                        >
                                            {isPreviewVisible ? "Hide" : "Show"} Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={closeAllFiles}>
                                            Close All Files
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>


                    <div className="h-[calc(100vh-4rem)]">
                        {
                            openFiles.length > 0 ? (
                                <div className="h-full flex flex-col">
                                    <div className="border-b bg-muted/30">
                                        <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
                                            <div className="flex items-center justify-between px-4 py-2">
                                                <TabsList className="h-8 bg-transparent p-0">
                                                    {openFiles.map((file) => (
                                                        <TabsTrigger
                                                            key={file.id}
                                                            value={file.id}
                                                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-3 w-3" />
                                                                <span>
                                                                    {file.filename}.{file.fileExtension}
                                                                </span>
                                                                {file.hasUnsavedChanges && (
                                                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                                                )}
                                                                <span
                                                                    className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        closeFile(file.id);
                                                                    }}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </span>
                                                            </div>
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>

                                                {openFiles.length > 1 && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={closeAllFiles}
                                                        className="h-6 px-2 text-xs"
                                                    >
                                                        Close All
                                                    </Button>
                                                )}
                                            </div>
                                        </Tabs>
                                    </div>

                                    <div className="flex-1">
                                        <ResizablePanelGroup
                                            direction="horizontal"
                                            className="h-full"
                                        >
                                            <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                                                <PlaygroundEditor
                                                    activeFile={activeFile}
                                                    content={activeFile?.content || ""}
                                                    onContentChange={(value) =>
                                                        activeFileId && updateFileContent(activeFileId, value)
                                                    }
                                                    hasActiveSuggestion={aiSuggestions.hasActiveSuggestion}
                                                    aiEnabled={aiSuggestions.isPilotEnabled}
                                                    suggestionLoading={aiSuggestions.isPilotLoading}
                                                    fetchSuggestion={aiSuggestions.fetchSuggestion}
                                                />
                                            </ResizablePanel>
                                            {
                                                isPreviewVisible && (
                                                    <>
                                                        <ResizableHandle />
                                                        <ResizablePanel defaultSize={50}>
                                                            {/* Changed: RemoteRunnerPreview */}
                                                            <RemoteRunnerPreview
                                                                serverUrl={serverUrl}
                                                                isLoading={runnerLoading}
                                                                error={runnerError}
                                                                isConnected={isConnected}
                                                            />
                                                        </ResizablePanel>
                                                    </>
                                                )
                                            }

                                        </ResizablePanelGroup>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                                    <FileText className="h-16 w-16 text-gray-300" />
                                    <div className="text-center">
                                        <p className="text-lg font-medium">No files open</p>
                                        <p className="text-sm text-gray-500">
                                            Select a file from the sidebar to start editing
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default RemoteRunnerPage
