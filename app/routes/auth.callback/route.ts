import { redirect, type LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient } from "~/core/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/library";

  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirect(next, { headers });
    }
  }

  // return the user to an error page with instructions
  return redirect("/login?error=oauth_failed");
}
