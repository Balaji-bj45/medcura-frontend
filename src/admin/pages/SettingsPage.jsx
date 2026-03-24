export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="heading-font text-2xl font-semibold text-slate-900">Settings</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <p>Admin settings can be expanded here for:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Role permissions (super admin, operations, support)</li>
          <li>Inventory thresholds and alerts</li>
          <li>Report export configuration</li>
          <li>Email automation templates for order and enquiry flows</li>
        </ul>
      </div>
    </section>
  )
}
