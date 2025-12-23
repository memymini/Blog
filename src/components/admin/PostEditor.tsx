"use client";

import { useFormStatus } from "react-dom";
import { type Post } from "@prisma/client";
import { createPost, updatePost } from "@/actions/post.action";
import dynamic from "next/dynamic";
import { useState, useActionState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const initialState = {
  message: "",
};

export default function PostEditor({ post }: { post?: Post }) {
  const updatePostWithId = updatePost.bind(null, post?.id || "");
  const action = post ? updatePostWithId : createPost;
  const [state, formAction] = useActionState(action, initialState);
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.image || "");

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
            defaultValue={post?.title}
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
            defaultValue={post?.slug}
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="mb-2 block">
            Category
          </Label>
          <Input
            id="category"
            type="text"
            name="category"
            defaultValue={post?.category || "Tech"}
          />
        </div>

        <div>
          <Label htmlFor="readTime" className="mb-2 block">
            Read Time
          </Label>
          <Input
            id="readTime"
            type="text"
            name="readTime"
            defaultValue={post?.readTime || "5 min read"}
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

        <div className="flex items-center gap-2 pt-8">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={post?.published}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="excerpt" className="mb-2 block">
            Excerpt
          </Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt}
            rows={3}
            required
          />
        </div>

        <div className="md:col-span-2" data-color-mode="light">
          <Label className="mb-2 block">Content</Label>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            height={500}
            preview="edit"
          />
          {/* Hidden input to pass value to Server Action */}
          <input type="hidden" name="content" value={content} />
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
      {pending ? "Saving..." : "Save Post"}
    </Button>
  );
}
