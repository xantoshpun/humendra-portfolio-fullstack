import { getSiteMeta } from "@/lib/content";
import { NavClient } from "./NavClient";

/**
 * Server component — fetches site meta from the DB and hands the small set of
 * fields the nav needs to the client component that owns the interactive bits
 * (scroll spy, mobile menu, reveal-on-load).
 */
export async function Nav() {
  const meta = await getSiteMeta();
  if (!meta) return null;
  const socials = meta.socials as Record<string, string>;
  return <NavClient initials={meta.initials} resumeUrl={socials.resume ?? "#"} />;
}
