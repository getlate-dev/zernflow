import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/ref-links/[refLinkId]/qr
 * Generate QR code data for a ref link.
 *
 * Returns:
 *   - publicUrl: The public-facing URL for the ref link (e.g. https://app.zernflow.com/r/abc12345)
 *   - qrImageUrl: A URL to a QR code SVG image via the qrserver.com API
 *
 * The frontend can use qrImageUrl directly in an <img> tag to display the QR code.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ refLinkId: string }> }
) {
  const { refLinkId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: link } = await supabase
    .from("ref_links")
    .select("slug")
    .eq("id", refLinkId)
    .single();

  if (!link)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://app.zernflow.com";
  const publicUrl = `${appUrl}/r/${link.slug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=svg&data=${encodeURIComponent(publicUrl)}`;

  return NextResponse.json({ publicUrl, qrImageUrl });
}
