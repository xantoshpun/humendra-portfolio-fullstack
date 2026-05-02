"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ExperienceSchema, type ExperienceInput } from "@/lib/schemas";
import { createExperience, updateExperience } from "./actions";
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
  role: string;
  company: string;
  date: string;
  badgeText: string;
  badgeColor: "" | "cyan" | "green" | "purple";
  skillsCsv: string;
};

function toFormShape(initial: ExperienceInput): FormShape {
  return {
    role: initial.role,
    company: initial.company,
    date: initial.date,
    badgeText: initial.badgeText ?? "",
    badgeColor: (initial.badgeColor as "" | "cyan" | "green" | "purple") ?? "",
    skillsCsv: initial.skills.join(", "),
  };
}

function toInput(values: FormShape, order: number): ExperienceInput {
  const badgeText = values.badgeText.trim();
  return {
    role: values.role.trim(),
    company: values.company.trim(),
    date: values.date.trim(),
    badgeText: badgeText || null,
    badgeColor: values.badgeColor === "" ? null : values.badgeColor,
    skills: values.skillsCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order,
  };
}

export function ExperienceForm({ mode, initial }: { mode: Mode; initial: ExperienceInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = ExperienceSchema.safeParse(toInput(values, initial.order));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        const key = head === "skills" ? "skillsCsv" : head;
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
          ? await createExperience(input)
          : await updateExperience(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Experience created" : "Experience saved");
        router.push("/admin/experience");
        router.refresh();
      } else {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.errors)) {
          mapped[k === "skills" ? "skillsCsv" : k] = v;
        }
        setServerFieldErrors(mapped);
        toast.error(res.message ?? "Couldn't save — see fields above");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{serverFieldErrors.role}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.company}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jan 2023 – Present" />
                </FormControl>
                <FormMessage>{serverFieldErrors.date}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="badgeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge text (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Full-time" />
                </FormControl>
                <FormMessage>{serverFieldErrors.badgeText}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="badgeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge color</FormLabel>
                <Select
                  value={field.value || "__none"}
                  onValueChange={(v) => field.onChange(v === "__none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— none —</SelectItem>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{serverFieldErrors.badgeColor}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skillsCsv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Python, PyTorch, AWS" />
              </FormControl>
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
              <FormMessage>{serverFieldErrors.skillsCsv}</FormMessage>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : mode.kind === "create" ? "Create" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/experience")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
