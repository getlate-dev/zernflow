import { getWorkspace } from "@/lib/workspace";
import { SettingsView } from "./settings-view";

export default async function SettingsPage() {
  const { workspace } = await getWorkspace();

  return (
    <SettingsView
      workspace={{
        id: workspace.id,
        name: workspace.name,
        hasApiKey: !!workspace.late_api_key_encrypted,
        hasOpenaiKey: !!workspace.openai_api_key,
        globalKeywords: (workspace.global_keywords as string[]) ?? [],
      }}
    />
  );
}
