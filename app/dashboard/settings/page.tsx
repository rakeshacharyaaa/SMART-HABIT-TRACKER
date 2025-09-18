import { SettingsHeader } from "@/components/settings-header"
import { ProfileSettings } from "@/components/profile-settings"
import { NotificationSettings } from "@/components/notification-settings"
// import { AppearanceSettings } from "@/components/appearance-settings"
import { PrivacySettings } from "@/components/privacy-settings"

export default function SettingsPage() {
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="max-w-4xl w-full mx-auto space-y-6 sm:space-y-8">
        <SettingsHeader />
        <div className="space-y-6 sm:space-y-8">
          <ProfileSettings />
          <NotificationSettings />
          {/* <AppearanceSettings /> */}
          <PrivacySettings />
        </div>
      </div>
    </div>
  )
}
