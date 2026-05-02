"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/sortable-list";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProject, publishProject, reorderProjects, unpublishProject } from "./actions";

type Project = {
  id: string;
  slug: string;
  title: string;
  publishedAt: Date | null;
  featured: boolean;
};

function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = published ? await unpublishProject(id) : await publishProject(id);
      if (res.ok) {
        toast.success(published ? "Moved to draft" : "Published");
        router.refresh();
      } else {
        toast.error(res.message ?? "Failed");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      disabled={isPending}
      className="text-xs h-7 px-2"
    >
      {published ? "Unpublish" : "Publish"}
    </Button>
  );
}

export function ProjectsList({ items }: { items: Project[] }) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg px-6 py-10 text-center text-sm text-muted-foreground">
        No projects —{" "}
        <Link href="/admin/projects/new" className="underline text-foreground">
          create the first one
        </Link>
        .
      </div>
    );
  }

  return (
    <SortableList
      items={items}
      onReorder={async (orderedIds) => {
        await reorderProjects(orderedIds);
        router.refresh();
      }}
      renderItem={(row, handle) => (
        <div className="flex items-center gap-3 px-3 py-2 border rounded-md bg-card">
          {handle}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{row.title}</div>
            <div className="text-xs text-muted-foreground truncate">/{row.slug}</div>
          </div>
          {row.featured && (
            <Badge variant="outline" className="text-xs">Featured</Badge>
          )}
          <Badge variant={row.publishedAt ? "default" : "secondary"} className="text-xs">
            {row.publishedAt ? "Published" : "Draft"}
          </Badge>
          <PublishToggle id={row.id} published={!!row.publishedAt} />
          <RowActions
            editHref={`/admin/projects/${row.id}`}
            onDelete={async () => {
              const res = await deleteProject(row.id);
              if (res.ok) router.refresh();
              return res;
            }}
            itemLabel={row.title}
          />
        </div>
      )}
    />
  );
}
