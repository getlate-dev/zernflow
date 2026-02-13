"use client";

const PROVIDER_MODELS: Record<string, Array<{ id: string; label: string }>> = {
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o Mini (faster, cheaper)" },
    { id: "gpt-4o", label: "GPT-4o (more capable)" },
    { id: "o3-mini", label: "o3-mini (reasoning)" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5 (balanced)" },
    { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (fast, cheap)" },
  ],
  google: [
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash (fast, cheap)" },
    { id: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro (more capable)" },
  ],
};

interface AiResponsePanelData {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  contextMessages?: number;
  [key: string]: unknown;
}

interface AiResponsePanelProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  aiProvider?: string;
}

export function AiResponsePanel({ data: rawData, onChange, aiProvider = "openai" }: AiResponsePanelProps) {
  const data = rawData as AiResponsePanelData;
  const models = PROVIDER_MODELS[aiProvider] || PROVIDER_MODELS.openai;
  const defaultModel = models[0]?.id || "gpt-4o-mini";

  // If current model doesn't belong to selected provider, show it as-is
  const currentModel = data.model || defaultModel;
  const modelInList = models.some((m) => m.id === currentModel);

  return (
    <div className="space-y-4">
      {/* System Prompt */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          System Prompt
        </label>
        <textarea
          value={data.systemPrompt || ""}
          onChange={(e) => onChange({ ...data, systemPrompt: e.target.value })}
          placeholder="You are a helpful customer support agent..."
          rows={8}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Instructions for how the AI should behave and respond.
        </p>
      </div>

      {/* Model */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Model
        </label>
        <select
          value={currentModel}
          onChange={(e) => onChange({ ...data, model: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
          {!modelInList && (
            <option value={currentModel}>{currentModel} (custom)</option>
          )}
        </select>
        <p className="mt-1 text-[11px] text-gray-400">
          Provider configured in workspace settings. You can also type a custom model ID.
        </p>
      </div>

      {/* Temperature */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">Temperature</label>
          <span className="text-xs text-gray-500">{data.temperature ?? 0.7}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={data.temperature ?? 0.7}
          onChange={(e) => onChange({ ...data, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[11px] text-gray-400">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Max Tokens
        </label>
        <input
          type="number"
          value={data.maxTokens ?? 500}
          onChange={(e) => onChange({ ...data, maxTokens: parseInt(e.target.value) || 500 })}
          min={1}
          max={4096}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Maximum length of the AI response.
        </p>
      </div>

      {/* Context Messages */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Context Messages
        </label>
        <input
          type="number"
          value={data.contextMessages ?? 10}
          onChange={(e) => onChange({ ...data, contextMessages: parseInt(e.target.value) || 10 })}
          min={1}
          max={50}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          How many past messages to include as context for the AI.
        </p>
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-medium text-gray-600">How it works</p>
        <ul className="mt-1.5 space-y-1 text-[11px] text-gray-500">
          <li>Fetches recent conversation messages for context</li>
          <li>Generates a reply using the selected AI model</li>
          <li>Sends the reply as a message in the conversation</li>
          <li>AI provider and API key are set in workspace settings</li>
        </ul>
      </div>
    </div>
  );
}
