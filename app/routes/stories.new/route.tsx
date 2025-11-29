import { Form, useActionData, useNavigation } from "react-router";
import { action } from "./server";

export { action };

export default function NewStoryRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          ✨ El Taller Mágico ✨
        </h1>

        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-slate-700 mb-1">
              ¿Cómo se llama el/la protagonista?
            </label>
            <input
              type="text"
              name="childName"
              id="childName"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Ej: Sofía"
            />
          </div>

          <div>
            <label htmlFor="childAge" className="block text-sm font-medium text-slate-700 mb-1">
              Edad
            </label>
            <input
              type="number"
              name="childAge"
              id="childAge"
              required
              min="1"
              max="12"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Ej: 5"
            />
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-slate-700 mb-1">
              Intereses (separados por coma)
            </label>
            <input
              type="text"
              name="interests"
              id="interests"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Ej: Dinosaurios, Espacio, Pizza"
            />
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-1">
              Estilo Visual
            </label>
            <select
              name="theme"
              id="theme"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              <option value="pixar">Estilo 3D (Pixar)</option>
              <option value="watercolor">Acuarela</option>
              <option value="comic">Cómic</option>
            </select>
          </div>

          {actionData?.error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {actionData.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando magia...
              </>
            ) : (
              "✨ Crear Cuento"
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}
