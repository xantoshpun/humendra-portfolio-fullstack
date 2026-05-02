"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EducationSchema, type EducationInput } from "@/lib/schemas";
import { createEducation, updateEducation } from "./actions";
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
  degree: string;
  institution: string;
  date: string;
  honour: string;
  honourColor: "" | "cyan" | "amber" | "green" | "purple";
  focusCsv: string;
};

function toFormShape(initial: EducationInput): FormShape {
  return {
    degree: initial.degree,
    institution: initial.institution,
    date: initial.date,
    honour: initial.honour ?? "",
    honourColor: initial.honourColor ?? "",
    focusCsv: initial.focus.join(", "),
  };
}

function toInput(values: FormShape, order: number): EducationInput {
  const honour = values.honour.trim();
  return {
    degree: values.degree.trim(),
    institution: values.institution.trim(),
    date: values.date.trim(),
    honour: honour || null,
    honourColor: values.honourColor === "" ? null : values.honourColor,
    focus: values.focusCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order,
  };
}

export function EducationForm({ mode, initial }: { mode: Mode; initial: EducationInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = EducationSchema.safeParse(toInput(values, initial.order));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        const key = head === "focus" ? "focusCsv" : head;
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
          ? await createEducation(input)
          : await updateEducation(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Education created" : "Education saved");
        router.push("/admin/education");
        router.refresh();
      } else {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.errors)) {
          mapped[k === "focus" ? "focusCsv" : k] = v;
        }
        setServerFieldErrors(mapped);
        toast.error(res.message ?? "Couldn't save");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{serverFieldErrors.degree}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.institution}</FormMessage>
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
                  <Input {...field} placeholder="October 2023" />
                </FormControl>
                <FormMessage>{serverFieldErrors.date}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="honour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Honour (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Distinction" />
                </FormControl>
                <FormMessage>{serverFieldErrors.honour}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="honourColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Honour color</FormLabel>
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
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{serverFieldErrors.honourColor}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="focusCsv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus areas</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ML, NLP, Stats" />
              </FormControl>
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
              <FormMessage>{serverFieldErrors.focusCsv}</FormMessage>
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
            onClick={() => router.push("/admin/education")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
