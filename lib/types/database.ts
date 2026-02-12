export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Platform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "telegram"
  | "bluesky"
  | "reddit";

export type FlowStatus = "draft" | "published" | "archived";
export type ConversationStatus = "open" | "closed" | "snoozed";
export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "pending" | "sent" | "delivered" | "failed";
export type BroadcastStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "completed"
  | "cancelled";
export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type TriggerType =
  | "keyword"
  | "postback"
  | "quick_reply"
  | "welcome"
  | "default"
  | "comment_keyword";
export type FlowSessionStatus =
  | "active"
  | "completed"
  | "expired"
  | "cancelled";
export type NodeType =
  | "trigger"
  | "sendMessage"
  | "condition"
  | "delay"
  | "addTag"
  | "removeTag"
  | "setCustomField"
  | "httpRequest"
  | "goToFlow"
  | "subscribe"
  | "unsubscribe"
  | "humanTakeover"
  | "commentReply"
  | "privateReply"
  | "abSplit"
  | "smartDelay";

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          late_api_key_encrypted: string | null;
          global_keywords: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          late_api_key_encrypted?: string | null;
          global_keywords?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          late_api_key_encrypted?: string | null;
          global_keywords?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      channels: {
        Row: {
          id: string;
          workspace_id: string;
          platform: Platform;
          late_account_id: string;
          username: string | null;
          display_name: string | null;
          profile_picture: string | null;
          webhook_id: string | null;
          webhook_secret: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          platform: Platform;
          late_account_id: string;
          username?: string | null;
          display_name?: string | null;
          profile_picture?: string | null;
          webhook_id?: string | null;
          webhook_secret?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          platform?: Platform;
          late_account_id?: string;
          username?: string | null;
          display_name?: string | null;
          profile_picture?: string | null;
          webhook_id?: string | null;
          webhook_secret?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "channels_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          id: string;
          workspace_id: string;
          display_name: string | null;
          email: string | null;
          avatar_url: string | null;
          is_subscribed: boolean;
          last_interaction_at: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_subscribed?: boolean;
          last_interaction_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_subscribed?: boolean;
          last_interaction_at?: string | null;
          metadata?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_channels: {
        Row: {
          id: string;
          contact_id: string;
          channel_id: string;
          platform_sender_id: string;
          platform_username: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          channel_id: string;
          platform_sender_id: string;
          platform_username?: string | null;
          created_at?: string;
        };
        Update: {
          platform_username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "contact_channels_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_channels_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_tags: {
        Row: {
          contact_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          contact_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          contact_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      custom_field_definitions: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          slug: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          slug: string;
          type: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "custom_field_definitions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_custom_fields: {
        Row: {
          contact_id: string;
          field_id: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          contact_id: string;
          field_id: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_custom_fields_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_custom_fields_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "custom_field_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      flows: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          status: FlowStatus;
          nodes: Json;
          edges: Json;
          viewport: Json | null;
          version: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          status?: FlowStatus;
          nodes?: Json;
          edges?: Json;
          viewport?: Json | null;
          version?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: FlowStatus;
          nodes?: Json;
          edges?: Json;
          viewport?: Json | null;
          version?: number;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flows_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      triggers: {
        Row: {
          id: string;
          flow_id: string;
          channel_id: string | null;
          type: TriggerType;
          config: Json;
          priority: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          flow_id: string;
          channel_id?: string | null;
          type: TriggerType;
          config?: Json;
          priority?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          channel_id?: string | null;
          type?: TriggerType;
          config?: Json;
          priority?: number;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "triggers_flow_id_fkey";
            columns: ["flow_id"];
            isOneToOne: false;
            referencedRelation: "flows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "triggers_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      flow_sessions: {
        Row: {
          id: string;
          contact_id: string;
          flow_id: string;
          channel_id: string;
          status: FlowSessionStatus;
          current_node_id: string | null;
          variables: Json;
          flow_stack: Json;
          waiting_until: string | null;
          waiting_for_input: boolean;
          human_takeover_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          flow_id: string;
          channel_id: string;
          status?: FlowSessionStatus;
          current_node_id?: string | null;
          variables?: Json;
          flow_stack?: Json;
          waiting_until?: string | null;
          waiting_for_input?: boolean;
          human_takeover_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: FlowSessionStatus;
          current_node_id?: string | null;
          variables?: Json;
          flow_stack?: Json;
          waiting_until?: string | null;
          waiting_for_input?: boolean;
          human_takeover_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flow_sessions_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flow_sessions_flow_id_fkey";
            columns: ["flow_id"];
            isOneToOne: false;
            referencedRelation: "flows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flow_sessions_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          workspace_id: string;
          channel_id: string;
          contact_id: string;
          late_conversation_id: string | null;
          platform: Platform;
          status: ConversationStatus;
          assigned_to: string | null;
          last_message_at: string | null;
          last_message_preview: string | null;
          unread_count: number;
          is_automation_paused: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          channel_id: string;
          contact_id: string;
          late_conversation_id?: string | null;
          platform: Platform;
          status?: ConversationStatus;
          assigned_to?: string | null;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          unread_count?: number;
          is_automation_paused?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          late_conversation_id?: string | null;
          status?: ConversationStatus;
          assigned_to?: string | null;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          unread_count?: number;
          is_automation_paused?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          direction: MessageDirection;
          text: string | null;
          attachments: Json | null;
          quick_reply_payload: string | null;
          postback_payload: string | null;
          callback_data: string | null;
          platform_message_id: string | null;
          sent_by_flow_id: string | null;
          sent_by_node_id: string | null;
          sent_by_user_id: string | null;
          status: MessageStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          direction: MessageDirection;
          text?: string | null;
          attachments?: Json | null;
          quick_reply_payload?: string | null;
          postback_payload?: string | null;
          callback_data?: string | null;
          platform_message_id?: string | null;
          sent_by_flow_id?: string | null;
          sent_by_node_id?: string | null;
          sent_by_user_id?: string | null;
          status?: MessageStatus;
          created_at?: string;
        };
        Update: {
          status?: MessageStatus;
          platform_message_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      broadcasts: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          status: BroadcastStatus;
          message_content: Json;
          segment_filter: Json | null;
          scheduled_for: string | null;
          total_recipients: number;
          sent: number;
          delivered: number;
          failed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          status?: BroadcastStatus;
          message_content: Json;
          segment_filter?: Json | null;
          scheduled_for?: string | null;
          total_recipients?: number;
          sent?: number;
          delivered?: number;
          failed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          status?: BroadcastStatus;
          message_content?: Json;
          segment_filter?: Json | null;
          scheduled_for?: string | null;
          total_recipients?: number;
          sent?: number;
          delivered?: number;
          failed?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "broadcasts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      broadcast_recipients: {
        Row: {
          id: string;
          broadcast_id: string;
          contact_id: string;
          channel_id: string;
          status: string;
          sent_at: string | null;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          broadcast_id: string;
          contact_id: string;
          channel_id: string;
          status?: string;
          sent_at?: string | null;
          error_message?: string | null;
        };
        Update: {
          status?: string;
          sent_at?: string | null;
          error_message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "broadcast_recipients_broadcast_id_fkey";
            columns: ["broadcast_id"];
            isOneToOne: false;
            referencedRelation: "broadcasts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "broadcast_recipients_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "broadcast_recipients_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      scheduled_jobs: {
        Row: {
          id: string;
          type: string;
          payload: Json;
          run_at: string;
          status: JobStatus;
          attempts: number;
          last_error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          payload: Json;
          run_at: string;
          status?: JobStatus;
          attempts?: number;
          last_error?: string | null;
          created_at?: string;
        };
        Update: {
          status?: JobStatus;
          attempts?: number;
          last_error?: string | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          workspace_id: string;
          flow_id: string | null;
          contact_id: string | null;
          event_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          flow_id?: string | null;
          contact_id?: string | null;
          event_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          workspace_id?: string;
          flow_id?: string | null;
          contact_id?: string | null;
          event_type?: string;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_unread: {
        Args: {
          conv_id: string;
          preview: string;
        };
        Returns: undefined;
      };
      increment_broadcast_sent: {
        Args: {
          b_id: string;
        };
        Returns: undefined;
      };
      increment_broadcast_failed: {
        Args: {
          b_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
