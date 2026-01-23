"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface RepoCardProps {
  repo: any;
  index: number;
  repos: any[];
  lastRepoRef?: React.Ref<HTMLDivElement>;
  handleRepoClick: (repo: any) => Promise<void>;
}

const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  index,
  repos,
  lastRepoRef,
  handleRepoClick
}) => {
  const topics = repo.topics || [];
  const description = repo.description || "";
  const starCount = repo.stargazers_count || 0;

  return (
    <div
      ref={repos.length === index + 1 ? lastRepoRef : null}
      onClick={() => handleRepoClick(repo)}
      className="group w-full p-3 border b rounded-md hover:bg-orange-900/10  transition cursor-pointer"
    >
      {/* Main content flex */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <Image
            src={repo.owner.avatar_url || "/placeholder.svg"}
            alt={repo.owner.login}
            width={28}
            height={28}
            className="rounded-full flex-shrink-0 mt-0.5"
          />

          <div className="min-w-0 flex-1 ">
            {/* Repo Name */}
            <p className="font-semibold text-sm text-foreground group-hover:text-orange-500 transition-all duration-300 truncate">
              {repo.name}
            </p>

            {/* Description */}
            {description && (
              <p className="text-xs text-muted-foreground truncate mb-1.5">
                {description}
              </p>
            )}

            {/* Topics/Tags */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {topics.slice(0, 3).map((topic: string) => (
                  <Badge key={topic} variant="outline" className="text-xs border">
                    {topic}
                  </Badge>
                ))}
                {topics.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{topics.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Star count + Icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">
              {starCount > 999
                ? `${(starCount / 1000).toFixed(1)}k`
                : starCount}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
