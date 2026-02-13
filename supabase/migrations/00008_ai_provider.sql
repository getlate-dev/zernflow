-- Rename openai_api_key to ai_api_key and add ai_provider column
ALTER TABLE workspaces RENAME COLUMN openai_api_key TO ai_api_key;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS ai_provider TEXT NOT NULL DEFAULT 'openai';
