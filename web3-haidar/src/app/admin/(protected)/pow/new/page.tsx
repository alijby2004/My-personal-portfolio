import { PowForm } from "@/components/admin/pow-form";
import { createPowEntry } from "../actions";

export default function NewPowEntryPage() {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Add New POW Entry</h1>
      <p className="text-muted mb-6">
        This will appear on your public POW page immediately unless marked
        hidden.
      </p>
      <PowForm action={createPowEntry} submitLabel="Create Entry" />
    </div>
  );
}
