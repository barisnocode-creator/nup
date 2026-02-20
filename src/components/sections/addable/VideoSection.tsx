import { useState } from 'react';
import { Youtube, Play } from 'lucide-react';
import type { SectionComponentProps } from '../types';

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export function VideoSection({ section, isEditing, onUpdate }: SectionComponentProps) {
  const props = section.props || {};
  const sectionTitle = props.sectionTitle || 'Video';
  const sectionDescription = props.sectionDescription || '';
  const videoUrl = props.videoUrl || '';
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const [inputValue, setInputValue] = useState('');
  const [isEditing_local, setIsEditing_local] = useState(false);

  const handleApply = () => {
    const embed = getYouTubeEmbedUrl(inputValue);
    if (embed && onUpdate) {
      onUpdate({ videoUrl: inputValue });
      setIsEditing_local(false);
      setInputValue('');
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {(sectionTitle || sectionDescription) && (
          <div className="text-center mb-10">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-foreground mb-3 font-heading-dynamic">{sectionTitle}</h2>
            )}
            {sectionDescription && (
              <p className="text-muted-foreground max-w-2xl mx-auto font-body-dynamic">{sectionDescription}</p>
            )}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {embedUrl && !isEditing_local ? (
            <div className="relative group">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={sectionTitle}
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => setIsEditing_local(true)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  Videoyu Değiştir
                </button>
              )}
            </div>
          ) : isEditing ? (
            <div className="aspect-video rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-4 p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <Youtube className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground mb-1">YouTube Videosu Ekle</p>
                <p className="text-xs text-muted-foreground">youtube.com veya youtu.be linkini yapıştır</p>
              </div>
              <div className="flex gap-2 w-full max-w-md">
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 h-9 px-3 rounded-lg text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                />
                <button
                  onClick={handleApply}
                  disabled={!inputValue.trim()}
                  className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play className="w-3.5 h-3.5" />
                  Uygula
                </button>
              </div>
              {isEditing_local && (
                <button onClick={() => setIsEditing_local(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">İptal</button>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl border border-border bg-muted/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Youtube className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Video eklenmedi</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
