"use client";

import { useFormStatus } from "react-dom";
import { type Project } from "@prisma/client";
import { createProject, updateProject } from "@/actions/project.action";
import { useState, useActionState } from "react";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";

const initialState = {
  message: "",
};

export default function ProjectEditor({ project }: { project?: Project }) {
  const updateProjectWithId = updateProject.bind(null, project?.id || "");
  const action = project ? updateProjectWithId : createProject;
  const [state, formAction] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(project?.image || "");

  return (
    <form action={formAction} className="flex max-w-4xl flex-col gap-6">
      {state?.message && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.message}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title" className="mb-2 block">
            Title
          </Label>
          <Input
            id="title"
            type="text"
            name="title"
            defaultValue={project?.title}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug" className="mb-2 block">
            Slug
          </Label>
          <Input
            id="slug"
            type="text"
            name="slug"
            defaultValue={project?.slug}
            required
          />
        </div>

        <div>
          <Label htmlFor="order" className="mb-2 block">
            Order (Priority)
          </Label>
          <Input
            id="order"
            type="number"
            name="order"
            defaultValue={project?.order || 0}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={project?.description}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="period" className="mb-2 block">
            Period
          </Label>
          <Input
            id="period"
            type="text"
            name="period"
            defaultValue={project?.period || ""}
          />
        </div>

        <div>
          <Label htmlFor="tech" className="mb-2 block">
            Tech Stack (comma separated)
          </Label>
          <Input
            id="tech"
            type="text"
            name="tech"
            defaultValue={project?.tech?.join(", ") || ""}
          />
        </div>

        <div>
          <ImageUploader
            name="image"
            value={imageUrl}
            onChange={setImageUrl}
            label="Image URL"
          />
        </div>

        <div>
          <Label htmlFor="github" className="mb-2 block">
            GitHub URL
          </Label>
          <Input
            id="github"
            type="text"
            name="github"
            defaultValue={project?.github || ""}
          />
        </div>

        <div>
          <Label htmlFor="link" className="mb-2 block">
            Live Link URL
          </Label>
          <Input
            id="link"
            type="text"
            name="link"
            defaultValue={project?.link || ""}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="detail" className="mb-2 block">
            Case Study Detail (JSON Format)
          </Label>
          <Textarea
            id="detail"
            name="detail"
            defaultValue={
              project?.detail ? JSON.stringify(project.detail, null, 2) : ""
            }
            rows={10}
            className="font-mono"
            placeholder='{"problem": "...", "solution": "..."}'
          />
          <p className="mt-1 text-xs text-gray-500">
            Edit raw JSON for complex details.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : "Save Project"}
    </Button>
  );
}
