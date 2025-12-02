import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { loader } from "./server";

export { loader };

export default function StoryView() {
  const { story: initialStory } = useLoaderData<typeof loader>();
  const [content, setContent] = useState(initialStory.content || "");
  const [status, setStatus] = useState(initialStory.status);
  const [coverImage, setCoverImage] = useState(initialStory.coverImageUrl);

  // Only connect to SSE if status is 'generating' or 'draft'
  // We use 'draft' here because the creation action redirects immediately
  const shouldStream = status === 'generating' || status === 'draft';

  useEffect(() => {
    if (!shouldStream) return;

    const eventSource = new EventSource(`/api/stories/${initialStory.id}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'delta') {
          setContent((prev) => prev + data.content);
          setStatus('generating');
        } else if (data.type === 'image') {
          setCoverImage(data.url);
        } else if (data.type === 'done') {
          setStatus('completed');
          eventSource.close();
        }
      } catch (e) {
        console.error("Error parsing stream data", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      // Optional: Handle retry logic or set status to failed
    };

    return () => {
      eventSource.close();
    };
  }, [shouldStream, initialStory.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Watermark */}
      {coverImage && (
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            //filter: 'blur(20px) saturate(1.5)',
          }}
        />
      )}

      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/50 z-10 relative">

        {/* Hero / Cover Section */}
        <div className="relative h-64 md:h-80 bg-slate-100 group overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Portada del cuento"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Creando tu portada mágica...</h3>
              <p className="text-indigo-100 max-w-md">
                Nuestros artistas digitales están pintando una escena única para {initialStory.childName}.
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {status === 'completed' ? (
              <span className="bg-green-500/90 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md flex items-center gap-2">
                ✨ Completado
              </span>
            ) : (
              <span className="bg-amber-500/90 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md flex items-center gap-2 animate-pulse">
                ⏳ Escribiendo...
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12">
          {/* Header Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">
              {initialStory.childAge} Años
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold uppercase tracking-wider">
              {initialStory.theme || "Estilo Pixar"}
            </span>
            {initialStory.interests.map((interest, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                {interest}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
            {initialStory.title}
          </h1>

          {/* Story Text */}
          <div className="prose prose-lg md:prose-xl prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 leading-relaxed">
            {content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index} className="mb-4 text-slate-700">{paragraph}</p> : <br key={index} />
            ))}

            {(status === 'generating' || status === 'draft') && (
              <span className="inline-block w-2 h-6 ml-1 bg-indigo-600 animate-pulse align-middle rounded-full"></span>
            )}
          </div>

          {/* Footer / Actions */}
          {status === 'completed' && (
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 italic text-sm">
                Generado con amor por Talepia AI
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition">
                  Compartir
                </button>
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-200">
                  Leer de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
