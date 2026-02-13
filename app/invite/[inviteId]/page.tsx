import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AcceptInviteView } from "./accept-invite-view";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;
  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  // Fetch the invite using service client (public page, user may not be logged in)
  const { data: invite, error } = await serviceClient
    .from("workspace_invites")
    .select("*")
    .eq("id", inviteId)
    .single();

  if (error || !invite) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-bold">Invite not found</h1>
          <p className="text-sm text-muted-foreground">
            This invite link may be invalid or has been revoked.
          </p>
          <a
            href="/login"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invite.expires_at) < new Date();
  const isAlreadyAccepted = invite.status !== "pending";

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-bold">Invite expired</h1>
          <p className="text-sm text-muted-foreground">
            This invite has expired. Please ask the workspace owner to send a
            new one.
          </p>
          <a
            href="/login"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (isAlreadyAccepted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-bold">Invite already used</h1>
          <p className="text-sm text-muted-foreground">
            This invite has already been accepted.
          </p>
          <a
            href="/dashboard"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Get workspace name
  const { data: workspace } = await serviceClient
    .from("workspaces")
    .select("name")
    .eq("id", invite.workspace_id)
    .single();

  // Get inviter name
  const {
    data: { user: inviter },
  } = await serviceClient.auth.admin.getUserById(invite.invited_by);

  const inviterName =
    inviter?.user_metadata?.full_name ??
    inviter?.user_metadata?.name ??
    inviter?.email ??
    "Someone";

  // Check if current user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AcceptInviteView
      inviteId={invite.id}
      workspaceName={workspace?.name ?? "a workspace"}
      inviterName={inviterName}
      role={invite.role}
      email={invite.email}
      isLoggedIn={!!user}
      currentUserEmail={user?.email ?? null}
    />
  );
}
