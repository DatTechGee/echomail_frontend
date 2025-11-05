import { CreateCampaigns } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/create-campaigns")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateCampaigns />;
}
