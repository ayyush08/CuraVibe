"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RepoSelectionModal from "./repo-selecting-modal";
import { createPlayground, createPlaygroundFromGithub } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateFromGithubParams } from "../../types";
import { BorderBeam } from "@/components/ui/border-beam";

const AddRepo = () => {
  const currentUserId = useCurrentUser()?.id;
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    if (!currentUserId) return;
    setShowModal(true);
  };
  const router = useRouter();
  const [creatingPlayground, setCreatingPlayground] = useState(false);
  const handleSubmit = async (data: CreateFromGithubParams) => {
    setCreatingPlayground(true);
    const res = await createPlaygroundFromGithub(data);
    toast.success("Playground Created successfully");
    setShowModal(false);
    setCreatingPlayground(false);
    router.push(`/playground/${res?.id}`);
  };

  return (
    <div className="relative">
      <div
        className="group px-6 py-6 flex flex-row justify-between items-center border border-orange-500/10  rounded-lg  cursor-pointer 
            transition-all duration-300 ease-in-out
              hover:scale-[1.02]
            shadow-[0_2px_10px_rgba(0,0,0,0.08)]
            hover:shadow-[0_10px_30px_rgba(243,110,6,0.25)]"
        onClick={handleClick}
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#f36e06] group-hover:text-[#f36e06] transition-colors duration-300"
            size={"icon"}
            onClick={() => {
              if (!currentUserId) return;
              // Handle add repo logic here
            }}
          >
            <ArrowDown
              size={30}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#f36e06]">
              Open Github Repository
            </h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Work with your repositories in our editor
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <BorderBeam duration={12} size={100} className="from-amber-500 via-orange-500 to-yellow-500" borderWidth={1}/>
      </div>
      <RepoSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        creatingPlayground={creatingPlayground}
      />
    </div>
  );
};

export default AddRepo;
