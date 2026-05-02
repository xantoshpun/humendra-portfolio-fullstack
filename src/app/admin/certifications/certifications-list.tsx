"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { deleteCertification, reorderCertifications } from "./actions";

type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export function CertificationsList({ items }: { items: Certification[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No certifications —{" "}
        <Link href="/admin/certifications/new" className="underline text-foreground">
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
        await reorderCertifications(orderedIds);
        router.refresh();
      }}
      renderItem={(row, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{row.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {row.issuer} — {row.date}
            </div>
          </div>
          <RowActions
            editHref={`/admin/certifications/${row.id}`}
            onDelete={async () => {
              const res = await deleteCertification(row.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={row.name}
          />
        </div>
      )}
    />
  );
}
