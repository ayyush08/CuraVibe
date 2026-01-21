"use client";

import Image from "next/image";
import moment from 'moment';
import type { Project } from "../types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Download,
  Eye,
  Star,
  Icon,
  PlusIcon,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { MarkedToggleButton } from "./marked-toggle";
import ElectroBorder from "@/components/lightswind/electro-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { templateToIconMap } from "./template-icons";

interface ProjectSectionShowcaseProps {
  projects: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string }
  ) => Promise<void>;
  onDeleteProject?: (id: string) => Promise<void>;
  onDuplicateProject?: (id: string) => Promise<void>;
  onMarkasFavorite?: (id: string) => Promise<void>;
}

interface EditProjectData {
  title: string;
  description: string;
}

export default function ProjectSectionShowcase({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
  onMarkasFavorite
}: ProjectSectionShowcaseProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [marked, setMarked] = useState(false);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({ title: project.title, description: project.description });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleUpdateStarMark = async (projectId: string) => {
    // if (!selectedProject || !onMarkasFavorite) return;
    setMarked(!marked);
    toast.success(marked ? "Removed from favorites" : "Marked as favorite");
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try {
      await onUpdateProject(selectedProject.id, editData);
      setEditDialogOpen(false);
      toast.success("Project updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try {
      await onDeleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      toast.success("Project deleted successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to duplicate project");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = (projectId: string) => {
    const url = `${window.location.origin}/playground/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success("Project URL copied to clipboard");
  };

  return (
    <>
      {/* Flexbox with fixed card dimensions for consistent sizing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full ">
        {projects.map((project, index) => (
          <div key={project.id} className=" relative ">
            <PlusIcon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black z-10" />
            <PlusIcon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black z-10" />
            <PlusIcon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black z-10" />
            <PlusIcon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black z-10" />
            <Card className="flex flex-col overflow-hidden rounded-none group relative transition-all duration-300 hover:shadow-2xl border border-orange-500 dark:bg-transparent bg-transparent h-full w-full">
              {/* Card Header */}
              <div className="flex items-center mx-auto  justify-center gap-3 p-5 border-b border-border/40">
                <div className="flex items-center  gap-3 flex-1 hover:scale-[1.05] transition-all duration-300">
                  {/* Template Icon */}
                  <div className=" mt-1 text-orange-500 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {templateToIconMap.find(
                          (icon) =>
                            icon.name.toLowerCase() ===
                            project.template.toLowerCase()
                        )?.icon || <Zap className="w-5 h-5" />}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.template}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Title */}
                  <div className="">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`playground/${project.id}`}
                          className="hover:text-orange-500 transition-all duration-300 "
                        >
                          <h3 className="font-semibold text-2xl text-center transition-all duration-300 break-words">
                            {project.title}
                          </h3>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to open {project.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col p-5">
                {/* Enhanced Description */}
                <div className="relative">
                  <div className="absolute -left-3 -top-2 w-1 h-8 bg-gradient-to-b from-orange-500/80 via-amber-300/60 to-transparent rounded-full"></div>
                  <p className=" text-muted-foreground line-clamp-2  transition-all duration-300 pl-2 italic leading-relaxed">
                    {project.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Footer with Actions and Created Date */}
              <div className="flex items-center justify-between w-full gap-3 px-5 py-4 border-t border-border/40 relative">
                {/* Left: Inline Actions */}
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => handleUpdateStarMark(project.id)}
                        aria-label="Add to favorites"
                      >
                        <Star
                          className={`h-4 w-4 ${marked ? "fill-yellow-500 text-yellow-500" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Favorite</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Link
                          href={`playground/${project.id}`}
                          aria-label="Open project"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                      >
                        <Link
                          href={`playground/${project.id}`}
                          target="_blank"
                          aria-label="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open in new tab</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => handleEditClick(project)}
                        aria-label="Edit project"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => handleDuplicateProject(project)}
                        aria-label="Duplicate project"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Duplicate</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => copyProjectUrl(project.id)}
                        aria-label="Copy URL"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy URL</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProject()}
                        aria-label="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>

                {/* Right: Created Date */}
                <div className="absolute bottom-2 right-5 text-xs italic font-medium text-orange-500/50">
                  <span>Created {moment(project.createdAt).fromNow()}</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter project title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                placeholder="Enter project description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateProject}
              disabled={isLoading || !editData.title.trim()}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="animate-in fade-in zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedProject?.title}
              &quot;? This action cannot be undone. All files and data
              associated with this project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
