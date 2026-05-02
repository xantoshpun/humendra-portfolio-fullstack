"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProjectSchema, type ProjectInput } from "@/lib/schemas";
import { createProject, updateProject } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

type FormShape = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  thumbnailUrl: string;
  techTagsCsv: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  publishedAt: string;
};

function toFormShape(initial: ProjectInput): FormShape {
  return {
    slug: initial.slug,
    title: initial.title,
    summary: initial.summary,
    body: initial.body,
    thumbnailUrl: initial.thumbnailUrl ?? "",
    techTagsCsv: initial.techTags.join(", "),
    liveUrl: initial.liveUrl ?? "",
    repoUrl: initial.repoUrl ?? "",
    featured: initial.featured,
    publishedAt: initial.publishedAt
      ? (initial.publishedAt instanceof Date
          ? initial.publishedAt
          : new Date(initial.publishedAt)
        )
          .toISOString()
          .slice(0, 16)
      : "",
  };
}

function toInput(values: FormShape, order: number): ProjectInput {
  const publishedAt = values.publishedAt
    ? new Date(values.publishedAt)
    : null;
  return {
    slug: values.slug.trim(),
    title: values.title.trim(),
    summary: values.summary.trim(),
    body: values.body,
    thumbnailUrl: values.thumbnailUrl.trim() || null,
    techTags: values.techTagsCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    liveUrl: values.liveUrl.trim() || null,
    repoUrl: values.repoUrl.trim() || null,
    featured: values.featured,
    publishedAt,
    order,
  };
}

export function ProjectForm({ mode, initial }: { mode: Mode; initial: ProjectInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = ProjectSchema.safeParse(toInput(values, initial.order));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        const key = head === "techTags" ? "techTagsCsv" : head;
        if (!errors[key]) errors[key] = { type: "validation", message: issue.message };
      }
      return { values: {}, errors };
    },
  });

  function onSubmit(values: FormShape) {
    setServerFieldErrors({});
    startTransition(async () => {
      const input = toInput(values, initial.order);
      const res =
        mode.kind === "create"
          ? await createProject(input)
          : await updateProject(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Project created" : "Project saved");
        router.push("/admin/projects");
        router.refresh();
      } else {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.errors)) {
          mapped[k === "techTags" ? "techTagsCsv" : k] = v;
        }
        setServerFieldErrors(mapped);
        toast.error(res.message ?? "Couldn't save — see fields above");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.title}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="my-project" />
                </FormControl>
                <FormMessage>{serverFieldErrors.slug}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Input {...field} placeholder="One-sentence description" />
              </FormControl>
              <FormMessage>{serverFieldErrors.summary}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body (Markdown)</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-64 font-mono text-sm" />
              </FormControl>
              <FormMessage>{serverFieldErrors.body}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techTagsCsv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech tags</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Python, PyTorch, Hugging Face" />
              </FormControl>
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
              <FormMessage>{serverFieldErrors.techTagsCsv}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://…" />
                </FormControl>
                <FormMessage>{serverFieldErrors.liveUrl}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repo URL (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://github.com/…" />
                </FormControl>
                <FormMessage>{serverFieldErrors.repoUrl}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail (optional)</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage>{serverFieldErrors.thumbnailUrl}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publish date (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Leave blank to save as draft.
                </p>
                <FormMessage>{serverFieldErrors.publishedAt}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end pb-1">
                <FormLabel>Featured</FormLabel>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="size-4 rounded border border-input"
                  />
                  <span className="text-sm">Show on home page</span>
                </label>
                <FormMessage>{serverFieldErrors.featured}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : mode.kind === "create" ? "Create" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
