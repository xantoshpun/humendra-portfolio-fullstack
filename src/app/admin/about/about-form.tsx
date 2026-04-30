"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AboutSchema, type AboutInput } from "@/lib/schemas";
import { updateAbout } from "./actions";
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

type Initial = AboutInput & { id: string };

type FormShape = {
  paragraphs: { value: string }[];
  cards: { icon: string; title: string; sub: string }[];
  terminalPassion: string;
};

function toFormShape(initial: Initial): FormShape {
  return {
    paragraphs: initial.paragraphs.map((value) => ({ value })),
    cards: initial.cards.length
      ? initial.cards
      : [{ icon: "", title: "", sub: "" }],
    terminalPassion: initial.terminalPassion ?? "",
  };
}

function toInput(values: FormShape): AboutInput {
  return {
    paragraphs: values.paragraphs.map((p) => p.value).filter((p) => p.length > 0),
    cards: values.cards
      .map((c) => ({ icon: c.icon.trim(), title: c.title.trim(), sub: c.sub.trim() }))
      .filter((c) => c.title || c.sub || c.icon),
    terminalPassion: values.terminalPassion.trim() || null,
  };
}

export function AboutForm({ initial }: { initial: Initial }) {
  const [isPending, startTransition] = useTransition();
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Record<string, string>
  >({});

  const form = useForm<FormShape>({
    defaultValues: toFormShape(initial),
    resolver: async (values) => {
      const parsed = AboutSchema.safeParse(toInput(values));
      if (parsed.success) return { values, errors: {} };
      const errors: Record<string, { type: string; message: string }> = {};
      for (const issue of parsed.error.issues) {
        const head = String(issue.path[0] ?? "");
        if (!errors[head]) errors[head] = { type: "validation", message: issue.message };
      }
      return { values: {}, errors };
    },
  });

  const paragraphs = useFieldArray({ control: form.control, name: "paragraphs" });
  const cards = useFieldArray({ control: form.control, name: "cards" });

  function onSubmit(values: FormShape) {
    setServerFieldErrors({});
    startTransition(async () => {
      const res = await updateAbout(initial.id, toInput(values));
      if (res.ok) {
        toast.success("About saved");
      } else {
        setServerFieldErrors(res.errors);
        toast.error(res.message ?? "Couldn't save — see fields above");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-medium">Paragraphs</legend>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => paragraphs.append({ value: "" })}
            >
              <Plus className="size-4" />
              Add paragraph
            </Button>
          </div>

          {paragraphs.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`paragraphs.${idx}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder={`Paragraph ${idx + 1}`} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => paragraphs.remove(idx)}
                aria-label={`Remove paragraph ${idx + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {serverFieldErrors.paragraphs && (
            <p className="text-destructive text-sm">{serverFieldErrors.paragraphs}</p>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-medium">Info cards</legend>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => cards.append({ icon: "", title: "", sub: "" })}
            >
              <Plus className="size-4" />
              Add card
            </Button>
          </div>

          {cards.fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-[1fr_2fr_2fr_auto] gap-2 items-end">
              <FormField
                control={form.control}
                name={`cards.${idx}.icon`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="emoji or name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`cards.${idx}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`cards.${idx}.sub`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Sub</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => cards.remove(idx)}
                aria-label={`Remove card ${idx + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {serverFieldErrors.cards && (
            <p className="text-destructive text-sm">{serverFieldErrors.cards}</p>
          )}
        </fieldset>

        <FormField
          control={form.control}
          name="terminalPassion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terminal passion (snippet)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} className="font-mono text-sm" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Shown in the about-section terminal. Leave blank to hide.
              </p>
              <FormMessage>{serverFieldErrors.terminalPassion}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  );
}
