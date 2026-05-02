"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StatSchema, type StatInput } from "@/lib/schemas";
import { createStat, updateStat } from "./actions";
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
  value: string;
  prefix: string;
  suffix: string;
  display: string;
  label: string;
  accent: "cyan" | "purple" | "green" | "amber";
};

function toFormShape(initial: StatInput): FormShape {
  return {
    value: String(initial.value),
    prefix: initial.prefix ?? "",
    suffix: initial.suffix ?? "",
    display: initial.display,
    label: initial.label,
    accent: initial.accent,
  };
}

function toInput(values: FormShape, order: number): StatInput {
  return {
    value: parseFloat(values.value) || 0,
    prefix: values.prefix.trim() || null,
    suffix: values.suffix.trim() || null,
    display: values.display.trim(),
    label: values.label.trim(),
    accent: values.accent,
    order,
  };
}

export function StatForm({ mode, initial }: { mode: Mode; initial: StatInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = StatSchema.safeParse(toInput(values, initial.order));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        if (!errors[head]) errors[head] = { type: "validation", message: issue.message };
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
          ? await createStat(input)
          : await updateStat(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Stat created" : "Stat saved");
        router.push("/admin/stats");
        router.refresh();
      } else {
        setServerFieldErrors(
          Object.fromEntries(Object.entries(res.errors).map(([k, v]) => [k, v]))
        );
        toast.error(res.message ?? "Couldn't save — see fields above");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Papers published" />
                </FormControl>
                <FormMessage>{serverFieldErrors.label}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent color</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{serverFieldErrors.accent}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="↑" />
                </FormControl>
                <FormMessage>{serverFieldErrors.prefix}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="any" />
                </FormControl>
                <FormMessage>{serverFieldErrors.value}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="%" />
                </FormControl>
                <FormMessage>{serverFieldErrors.suffix}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="display"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display string</FormLabel>
              <FormControl>
                <Input {...field} placeholder="↑60%" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Pre-rendered string shown on the card (e.g. &ldquo;↑60%&rdquo;).
              </p>
              <FormMessage>{serverFieldErrors.display}</FormMessage>
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
            onClick={() => router.push("/admin/stats")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
