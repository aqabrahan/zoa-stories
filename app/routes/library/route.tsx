import { useLoaderData, Link } from "react-router";
import { loader } from "./loader.server";

export { loader };

export default function Library() {
  const { stories, user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span>📚</span> Talepia
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden md:block">{user.email}</span>
            <Link
              to="/stories/new"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
            >
              + Nuevo Cuento
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Cuentos</h1>

        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes cuentos</h3>
            <p className="text-slate-500 mb-6">¡La magia está esperando! Crea tu primer cuento ahora.</p>
            <Link
              to="/stories/new"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-200"
            >
              Crear Cuento Mágico
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link key={story.id} to={`/stories/${story.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {story.coverImageUrl ? (
                    <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                  )}
                  <div className="absolute top-2 right-2">
                    {story.status === 'completed' ? (
                      <span className="bg-green-500/90 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md">
                        Completado
                      </span>
                    ) : (
                      <span className="bg-amber-500/90 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md">
                        {story.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{story.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">Para {story.childName} • {story.childAge} años</p>
                  <div className="flex flex-wrap gap-2">
                    {story.interests.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
