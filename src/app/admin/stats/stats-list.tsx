"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { deleteStat, reorderStats } from "./actions";

type Stat = {
  id: string;
  display: string;
  label: string;
  accent: string;
};

export function StatsList({ items }: { items: Stat[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No stats —{" "}
        <Link href="/admin/stats/new" className="underline text-foreground">
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
        await reorderStats(orderedIds);
        router.refresh();
      }}
      renderItem={(row, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{row.display}</div>
            <div className="text-xs text-muted-foreground truncate">
              {row.label} · {row.accent}
            </div>
          </div>
          <RowActions
            editHref={`/admin/stats/${row.id}`}
            onDelete={async () => {
              const res = await deleteStat(row.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={row.label}
          />
        </div>
      )}
    />
  );
}
