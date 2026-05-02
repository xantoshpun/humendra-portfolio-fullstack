"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { deleteEducation, reorderEducation } from "./actions";

type Education = {
  id: string;
  degree: string;
  institution: string;
  date: string;
  honour: string | null;
};

export function EducationList({ items }: { items: Education[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No education entries —{" "}
        <Link href="/admin/education/new" className="underline text-foreground">
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
        await reorderEducation(orderedIds);
        router.refresh();
      }}
      renderItem={(row, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{row.degree}</div>
            <div className="text-xs text-muted-foreground truncate">
              {row.institution} — {row.date}
            </div>
          </div>
          {row.honour && <Badge variant="outline">{row.honour}</Badge>}
          <RowActions
            editHref={`/admin/education/${row.id}`}
            onDelete={async () => {
              const res = await deleteEducation(row.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={row.degree}
          />
        </div>
      )}
    />
  );
}
