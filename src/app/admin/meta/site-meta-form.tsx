"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SiteMetaSchema, type SiteMetaInput } from "@/lib/schemas";
import { updateSiteMeta } from "./actions";
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

const SOCIAL_KEYS = ["linkedin", "github", "kaggle", "resume"] as const;

type Initial = SiteMetaInput & { id: string };

type FormShape = {
  name: string;
  initials: string;
  location: string;
  email: string;
  heroBio: string;
  titlesCsv: string;
  linkedin: string;
  github: string;
  kaggle: string;
  resume: string;
};

function toFormShape(initial: Initial): FormShape {
  const s = (initial.socials ?? {}) as Record<string, string>;
  return {
    name: initial.name,
    initials: initial.initials,
    location: initial.location,
    email: initial.email,
    heroBio: initial.heroBio,
    titlesCsv: initial.titles.join(", "),
    linkedin: s.linkedin ?? "",
    github: s.github ?? "",
    kaggle: s.kaggle ?? "",
    resume: s.resume ?? "",
  };
}

function toInput(values: FormShape): SiteMetaInput {
  const socials: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const v = values[key].trim();
    if (v) socials[key] = v;
  }
  return {
    name: values.name.trim(),
    initials: values.initials.trim(),
    location: values.location.trim(),
    email: values.email.trim(),
    heroBio: values.heroBio,
    titles: values.titlesCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    socials,
  };
}

export function SiteMetaForm({ initial }: { initial: Initial }) {
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Record<string, string>
  >({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = SiteMetaSchema.safeParse(toInput(values));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = issue.path[0];
        const key = mapZodPathToFormKey(String(head ?? ""));
        if (!errors[key]) errors[key] = { type: "validation", message: issue.message };
      }
      return { values: {}, errors };
    },
  });

  function onSubmit(values: FormShape) {
    setServerFieldErrors({});
    startTransition(async () => {
      const res = await updateSiteMeta(initial.id, toInput(values));
      if (res.ok) {
        toast.success("Site meta saved");
      } else {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.errors)) {
          mapped[mapZodPathToFormKey(k)] = v;
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
          <FormField
            control={form.control}
            name="initials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initials</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={4} />
                </FormControl>
                <FormMessage>{serverFieldErrors.initials}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.location}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage>{serverFieldErrors.email}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="heroBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage>{serverFieldErrors.heroBio}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="titlesCsv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typewriter titles</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Data Analyst, ML Engineer, …" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Comma-separated. Cycled in the hero typewriter.
              </p>
              <FormMessage>{serverFieldErrors.titles}</FormMessage>
            </FormItem>
          )}
        />

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium">Socials</legend>
          {SOCIAL_KEYS.map((k) => (
            <FormField
              key={k}
              control={form.control}
              name={k}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{k}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`https://… (leave blank to omit)`} />
                  </FormControl>
                  <FormMessage>{serverFieldErrors[`socials.${k}`]}</FormMessage>
                </FormItem>
              )}
            />
          ))}
        </fieldset>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  );
}

function mapZodPathToFormKey(zodHead: string): string {
  if (zodHead === "titles") return "titlesCsv";
  if (zodHead.startsWith("socials")) {
    const dot = zodHead.indexOf(".");
    if (dot >= 0) return zodHead.slice(dot + 1);
    return "socials";
  }
  return zodHead;
}
