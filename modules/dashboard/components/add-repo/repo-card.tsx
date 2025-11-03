import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface RepoCardProps {
    repo: any;
    index: number;
    repos: any[];
    lastRepoRef: React.Ref<HTMLButtonElement>;
    handleRepoClick: (repo: any) => Promise<void>;
}

const RepoCard: React.FC<RepoCardProps> = ({
    repo,
    index,
    repos,
    lastRepoRef,
    handleRepoClick
}) => {
    const topics = repo.topics || []
    const description = repo.description || ""

    return (
        <Button
            variant="default"
            key={index}
            ref={repos.length === index + 1 ? lastRepoRef : null}
            onClick={() => handleRepoClick(repo)}
            className="
      w-full
      !justify-between 
      bg-transparent
      hover:bg-transparent
      border-2
      hover:border-orange-500
      text-orange-500
      px-4 py-4
      rounded-md
      overflow-hidden
      text-left
      min-h-[150px]
      cursor-pointer

  "
        >

            <div className="flex flex-col flex-wrap items-start gap-1 w-full min-w-0 py-10">
                <div className="flex items-center gap-2 w-full min-w-0">
                    <Image
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <p className="font-bold tracking-wide truncate text-xl max-w-full">{repo.name}</p>
                </div>

                {topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-w-full">
                        {topics.slice(0, 6).map((topic: string) => (
                            <Badge key={topic} variant="outline" className="text-xs border-orange-800 bg-orange-950/50">
                                {topic}
                            </Badge>
                        ))}
                        {topics.length > 6 && (
                            <Badge variant="outline" className="text-xs opacity-70 border-orange-500">
                                +{topics.length - 6}
                            </Badge>
                        )}
                    </div>
                )}

                <p className="text-sm text-muted-foreground truncate max-w-full p-2">
                    {description}
                </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {repo.stargazers_count}
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
        </Button>
    )
}

export default RepoCard
