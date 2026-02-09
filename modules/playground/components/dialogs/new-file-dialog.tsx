"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (filename: string, extension: string) => void;
}

function NewFileDialog({ isOpen, onClose, onCreateFile }: NewFileDialogProps) {
  const [filename, setFilename] = React.useState("");
  const [extension, setExtension] = React.useState("ts");

  const commonExtensions = [
    { value: "ts", label: "TypeScript (.ts)" },
    { value: "tsx", label: "TypeScript React (.tsx)" },
    { value: "js", label: "JavaScript (.js)" },
    { value: "jsx", label: "JavaScript React (.jsx)" },
    { value: "json", label: "JSON (.json)" },
    { value: "css", label: "CSS (.css)" },
    { value: "html", label: "HTML (.html)" },
    { value: "md", label: "Markdown (.md)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onCreateFile(filename.trim(), extension.trim() || "ts");
      setFilename("");
      setExtension("ts");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter a name for the new file and select its extension.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                Filename
              </Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="col-span-2"
                autoFocus
                placeholder="main"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="extension" className="text-right">
                Type
              </Label>
              <select
                id="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="col-span-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {commonExtensions.map((ext) => (
                  <option key={ext.value} value={ext.value}>
                    {ext.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!filename.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewFileDialog;   