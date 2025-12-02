import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Session, User } from "@supabase/supabase-js";

export const createSupabaseServerClient = (request: Request) => {
  const headers = new Headers();

  //process.env.SUPABASE_ANON_KEY!,
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "").filter((c): c is { name: string; value: string } => typeof c.value === "string");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append("Set-Cookie", serializeCookieHeader(name, value, options))
          );
        },
      },
    }
  );

  return { supabase, headers };
};

export async function getAuthenticatedUser(request: Request): Promise<User | null> {
  const { supabase } = createSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}
