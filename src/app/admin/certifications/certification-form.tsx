"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CertificationSchema, type CertificationInput } from "@/lib/schemas";
import { createCertification, updateCertification } from "./actions";
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

type Mode = { kind: "create" } | { kind: "edit"; id: string };

type FormShape = {
  img: string;
  name: string;
  issuer: string;
  date: string;
};

function toFormShape(initial: CertificationInput): FormShape {
  return {
    img: initial.img ?? "",
    name: initial.name,
    issuer: initial.issuer,
    date: initial.date,
  };
}

function toInput(values: FormShape, order: number): CertificationInput {
  const img = values.img.trim();
  return {
    img: img || null,
    name: values.name.trim(),
    issuer: values.issuer.trim(),
    date: values.date.trim(),
    order,
  };
}

export function CertificationForm({ mode, initial }: { mode: Mode; initial: CertificationInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = CertificationSchema.safeParse(toInput(values, initial.order));
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
          ? await createCertification(input)
          : await updateCertification(mode.id, input);
      if (res.ok) {
        toast.success(mode.kind === "create" ? "Certification created" : "Certification saved");
        router.push("/admin/certifications");
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{serverFieldErrors.name}</FormMessage>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuer</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.issuer}</FormMessage>
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
                  <Input {...field} placeholder="March 2024" />
                </FormControl>
                <FormMessage>{serverFieldErrors.date}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon filename (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="aws.svg" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Filename of an icon in <code>/public/icons/</code>.
              </p>
              <FormMessage>{serverFieldErrors.img}</FormMessage>
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
            onClick={() => router.push("/admin/certifications")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
