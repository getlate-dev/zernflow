"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type DelayUnit = "seconds" | "minutes" | "hours" | "days";
type DelayMode = "duration" | "until";

interface DelayPanelData {
  duration?: number;
  unit?: DelayUnit;
  waitUntil?: string;
  [key: string]: unknown;
}

interface DelayPanelProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const unitOptions: Array<{ value: DelayUnit; label: string }> = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
];

const presets: Array<{ label: string; duration: number; unit: DelayUnit }> = [
  { label: "30 sec", duration: 30, unit: "seconds" },
  { label: "5 min", duration: 5, unit: "minutes" },
  { label: "1 hour", duration: 1, unit: "hours" },
  { label: "1 day", duration: 1, unit: "days" },
  { label: "3 days", duration: 3, unit: "days" },
  { label: "7 days", duration: 7, unit: "days" },
];

export function DelayPanel({ data: rawData, onChange }: DelayPanelProps) {
  const data = rawData as DelayPanelData;
  const duration = data.duration || 0;
  const unit = data.unit || "minutes";
  const [mode, setMode] = useState<DelayMode>(data.waitUntil ? "until" : "duration");

  const handleModeChange = useCallback(
    (newMode: DelayMode) => {
      setMode(newMode);
      if (newMode === "duration") {
        onChange({ duration: data.duration || 5, unit: data.unit || "minutes", waitUntil: undefined });
      } else {
        onChange({ ...data, waitUntil: data.waitUntil || "" });
      }
    },
    [data, onChange]
  );

  const applyPreset = useCallback(
    (preset: { duration: number; unit: DelayUnit }) => {
      setMode("duration");
      onChange({ duration: preset.duration, unit: preset.unit, waitUntil: undefined });
    },
    [onChange]
  );

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Delay Type
        </label>
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => handleModeChange("duration")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "duration"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Wait for duration
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("until")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "until"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Wait until
          </button>
        </div>
      </div>

      {mode === "duration" ? (
        <>
          {/* Duration Input */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) =>
                  onChange({ ...data, duration: Math.max(0, parseInt(e.target.value) || 0), waitUntil: undefined })
                }
                className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400"
              />
              <select
                value={unit}
                onChange={(e) =>
                  onChange({ ...data, unit: e.target.value as DelayUnit, waitUntil: undefined })
                }
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400"
              >
                {unitOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Quick presets
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => {
                const isActive = duration === preset.duration && unit === preset.unit;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-purple-500 text-white dark:bg-purple-600"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-purple-500 dark:hover:text-purple-400"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Wait Until */
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Wait until date/time
          </label>
          <input
            type="datetime-local"
            value={data.waitUntil || ""}
            onChange={(e) => onChange({ ...data, waitUntil: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400"
          />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            The flow will pause until this specific date and time.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview</p>
        <p className="mt-1 text-sm text-gray-900 dark:text-white">
          {mode === "duration"
            ? duration > 0
              ? `Wait ${duration} ${unit} before continuing`
              : "No delay configured"
            : data.waitUntil
              ? `Wait until ${new Date(data.waitUntil).toLocaleString()}`
              : "No date selected"}
        </p>
      </div>
    </div>
  );
}
