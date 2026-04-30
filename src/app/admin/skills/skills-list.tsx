"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { deleteSkill, reorderSkills } from "./actions";

type Skill = {
  id: string;
  icon: string;
  title: string;
  color: string;
  tags: string[];
};

const colorVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  cyan: "secondary",
  purple: "outline",
  green: "default",
};

export function SkillsList({ items }: { items: Skill[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No skills yet —{" "}
        <Link href="/admin/skills/new" className="underline text-foreground">
          add the first one
        </Link>
        .
      </div>
    );
  }

  return (
    <SortableList
      items={items}
      onReorder={async (orderedIds) => {
        await reorderSkills(orderedIds);
        router.refresh();
      }}
      renderItem={(skill, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <span className="text-xl w-7 text-center">{skill.icon}</span>
          <span className="font-medium flex-1 truncate">{skill.title}</span>
          <Badge variant={colorVariant[skill.color] ?? "secondary"}>{skill.color}</Badge>
          <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">
            {skill.tags.length} tag{skill.tags.length === 1 ? "" : "s"}
          </span>
          <RowActions
            editHref={`/admin/skills/${skill.id}`}
            onDelete={async () => {
              const res = await deleteSkill(skill.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={skill.title}
          />
        </div>
      )}
    />
  );
}
