"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface EnrollSequencePanelProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

interface SequenceOption {
  id: string;
  name: string;
  status: string;
}

export function EnrollSequencePanel({ data, onChange }: EnrollSequencePanelProps) {
  const [sequences, setSequences] = useState<SequenceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: rows } = await supabase
        .from("sequences")
        .select("id, name, status")
        .order("name", { ascending: true });

      setSequences(rows ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Enroll in Sequence
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          The contact will be enrolled in the selected drip sequence when they
          reach this step.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Sequence
        </label>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading sequences...
          </div>
        ) : sequences.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No sequences found. Create one in the Sequences section first.
          </p>
        ) : (
          <select
            value={(data.sequenceId as string) || ""}
            onChange={(e) => onChange({ ...data, sequenceId: e.target.value })}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="">Select a sequence...</option>
            {sequences.map((seq) => (
              <option key={seq.id} value={seq.id}>
                {seq.name} ({seq.status})
              </option>
            ))}
          </select>
        )}
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Only active sequences will actually enroll contacts at runtime.
        </p>
      </div>
    </div>
  );
}
