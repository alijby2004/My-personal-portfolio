import { getSettings } from "@/lib/settings";
import { SettingsForms } from "@/components/admin/settings-forms";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Settings</h1>
      <p className="text-muted mb-6">
        Manage the contact links shown across your site, and your admin
        credentials.
      </p>

      <SettingsForms settings={settings} />
    </div>
  );
}
