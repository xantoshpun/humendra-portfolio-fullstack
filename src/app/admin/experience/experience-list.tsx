"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { deleteExperience, reorderExperience } from "./actions";

type Experience = {
  id: string;
  role: string;
  company: string;
  date: string;
  badgeText: string | null;
};

export function ExperienceList({ items }: { items: Experience[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No experience entries —{" "}
        <Link href="/admin/experience/new" className="underline text-foreground">
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
        await reorderExperience(orderedIds);
        router.refresh();
      }}
      renderItem={(row, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{row.role}</div>
            <div className="text-xs text-muted-foreground truncate">
              {row.company} — {row.date}
            </div>
          </div>
          {row.badgeText && <Badge variant="outline">{row.badgeText}</Badge>}
          <RowActions
            editHref={`/admin/experience/${row.id}`}
            onDelete={async () => {
              const res = await deleteExperience(row.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={row.role}
          />
        </div>
      )}
    />
  );
}
