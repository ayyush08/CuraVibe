import { AuroraText } from "@/components/ui/aurora-text";
import { LightRays } from "@/components/ui/light-rays";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser
} from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectSectionShowcase from "@/modules/dashboard/components/project-section";

import Navbar from "@/modules/home/Navbar";
import React from "react";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto  dark:bg-black px-8  w-full">
      <div className="mb-12 w-full  mt-4">
        <h1 className="text-5xl text-center leading-none font-semibold tracking-tighter text-balance ">
          <AuroraText
            className="font-bold inline-block tracking-wide" // ✅ keep inline to center with text
            speed={1}
            colors={["#f36e06", "#de5114"]}
          >
            Your Projects
          </AuroraText>{" "}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl text-center w-full mx-auto">
          AI-powered projects, your choice of stack.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-10 max-w-7xl">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full p-10">
        {playgrounds && playgrounds.length == 0 ? (
          <EmptyState />
        ) : (
          <ProjectSectionShowcase
            //@ts-ignore
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            //@ts-ignore
            onDuplicateProject={duplicateProjectById}
            
          />
        )}
      </div>
    </div>
  );
};

export default Page;
