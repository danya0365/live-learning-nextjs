import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { NextResponse } from "next/server";

/**
 * verifyAdmin
 * 
 * Verifies that the current user is authenticated and has the 'admin' role.
 * Returns the profile if authorized, or a NextResponse (401/403) if not.
 */
export async function verifyAdmin() {
  try {
    const profilePresenter = await createServerProfilePresenter();
    const profile = await profilePresenter.getProfile();

    if (!profile) {
      return { 
        authorized: false, 
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) 
      };
    }

    if (profile.role !== "admin") {
      return { 
        authorized: false, 
        response: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }) 
      };
    }

    return { authorized: true, profile };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { 
      authorized: false, 
      response: NextResponse.json({ error: "Internal Server Error" }, { status: 500 }) 
    };
  }
}
