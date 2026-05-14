import StoreSectionContent from "@/components/StoreSectionContent";
import { getAllLocations } from "@/sanity/queries";
import type { Location } from "@/sanity/types";

export default async function StoresSection() {
  let locations: Location[] = [];
  try {
    locations = await getAllLocations();
    locations = locations.slice(0, 3);
  } catch {
    // Sanity not configured or unavailable
  }

  if (locations.length === 0) return null;

  return <StoreSectionContent locations={locations} />;
}
