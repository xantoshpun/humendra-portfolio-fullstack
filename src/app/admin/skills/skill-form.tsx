"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SkillSchema, type SkillInput } from "@/lib/schemas";
import { createSkill, updateSkill } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

type FormShape = {
  icon: string;
  title: string;
  color: SkillInput["color"];
  tagsCsv: string;
};

function toFormShape(initial: SkillInput): FormShape {
  return {
    icon: initial.icon,
    title: initial.title,
    color: initial.color,
    tagsCsv: initial.tags.join(", "),
  };
}

function toInput(values: FormShape, order: number): SkillInput {
  return {
    icon: values.icon.trim(),
    title: values.title.trim(),
    color: values.color,
    tags: values.tagsCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order,
  };
}

export function SkillForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial: SkillInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = SkillSchema.safeParse(toInput(values, initial.order));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        const key = head === "tags" ? "tagsCsv" : head;
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
          ? await createSkill(input)
          : await updateSkill(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Skill created" : "Skill saved");
        router.push("/admin/skills");
        router.refresh();
      } else {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.errors)) {
          mapped[k === "tags" ? "tagsCsv" : k] = v;
        }
        setServerFieldErrors(mapped);
        toast.error(res.message ?? "Couldn't save — see fields above");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="📊" />
                </FormControl>
                <FormMessage>{serverFieldErrors.icon}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Power BI" />
                </FormControl>
                <FormMessage>{serverFieldErrors.title}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyan">Cyan</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>{serverFieldErrors.color}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagsCsv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input {...field} placeholder="DAX, Power Query, modeling" />
              </FormControl>
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
              <FormMessage>{serverFieldErrors.tagsCsv}</FormMessage>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : mode.kind === "create" ? "Create skill" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/skills")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
