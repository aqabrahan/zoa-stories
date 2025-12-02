import { Form, useActionData, useNavigation } from "react-router";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/core/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    return redirect("/library", { headers });
  }

  return null;
}

export default function Login() {
  const [supabase] = useState(() =>
    createBrowserClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!
    )
  );

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">✨</span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido a Talepia</h1>
          <p className="text-slate-500">Inicia sesión para guardar tus cuentos mágicos.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Continuar con Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-400">O usa tu email</span>
            </div>
          </div>

          {/* Placeholder for Email Login - Supabase Magic Link or Password */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900"
                placeholder="tu@email.com"
              />
            </div>
             <button
              disabled
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-200"
            >
              Enviar Link Mágico (Próximamente)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
