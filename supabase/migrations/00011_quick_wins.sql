-- ============================================================================
-- Quick Wins Migration: 7 features for ManyChat parity
-- 1. Ref Links + QR Codes (growth tools)
-- 2. Saved Replies (canned responses for inbox)
-- 3. Bot Fields (workspace-level global variables)
-- 4. Workspace settings (auto-assignment mode)
-- ============================================================================

-- ── 1. Ref Links (QR Code + Ref URL growth tool) ────────────────────────────

CREATE TABLE IF NOT EXISTS ref_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  clicks INT NOT NULL DEFAULT 0,
  conversions INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Slug must be unique globally (used in public URL)
CREATE UNIQUE INDEX idx_ref_links_slug ON ref_links(slug);
CREATE INDEX idx_ref_links_workspace ON ref_links(workspace_id);

ALTER TABLE ref_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ref_links in their workspaces"
  ON ref_links FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage ref_links in their workspaces"
  ON ref_links FOR ALL
  USING (is_workspace_member(workspace_id));

CREATE TRIGGER set_ref_links_updated_at BEFORE UPDATE ON ref_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 2. Saved Replies (canned responses) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  shortcut TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_saved_replies_workspace ON saved_replies(workspace_id);

ALTER TABLE saved_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view saved_replies in their workspaces"
  ON saved_replies FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage saved_replies in their workspaces"
  ON saved_replies FOR ALL
  USING (is_workspace_member(workspace_id));

CREATE TRIGGER set_saved_replies_updated_at BEFORE UPDATE ON saved_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 3. Bot Fields (workspace-level global variables) ────────────────────────

CREATE TABLE IF NOT EXISTS bot_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_bot_fields_workspace_slug ON bot_fields(workspace_id, slug);
CREATE INDEX idx_bot_fields_workspace ON bot_fields(workspace_id);

ALTER TABLE bot_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bot_fields in their workspaces"
  ON bot_fields FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage bot_fields in their workspaces"
  ON bot_fields FOR ALL
  USING (is_workspace_member(workspace_id));

CREATE TRIGGER set_bot_fields_updated_at BEFORE UPDATE ON bot_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 4. Workspace settings (auto-assignment + AI intent) ─────────────────────

ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS auto_assign_mode TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS last_assigned_member_index INT NOT NULL DEFAULT 0;

-- ── 5. RPC for atomic ref link click tracking ───────────────────────────────

CREATE OR REPLACE FUNCTION increment_ref_link_clicks(link_id UUID)
RETURNS void AS $$
  UPDATE ref_links SET clicks = clicks + 1 WHERE id = link_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ref_link_conversions(link_id UUID)
RETURNS void AS $$
  UPDATE ref_links SET conversions = conversions + 1 WHERE id = link_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ── 7. API Keys (external developer authentication) ─────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  -- Store only the hash. The full key is shown once on creation.
  key_hash TEXT NOT NULL UNIQUE,
  -- Prefix for identification (e.g. "zf_abc1") without revealing the full key
  key_prefix TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view api_keys in their workspaces"
  ON api_keys FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage api_keys in their workspaces"
  ON api_keys FOR ALL
  USING (is_workspace_member(workspace_id));

-- ── 6. Conversation Notes (internal notes for agents) ───────────────────────

CREATE TABLE IF NOT EXISTS conversation_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversation_notes_conversation ON conversation_notes(conversation_id, created_at);
CREATE INDEX idx_conversation_notes_workspace ON conversation_notes(workspace_id);

ALTER TABLE conversation_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes in their workspaces"
  ON conversation_notes FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage notes in their workspaces"
  ON conversation_notes FOR ALL
  USING (is_workspace_member(workspace_id));

CREATE TRIGGER set_conversation_notes_updated_at BEFORE UPDATE ON conversation_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 8. Outbound Webhooks (event notifications to external URLs) ─────────────

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_webhook_endpoints_workspace ON webhook_endpoints(workspace_id);

ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view webhook_endpoints in their workspaces"
  ON webhook_endpoints FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can manage webhook_endpoints in their workspaces"
  ON webhook_endpoints FOR ALL
  USING (is_workspace_member(workspace_id));

CREATE TRIGGER set_webhook_endpoints_updated_at BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
