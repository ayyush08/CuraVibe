
import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, ChevronRight, FolderGit2, Star, Lock, Github, Loader2, CheckCircle2, Folder, AlertCircle } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { useRepoFolders } from "../../hooks/useRepoFolders"
import { useGithubAuth } from "../../hooks/useGitHubAuth"
import { useGithubRepos } from "../../hooks/useGitHubRepos"
import RepoCard from "./repo-card"
import Link from "next/link"
import { createPlayground } from "../../actions"
import { toast } from "sonner"
import { CreateFromGithubParams } from "../../types"

interface AddGithubRepoModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateFromGithubParams) => void;
    creatingPlayground: boolean;
}

export default function AddGithubRepoModal({ isOpen, onClose, onSubmit, creatingPlayground }: AddGithubRepoModalProps) {

    const [selectedRepo, setSelectedRepo] = useState<any>(null)
    const [selectedFolder, setSelectedFolder] = useState<any>(null)

    const { token: githubAccessToken, loading, connectGithub } = useGithubAuth()
    const { repos, hasMore, loading: reposLoading, lastRepoRef } = useGithubRepos(githubAccessToken,isOpen)
    const {
        repoFolders,
        templateData,
        setTemplateData,
        framework,
        loadingFolders,
        handleSelectRepo,
        handleSelectFolder
    } = useRepoFolders(githubAccessToken)

    const handleRepoClick = async (repo: any) => {
        setSelectedRepo(repo)
        await handleSelectRepo(repo)
    }

    const handleFolderClick = async (folder: any) => {
        setSelectedFolder(folder)
        await handleSelectFolder(folder, selectedRepo)
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-6">
                <div className="relative mb-4 flex items-center justify-center">
                    {/* Back Button (only when a repo is selected and we’re not at the final success screen) */}
                    {(selectedRepo || templateData) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 cursor-pointer px-4 py-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setSelectedRepo(null);
                                setSelectedFolder(null);
                                setTemplateData(null);
                            }}
                        >
                            ← Back to Repos
                        </Button>
                    )}

                    <DialogTitle className="text-2xl font-bold text-center w-full">
                        Import from GitHub
                    </DialogTitle>
                </div>


                {/* ✅ LOADING STATE */}
                {loading && (
                    <div className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="animate-spin w-6 h-6 mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">Connecting to GitHub...</p>
                    </div>
                )}

                {/* ✅ NOT CONNECTED */}
                {!loading && !githubAccessToken && (
                    <div className="flex flex-col items-center justify-center p-8 space-y-3">
                        <Github className="w-8 h-8 text-muted-foreground" />
                        <p className="text-center text-muted-foreground text-sm">Connect your GitHub account to continue.</p>
                        <RainbowButton onClick={connectGithub}>Connect GitHub</RainbowButton>
                    </div>
                )}

                {/* ✅ CONNECTED UI */}
                {!loading && githubAccessToken && (
                    <div className="space-y-8 overflow-y-auto">

                        {/* STEP 1: Choose Repo */}
                        {!selectedRepo && (
                            <>
                                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                                    {repos.map((repo, index) => (
                                        <RepoCard
                                            key={repo.id}
                                            repo={repo}
                                            index={index}
                                            repos={repos}
                                            lastRepoRef={lastRepoRef}
                                            handleRepoClick={handleRepoClick}
                                        />
                                    ))}

                                    {reposLoading && (
                                        <div className="flex justify-center p-3">
                                            <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* STEP 2: Repo Selected + Folder Selection */}
                        {selectedRepo && !templateData && (
                            <>
                                {/* <Button
                                    variant="ghost"
                                    className="text-sm text-muted-foreground mb-2"
                                    onClick={() => setSelectedRepo(null)}
                                >
                                    ← Back to Repos
                                </Button> */}

                                <h2 className="text-lg font-semibold">Select a Folder in {selectedRepo.name}</h2>

                                {loadingFolders ? (
                                    <div className="flex justify-center p-6">
                                        <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {repoFolders.map((folder, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleFolderClick(folder)}
                                                disabled={!folder.hasPackageJson}
                                                className={`w-full p-3 border rounded-md flex justify-between ${folder.hasPackageJson
                                                    ? "hover:bg-muted transition"
                                                    : "opacity-50 cursor-not-allowed"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Folder className="w-4 h-4 text-muted-foreground" />
                                                    <span>{folder.name || "root"}</span>
                                                </div>
                                                {folder.hasPackageJson ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ✅ FINAL SUCCESS UI */}
                        {templateData && (
                            <div className="space-y-4">
                                {/* <Button
                                    variant="ghost"
                                    className="text-sm text-muted-foreground"
                                    onClick={() => {
                                        setSelectedRepo(null);
                                        setSelectedFolder(null);
                                    }}
                                >
                                    ← Back
                                </Button> */}

                                <div className="border rounded-md p-4 flex flex-col items-center gap-5 justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                                    <div className="flex gap-2">

                                        <span className="text-2xl text-center font-semibold mb-2">{
                                            `Repository `
                                        }</span>
                                        <Link className="text-2xl font-semibold text-orange-500 font-mono hover:text-blue-500 hover:underline" href={selectedRepo?.html_url} target="_blank" rel="noopener noreferrer">
                                            {selectedRepo?.name}
                                        </Link>
                                        <span className="text-2xl text-center font-semibold mb-2">{
                                            ` Linked Successfully!`
                                        }</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Framework: <span className="uppercase font-medium">{framework || "UNKNOWN"}</span>
                                    </p>
                                    <RainbowButton
                                        disabled={creatingPlayground}
                                        onClick={() => onSubmit({
                                            description: selectedRepo?.description || "",
                                            title: selectedRepo?.name,
                                            framework: framework || "UNKNOWN",
                                            templateData: templateData,
                                            
                                        })}
                                    >
                                        {creatingPlayground ? "Creating Playground..." : "Create Playground"}
                                    </RainbowButton>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

