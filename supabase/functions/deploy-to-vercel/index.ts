import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SiteSection {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
}

interface SiteTheme {
  colors?: Record<string, string>;
  fonts?: { heading?: string; body?: string };
  borderRadius?: string;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(str: string): string {
  if (!str) return "";
  return escapeHtml(str).replace(/\n/g, "<br>");
}

// ── Theme color extraction ──

function buildThemeCssVars(theme: SiteTheme): string {
  const colors = theme?.colors || {};
  const defaultColors: Record<string, string> = {
    "background": "#ffffff",
    "foreground": "#1a1a1a",
    "primary": "#f97316",
    "primary-foreground": "#ffffff",
    "secondary": "#f4f4f5",
    "secondary-foreground": "#4a4a4a",
    "muted": "#f4f4f5",
    "muted-foreground": "#737373",
    "accent": "#f97316",
    "accent-foreground": "#ffffff",
    "border": "#e5e5e5",
    "input": "#e5e5e5",
    "ring": "#f97316",
    "card": "#ffffff",
    "card-foreground": "#1a1a1a",
  };
  const vars: Record<string, string> = {};
  for (const [key, fallback] of Object.entries(defaultColors)) {
    // Use the stored color directly (hex or hsl) — no conversion needed
    vars[`--${key}`] = colors[key] || fallback;
  }
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join("; ");
}

// ── Section Renderers ──
// NOTE: isBase64Image removed — all image URLs are passed through directly.
// Supabase Storage always returns https:// URLs, so no filtering needed.

function renderHeroCentered(s: SiteSection): string {
  const p = s.props;
  const bg = (p.backgroundImage as string) || "";
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 40%, black))`;
  return `<section class="relative min-h-[80vh] flex items-center justify-center text-center text-white" style="${bgStyle}">
  <div class="max-w-3xl mx-auto px-6 py-20">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-heading-dynamic">${escapeHtml(p.title as string)}</h1>
    ${p.subtitle ? `<p class="text-lg md:text-xl opacity-90 mb-4">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.description ? `<p class="text-base opacity-80 mb-8 max-w-2xl mx-auto">${escapeHtml(p.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
      ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderStatisticsCounter(s: SiteSection): string {
  const p = s.props;
  const stats: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const val = p[`stat${i}Value`] as string;
    const label = p[`stat${i}Label`] as string;
    if (val && label) {
      stats.push(`<div class="text-center"><div class="text-3xl md:text-4xl font-bold" style="color:var(--primary)">${escapeHtml(val)}</div><div class="text-sm mt-1" style="color:var(--muted-foreground)">${escapeHtml(label)}</div></div>`);
    }
  }
  return `<section class="py-16" style="background:var(--muted)">
  <div class="max-w-5xl mx-auto px-6">
    ${p.title ? `<h2 class="text-2xl font-bold text-center mb-8 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">${stats.join("")}</div>
  </div>
</section>`;
}

function renderAboutSection(s: SiteSection): string {
  const p = s.props;
  const img = (p.image as string) || "";
  const features = (p.features as string || "").split("\n").filter(Boolean);
  const featuresHtml = features.map(f => `<li class="flex items-center gap-2"><span style="color:var(--primary)">✓</span> ${escapeHtml(f)}</li>`).join("");
  const isRight = (p.imagePosition as string) === "right";

  return `<section id="about" class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="${isRight ? "order-1" : "order-2 md:order-1"}">
        <h2 class="text-3xl font-bold mb-6 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>
        <div class="leading-relaxed mb-6 whitespace-pre-line" style="color:var(--muted-foreground)">${nl2br(p.description as string)}</div>
        ${featuresHtml ? `<ul class="space-y-2">${featuresHtml}</ul>` : ""}
      </div>
      <div class="${isRight ? "order-2" : "order-1 md:order-2"}">
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.title as string)}" class="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />` : `<div class="rounded-xl w-full aspect-[4/3] flex items-center justify-center text-6xl" style="background:var(--muted)">📖</div>`}
      </div>
    </div>
  </div>
</section>`;
}

function renderServicesGrid(s: SiteSection): string {
  const p = s.props;
  const services = (p.services as Array<{ title: string; description: string; image?: string; icon?: string }>) || [];
  const cards = services.map(sv => `
    <div class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition" style="background:var(--card)">
      ${sv.image ? `<img src="${escapeHtml(sv.image)}" alt="${escapeHtml(sv.title)}" class="w-full h-48 object-cover" />` : ""}
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-2" style="color:var(--card-foreground)">${escapeHtml(sv.title)}</h3>
        <p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(sv.description)}</p>
      </div>
    </div>`).join("");

  return `<section id="services" class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    ${p.sectionDescription ? `<p class="text-center max-w-2xl mx-auto mb-12" style="color:var(--muted-foreground)">${escapeHtml(p.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderTestimonialsCarousel(s: SiteSection): string {
  const p = s.props;
  const items = (p.testimonials as Array<{ name: string; role: string; content: string }>) || [];
  const cards = items.map(t => `
    <div class="rounded-xl p-6 shadow-md" style="background:var(--card)">
      <p class="italic mb-4" style="color:var(--muted-foreground)">"${escapeHtml(t.content)}"</p>
      <div class="font-semibold" style="color:var(--card-foreground)">${escapeHtml(t.name)}</div>
      <div class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(t.role)}</div>
    </div>`).join("");

  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderImageGallery(s: SiteSection): string {
  const p = s.props;
  const images: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = p[`image${i}`] as string;
    if (img) images.push(img);
  }
  const cols = p.columns as string || "3";
  const gridCols = cols === "2" ? "md:grid-cols-2" : cols === "4" ? "md:grid-cols-4" : "md:grid-cols-3";
  const imgHtml = images.map(src => `<img src="${escapeHtml(src)}" alt="Galeri" class="rounded-lg w-full aspect-square object-cover hover:scale-105 transition duration-300" />`).join("");

  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.title ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 ${gridCols} gap-4">${imgHtml}</div>
  </div>
</section>`;
}

function renderFAQAccordion(s: SiteSection): string {
  const p = s.props;
  const items = (p.items as Array<{ question: string; answer: string }>) || [];
  const faqHtml = items.map((item, i) => `
    <details class="group py-4" style="border-bottom:1px solid var(--border)" ${i === 0 ? "open" : ""}>
      <summary class="flex justify-between items-center cursor-pointer font-medium" style="color:var(--foreground)">
        ${escapeHtml(item.question)}
        <svg class="w-5 h-5 group-open:rotate-180 transition-transform" style="color:var(--muted-foreground)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-3 leading-relaxed" style="color:var(--muted-foreground)">${escapeHtml(item.answer)}</p>
    </details>`).join("");

  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-3xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div>${faqHtml}</div>
  </div>
</section>`;
}

function renderContactForm(s: SiteSection, projectId?: string): string {
  const p = s.props;
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const pid = projectId || "";
  return `<section id="contact" class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    ${p.sectionDescription ? `<p class="text-center max-w-2xl mx-auto mb-12" style="color:var(--muted-foreground)">${escapeHtml(p.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12">
      <div class="space-y-6">
        ${p.phone ? `<div class="flex items-center gap-3"><span class="text-2xl">📞</span><div><div class="text-sm" style="color:var(--muted-foreground)">Telefon</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(p.phone as string)}</div></div></div>` : ""}
        ${p.email ? `<div class="flex items-center gap-3"><span class="text-2xl">📧</span><div><div class="text-sm" style="color:var(--muted-foreground)">E-posta</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(p.email as string)}</div></div></div>` : ""}
        ${p.address ? `<div class="flex items-center gap-3"><span class="text-2xl">📍</span><div><div class="text-sm" style="color:var(--muted-foreground)">Adres</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(p.address as string)}</div></div></div>` : ""}
      </div>
      <form class="space-y-4" id="contact-form">
        <input type="text" name="_hp" style="display:none" tabindex="-1" autocomplete="off" />
        <input type="text" name="name" placeholder="Adınız" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required />
        <input type="email" name="email" placeholder="E-posta" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required />
        <input type="text" name="subject" placeholder="Konu" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" />
        <textarea name="message" placeholder="Mesajınız" rows="4" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required></textarea>
        <button type="submit" class="w-full px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="background:var(--primary);color:var(--primary-foreground)">${escapeHtml((p.submitButtonText as string) || "Gönder")}</button>
        <div id="contact-msg" class="text-center text-sm hidden"></div>
      </form>
    </div>
  </div>
  <script>
  (function(){
    var f=document.getElementById('contact-form');
    if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('button[type=submit]');
      btn.disabled=true;btn.textContent='Gönderiliyor...';
      var d={project_id:'${pid}',name:f.name.value,email:f.email.value,subject:f.subject?f.subject.value:'',message:f.message.value,_hp:f._hp?f._hp.value:''};
      fetch('${supabaseUrl}/functions/v1/submit-contact-form',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
      .then(function(r){return r.json()})
      .then(function(r){
        var msg=document.getElementById('contact-msg');
        if(r.success){msg.textContent='Mesajınız alındı! Teşekkürler.';msg.style.color='green';msg.classList.remove('hidden');f.reset();}
        else{msg.textContent=r.error||'Bir hata oluştu.';msg.style.color='red';msg.classList.remove('hidden');}
        btn.disabled=false;btn.textContent='${escapeHtml((p.submitButtonText as string) || "Gönder")}';
      })
      .catch(function(){
        var msg=document.getElementById('contact-msg');
        msg.textContent='Bir hata oluştu. Lütfen tekrar deneyin.';msg.style.color='red';msg.classList.remove('hidden');
        btn.disabled=false;btn.textContent='${escapeHtml((p.submitButtonText as string) || "Gönder")}';
      });
    });
  })();
  </script>
</section>`;
}

function renderCTABanner(s: SiteSection): string {
  const p = s.props;
  const bg = (p.backgroundImage as string) || "";
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 35%, black))`;
  return `<section class="relative py-20 text-white text-center" style="${bgStyle}">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-bold mb-4 font-heading-dynamic">${escapeHtml(p.title as string)}</h2>
    ${p.description ? `<p class="text-lg opacity-90 mb-8">${escapeHtml(p.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${p.buttonText ? `<a href="${escapeHtml(p.buttonLink as string || '#')}" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="background:var(--primary);color:var(--primary-foreground)">${escapeHtml(p.buttonText as string)}</a>` : ""}
      ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderPricingTable(s: SiteSection): string {
  const p = s.props;
  const plans = (p.plans as Array<{ name: string; price: string; period?: string; features?: string; buttonText?: string; highlighted?: boolean }>) || [];
  const cards = plans.map(pl => {
    const features = (pl.features || "").split("\n").filter(Boolean);
    const featList = features.map(f => `<li class="flex items-center gap-2 py-1"><span style="color:var(--primary)">✓</span>${escapeHtml(f)}</li>`).join("");
    return `<div class="rounded-xl p-8 shadow-md" style="background:var(--card);${pl.highlighted ? 'ring:2px solid var(--primary);box-shadow:0 0 0 2px var(--primary)' : ''}">
      <h3 class="text-xl font-bold mb-2" style="color:var(--card-foreground)">${escapeHtml(pl.name)}</h3>
      <div class="text-3xl font-bold mb-1" style="color:var(--primary)">${escapeHtml(pl.price)}</div>
      ${pl.period ? `<div class="text-sm mb-6" style="color:var(--muted-foreground)">${escapeHtml(pl.period)}</div>` : '<div class="mb-6"></div>'}
      <ul class="space-y-1 mb-8 text-sm">${featList}</ul>
      <a href="#contact" class="block text-center px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition" style="${pl.highlighted ? 'background:var(--primary);color:var(--primary-foreground)' : 'background:var(--muted);color:var(--foreground)'}">${escapeHtml(pl.buttonText || 'Seç')}</a>
    </div>`;
  }).join("");

  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderAppointmentBooking(s: SiteSection): string {
  const p = s.props;
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const title = escapeHtml(p.sectionTitle as string || "Randevu Alın");
  const subtitle = p.sectionSubtitle ? `<span class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style="background:color-mix(in srgb, var(--primary) 10%, transparent);color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</span>` : "";
  const desc = p.sectionDescription ? `<p class="max-w-2xl mx-auto mt-4" style="color:var(--muted-foreground)">${escapeHtml(p.sectionDescription as string)}</p>` : "";
  const btnText = escapeHtml(p.submitButtonText as string || "Randevu Oluştur");
  const successMsg = escapeHtml(p.successMessage as string || "Randevunuz başarıyla oluşturuldu!");

  return `<section id="appointment" class="py-20" style="background:var(--muted)">
  <div class="max-w-2xl mx-auto px-6">
    <div class="text-center mb-12">
      ${subtitle}
      <h2 class="text-3xl font-bold font-heading-dynamic" style="color:var(--foreground)">${title}</h2>
      ${desc}
    </div>
    <div class="p-8 rounded-2xl" style="background:var(--card);border:1px solid var(--border)">
      <div id="appt-steps" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:32px">
        <div class="appt-step active" data-step="1" style="display:flex;align-items:center;gap:6px">
          <div class="appt-step-icon" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--primary);color:var(--primary-foreground);font-size:14px;transition:all .3s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span class="appt-step-label" style="font-size:13px;font-weight:600;color:var(--primary)">Tarih</span>
        </div>
        <div style="width:40px;height:2px;background:var(--border);border-radius:1px"></div>
        <div class="appt-step" data-step="2" style="display:flex;align-items:center;gap:6px">
          <div class="appt-step-icon" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--muted);color:var(--muted-foreground);font-size:14px;transition:all .3s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="appt-step-label" style="font-size:13px;font-weight:500;color:var(--muted-foreground)">Saat</span>
        </div>
        <div style="width:40px;height:2px;background:var(--border);border-radius:1px"></div>
        <div class="appt-step" data-step="3" style="display:flex;align-items:center;gap:6px">
          <div class="appt-step-icon" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--muted);color:var(--muted-foreground);font-size:14px;transition:all .3s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span class="appt-step-label" style="font-size:13px;font-weight:500;color:var(--muted-foreground)">Bilgiler</span>
        </div>
      </div>
      <div id="appt-form-container">
        <div style="margin-bottom:24px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <button id="appt-prev-week" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:var(--background);color:var(--foreground);display:flex;align-items:center;justify-content:center;cursor:pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span id="appt-month-label" style="font-weight:600;font-size:15px;color:var(--foreground)"></span>
            <button id="appt-next-week" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:var(--background);color:var(--foreground);display:flex;align-items:center;justify-content:center;cursor:pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div id="appt-dates" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px"></div>
        </div>
        <div id="appt-slots-container" style="display:none;margin-bottom:24px">
          <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;color:var(--foreground)">Müsait Saatler</label>
          <div id="appt-slots" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px"></div>
        </div>
        <div id="appt-fields" style="display:none"></div>
        <div id="appt-consent" style="display:none"></div>
        <div id="appt-error" style="display:none;padding:12px;border-radius:8px;font-size:14px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;margin-bottom:16px"></div>
        <button id="appt-submit" disabled class="w-full px-6 py-4 rounded-xl font-medium transition" style="background:var(--primary);color:var(--primary-foreground);opacity:0.4;cursor:not-allowed">${btnText}</button>
      </div>
      <div id="appt-success" style="display:none" class="text-center py-12">
        <div class="text-5xl mb-4">✅</div>
        <h3 class="text-xl font-semibold mb-2" style="color:var(--foreground)">${successMsg}</h3>
        <p style="color:var(--muted-foreground)">En kısa sürede sizinle iletişime geçeceğiz.</p>
        <button onclick="location.reload()" class="mt-6 px-6 py-2 rounded-lg" style="border:1px solid var(--border);color:var(--foreground)">Yeni Randevu</button>
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  var API='${supabaseUrl}/functions/v1/book-appointment';
  var PID=window.__PROJECT_ID__;
  var selDate='',selSlot='',dur=30;
  var formFields=null,consentRequired=false,consentText='';
  var weekOffset=0;
  var unavailableDates={};
  var dayNames=['Pzr','Pzt','Sal','Çar','Per','Cum','Cmt'];
  var monthNames=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  function getWeekDates(offset){var dates=[];var today=new Date();var start=new Date(today);start.setDate(today.getDate()+1+(offset*7));for(var i=0;i<7;i++){var d=new Date(start);d.setDate(start.getDate()+i);dates.push(d)}return dates}
  function fmtDate(d){return d.toISOString().split('T')[0]}
  function setStep(n){document.querySelectorAll('.appt-step').forEach(function(el){var s=parseInt(el.dataset.step);var icon=el.querySelector('.appt-step-icon');var label=el.querySelector('.appt-step-label');if(s<=n){icon.style.background='var(--primary)';icon.style.color='var(--primary-foreground)';label.style.color='var(--primary)';label.style.fontWeight='600'}else{icon.style.background='var(--muted)';icon.style.color='var(--muted-foreground)';label.style.color='var(--muted-foreground)';label.style.fontWeight='500'}})}
  function renderDates(){var dc=document.getElementById('appt-dates');dc.innerHTML='';var dates=getWeekDates(weekOffset);var ml=document.getElementById('appt-month-label');var first=dates[0],last=dates[6];if(first.getMonth()===last.getMonth()){ml.textContent=monthNames[first.getMonth()]+' '+first.getFullYear()}else{ml.textContent=monthNames[first.getMonth()].substring(0,3)+' - '+monthNames[last.getMonth()].substring(0,3)+' '+last.getFullYear()}dates.forEach(function(d){var dt=fmtDate(d);var btn=document.createElement('button');btn.dataset.date=dt;btn.style.cssText='display:flex;flex-direction:column;align-items:center;padding:10px 4px;border-radius:12px;border:1px solid var(--border);background:var(--background);color:var(--foreground);cursor:pointer;font-size:13px;min-width:0';var dayLabel=document.createElement('span');dayLabel.style.cssText='font-size:11px;color:var(--muted-foreground);margin-bottom:4px';dayLabel.textContent=dayNames[d.getDay()];var dayNum=document.createElement('span');dayNum.style.cssText='font-size:16px;font-weight:600';dayNum.textContent=d.getDate();btn.appendChild(dayLabel);btn.appendChild(dayNum);if(selDate===dt){btn.style.background='var(--primary)';btn.style.color='var(--primary-foreground)';dayLabel.style.color='var(--primary-foreground)'}if(unavailableDates[dt]){btn.style.opacity='0.35';btn.style.pointerEvents='none'}btn.onclick=function(){selectDate(dt)};dc.appendChild(btn)});document.getElementById('appt-prev-week').style.opacity=weekOffset<=0?'0.3':'1';document.getElementById('appt-prev-week').style.pointerEvents=weekOffset<=0?'none':'auto'}
  function selectDate(dt){selDate=dt;selSlot='';setStep(1);var dc=document.getElementById('appt-dates');dc.querySelectorAll('button').forEach(function(btn){var bdt=btn.dataset.date;if(bdt===dt){btn.style.background='var(--primary)';btn.style.color='var(--primary-foreground)';btn.querySelectorAll('span').forEach(function(s){s.style.color='var(--primary-foreground)'})}else if(!unavailableDates[bdt]){btn.style.background='var(--background)';btn.style.color='var(--foreground)';var spans=btn.querySelectorAll('span');if(spans[0])spans[0].style.color='var(--muted-foreground)';if(spans[1])spans[1].style.color='var(--foreground)'}});var sc=document.getElementById('appt-slots-container');var sl=document.getElementById('appt-slots');sc.style.display='block';sl.innerHTML='<p style="color:var(--muted-foreground);font-size:14px;text-align:center;padding:20px 0">Yükleniyor...</p>';fetch(API+'?project_id='+PID+'&date='+dt).then(function(r){return r.json()}).then(function(data){dur=data.duration||30;formFields=data.form_fields||null;consentRequired=data.consent_required||false;consentText=data.consent_text||'';if(!data.slots||data.slots.length===0){sl.innerHTML='<p style="color:var(--muted-foreground);font-size:14px;text-align:center;padding:20px 0">Bu tarihte müsait saat yok.</p>';return}sl.innerHTML='';data.slots.forEach(function(t){var endTime=addMinutes(t,dur);var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;border:1px solid var(--border);background:var(--background);cursor:pointer;font-size:14px';var ts=document.createElement('span');ts.style.fontWeight='500';ts.style.color='var(--foreground)';ts.textContent=t+' – '+endTime;var ds=document.createElement('span');ds.style.cssText='font-size:12px;color:var(--muted-foreground)';ds.textContent=dur+' dk';row.appendChild(ts);row.appendChild(ds);row.onclick=function(){selectSlot(t,row)};sl.appendChild(row)})}).catch(function(){sl.innerHTML='<p style="color:#b91c1c;font-size:14px;text-align:center;padding:20px 0">Hata oluştu.</p>'})}
  function addMinutes(t,m){var pr=t.split(':').map(Number);var total=pr[0]*60+pr[1]+m;return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0')}
  function selectSlot(t,el){selSlot=t;setStep(3);document.getElementById('appt-slots').querySelectorAll('div').forEach(function(r){r.style.background='var(--background)';r.querySelectorAll('span').forEach(function(s){s.style.color=''})});el.style.background='var(--primary)';el.querySelectorAll('span').forEach(function(s){s.style.color='var(--primary-foreground)'});document.getElementById('appt-fields').style.display='block';renderFields(formFields);renderConsent();document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').style.opacity='1';document.getElementById('appt-submit').style.cursor='pointer'}
  function renderFields(fields){var fc=document.getElementById('appt-fields');fc.innerHTML='';if(!fields||!fields.length){fc.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px"><div><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">Adınız *</label><input id="appt-name" required style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="Adınızı girin"></div><div><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">E-posta *</label><input id="appt-email" type="email" required style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="E-posta adresiniz"></div></div><div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">Telefon</label><input id="appt-phone" type="tel" style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="Telefon numaranız"></div>';return}var sorted=fields.slice().sort(function(a,b){return a.order-b.order});sorted.forEach(function(f){var w=document.createElement('div');w.style.marginBottom='16px';var lbl=document.createElement('label');lbl.style.cssText='display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)';lbl.textContent=f.label+(f.required?' *':'');w.appendChild(lbl);var inp;if(f.type==='textarea'){inp=document.createElement('textarea');inp.rows=3}else if(f.type==='select'){inp=document.createElement('select');(f.options||[]).forEach(function(opt){var o=document.createElement('option');o.value=opt;o.textContent=opt;inp.appendChild(o)})}else{inp=document.createElement('input');inp.type=f.type||'text';inp.placeholder=f.placeholder||''}inp.id='appt-field-'+f.id;inp.style.cssText='width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none';if(f.required)inp.required=true;w.appendChild(inp);fc.appendChild(w)})}
  function renderConsent(){var cc=document.getElementById('appt-consent');cc.innerHTML='';if(!consentRequired)return;cc.style.display='block';cc.innerHTML='<label style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--foreground);margin-bottom:16px;cursor:pointer"><input type="checkbox" id="appt-consent-cb" style="margin-top:2px;flex-shrink:0"> <span>'+consentText+'</span></label>'}
  function getFormData(){var data={};var name=document.getElementById('appt-name');var email=document.getElementById('appt-email');var phone=document.getElementById('appt-phone');if(name)data.client_name=name.value;if(email)data.client_email=email.value;if(phone)data.client_phone=phone.value;return data}
  document.getElementById('appt-submit').addEventListener('click',function(){
    var btn=document.getElementById('appt-submit');
    var errEl=document.getElementById('appt-error');
    errEl.style.display='none';
    if(!selDate||!selSlot){errEl.textContent='Lütfen tarih ve saat seçin.';errEl.style.display='block';return}
    var consentCb=document.getElementById('appt-consent-cb');
    if(consentRequired&&consentCb&&!consentCb.checked){errEl.textContent='Devam etmek için onay vermeniz gerekmektedir.';errEl.style.display='block';return}
    var formData=getFormData();
    if(!formData.client_name||!formData.client_email){errEl.textContent='Lütfen zorunlu alanları doldurun.';errEl.style.display='block';return}
    btn.disabled=true;btn.style.opacity='0.6';btn.textContent='Gönderiliyor...';
    var endTime=addMinutes(selSlot,dur);
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project_id:PID,appointment_date:selDate,start_time:selSlot,end_time:endTime,client_name:formData.client_name,client_email:formData.client_email,client_phone:formData.client_phone||'',consent_given:consentRequired?(document.getElementById('appt-consent-cb')?document.getElementById('appt-consent-cb').checked:false):true})})
    .then(function(r){return r.json()})
    .then(function(r){
      if(r.success){document.getElementById('appt-form-container').style.display='none';document.getElementById('appt-success').style.display='block'}
      else{errEl.textContent=r.error||'Bir hata oluştu.';errEl.style.display='block';btn.disabled=false;btn.style.opacity='1';btn.textContent='${btnText}'}
    })
    .catch(function(){errEl.textContent='Bağlantı hatası.';errEl.style.display='block';btn.disabled=false;btn.style.opacity='1';btn.textContent='${btnText}'});
  });
  document.getElementById('appt-prev-week').addEventListener('click',function(){if(weekOffset>0){weekOffset--;renderDates()}});
  document.getElementById('appt-next-week').addEventListener('click',function(){weekOffset++;renderDates()});
  renderDates();
})();
</script>`;
}

function renderCafeFeatures(s: SiteSection): string {
  const p = s.props;
  const features: Array<{ icon: string; title: string; desc?: string }> = [];
  for (let i = 1; i <= 6; i++) {
    const icon = p[`feature${i}Icon`] as string;
    const title = p[`feature${i}Title`] as string;
    const desc = p[`feature${i}Description`] as string;
    if (title) features.push({ icon: icon || "✨", title, desc });
  }
  if (!features.length) {
    features.push(
      { title: "Özel Kahve", desc: "En iyi çekirdeklerden özel demleme", icon: "☕" },
      { title: "Müzik", desc: "Canlı müzik ve seçilmiş playlist", icon: "🎵" },
      { title: "Huzurlu Ortam", desc: "Çalışmak ve dinlenmek için ideal", icon: "📚" },
      { title: "Doğal Malzeme", desc: "Taze ve organik içerikler", icon: "🌿" }
    );
  }
  const cards = features.map(f => `
    <div class="text-center p-8 rounded-2xl hover:shadow-lg transition" style="background:var(--background)">
      <div class="text-4xl mb-4">${escapeHtml(f.icon)}</div>
      <h3 class="text-lg font-semibold mb-2 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(f.title)}</h3>
      ${f.desc ? `<p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(f.desc)}</p>` : ""}
    </div>`).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.title ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">${cards}</div>
  </div>
</section>`;
}

function renderMenuShowcase(s: SiteSection): string {
  const p = s.props;
  const items = (p.items as Array<{ name: string; description?: string; price?: string; image?: string; category?: string }>) || [];
  const cards = items.map(item => {
    const img = item.image || "";
    return `<div class="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition" style="background:var(--card)">
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(item.name)}" class="w-full h-48 object-cover" />` : `<div class="w-full h-48 flex items-center justify-center text-4xl" style="background:var(--muted)">☕</div>`}
      <div class="p-4">
        ${item.category ? `<span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--primary)">${escapeHtml(item.category)}</span>` : ""}
        <h3 class="font-semibold mt-1 font-heading-dynamic" style="color:var(--card-foreground)">${escapeHtml(item.name)}</h3>
        ${item.description ? `<p class="text-sm mt-1" style="color:var(--muted-foreground)">${escapeHtml(item.description)}</p>` : ""}
        ${item.price ? `<p class="font-bold mt-2" style="color:var(--primary)">${escapeHtml(item.price)}</p>` : ""}
      </div>
    </div>`;
  }).join("");
  return `<section id="menu" class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.title ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderCafeStory(s: SiteSection): string {
  const p = s.props;
  const rawImg = p.image as string || "";
  const img = rawImg;
  const features = (p.features as string || "").split("\n").filter(Boolean);
  const featsHtml = features.map(f => `<li class="flex items-center gap-2"><span style="color:var(--primary)">✓</span> ${escapeHtml(f)}</li>`).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.title as string || "")}" class="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />` : `<div class="rounded-2xl w-full aspect-[4/3] flex items-center justify-center text-6xl" style="background:var(--border)">🏠</div>`}
      </div>
      <div>
        ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
        ${p.title ? `<h2 class="text-3xl font-bold mb-6 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
        ${p.description ? `<div class="mb-6 leading-relaxed" style="color:var(--muted-foreground)">${nl2br(p.description as string)}</div>` : ""}
        ${featsHtml ? `<ul class="space-y-2">${featsHtml}</ul>` : ""}
      </div>
    </div>
  </div>
</section>`;
}

function renderCafeGallery(s: SiteSection): string {
  const p = s.props;
  const images: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const img = p[`image${i}`] as string;
    if (img) images.push(img);
  }
  if (!images.length) {
    const imgArr = p.images as string[];
    if (Array.isArray(imgArr)) imgArr.forEach(img => { if (img) images.push(img); });
  }
  const galleryHtml = images.map(src => `<img src="${escapeHtml(src)}" alt="Galeri" class="rounded-xl w-full aspect-square object-cover hover:scale-105 transition duration-300" />`).join("");
  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.title ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">${galleryHtml}</div>
  </div>
</section>`;
}

function renderChefShowcase(s: SiteSection): string {
  const p = s.props;
  const rawImg = p.chefImage as string || p.image as string || "";
  const img = rawImg;
  const specialties = (p.specialties as string || "").split("\n").filter(Boolean);
  const specsHtml = specialties.map(sp => `<span class="px-3 py-1 rounded-full text-sm" style="background:var(--primary);color:var(--primary-foreground)">${escapeHtml(sp)}</span>`).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
        ${p.sectionTitle ? `<h2 class="text-3xl font-bold mb-2 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
        ${p.chefName ? `<p class="text-xl font-semibold mb-4" style="color:var(--primary)">${escapeHtml(p.chefName as string)}</p>` : ""}
        ${p.chefBio ? `<p class="mb-6 leading-relaxed" style="color:var(--muted-foreground)">${nl2br(p.chefBio as string)}</p>` : ""}
        ${specsHtml ? `<div class="flex flex-wrap gap-2">${specsHtml}</div>` : ""}
      </div>
      <div class="flex justify-center">
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.chefName as string || "Şef")}" class="rounded-2xl shadow-xl w-full max-w-sm object-cover aspect-[3/4]" />` : `<div class="rounded-2xl w-full max-w-sm aspect-[3/4] flex items-center justify-center text-6xl" style="background:var(--border)">👨‍🍳</div>`}
      </div>
    </div>
  </div>
</section>`;
}

function renderRestaurantMenu(s: SiteSection): string {
  const p = s.props;
  const categories = (p.categories as Array<{ name: string; items: Array<{ name: string; description?: string; price?: string }> }>) || [];
  const catsHtml = categories.map(cat => {
    const itemsHtml = (cat.items || []).map(item => `
      <div class="flex justify-between items-start py-3" style="border-bottom:1px solid var(--border)">
        <div>
          <div class="font-medium" style="color:var(--foreground)">${escapeHtml(item.name)}</div>
          ${item.description ? `<div class="text-sm mt-1" style="color:var(--muted-foreground)">${escapeHtml(item.description)}</div>` : ""}
        </div>
        ${item.price ? `<div class="font-bold ml-4 flex-shrink-0" style="color:var(--primary)">${escapeHtml(item.price)}</div>` : ""}
      </div>`).join("");
    return `<div class="mb-10">
      <h3 class="text-xl font-bold mb-4 pb-2 font-heading-dynamic" style="color:var(--foreground);border-bottom:2px solid var(--primary)">${escapeHtml(cat.name)}</h3>
      ${itemsHtml}
    </div>`;
  }).join("");
  return `<section id="menu" class="py-20" style="background:var(--background)">
  <div class="max-w-4xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    ${catsHtml}
  </div>
</section>`;
}

function renderRoomShowcase(s: SiteSection): string {
  const p = s.props;
  const rooms = (p.rooms as Array<{ name: string; description?: string; price?: string; image?: string; features?: string }>) || [];
  const cards = rooms.map(room => {
    const rawImg = room.image || "";
    const img = rawImg;
    const feats = (room.features || "").split("\n").filter(Boolean);
    const featsHtml = feats.map(f => `<span class="text-xs px-2 py-1 rounded-full" style="background:var(--muted);color:var(--muted-foreground)">${escapeHtml(f)}</span>`).join("");
    return `<div class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition" style="background:var(--card)">
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(room.name)}" class="w-full h-56 object-cover" />` : `<div class="w-full h-56 flex items-center justify-center text-4xl" style="background:var(--muted)">🛏️</div>`}
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold font-heading-dynamic" style="color:var(--card-foreground)">${escapeHtml(room.name)}</h3>
          ${room.price ? `<span class="font-bold" style="color:var(--primary)">${escapeHtml(room.price)}</span>` : ""}
        </div>
        ${room.description ? `<p class="text-sm mb-3" style="color:var(--muted-foreground)">${escapeHtml(room.description)}</p>` : ""}
        ${featsHtml ? `<div class="flex flex-wrap gap-2">${featsHtml}</div>` : ""}
      </div>
    </div>`;
  }).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderHotelAmenities(s: SiteSection): string {
  const p = s.props;
  const amenities = (p.amenities as Array<{ icon?: string; title: string; description?: string }>) || [
    { icon: "🏊", title: "Açık Havuz", description: "Infinity havuz, güneş terası" },
    { icon: "💆", title: "Spa & Wellness", description: "Türk hamamı, masaj, sauna" },
    { icon: "🍽️", title: "Restoran", description: "Fine dining, açık büfe kahvaltı" },
    { icon: "💪", title: "Fitness Center", description: "24 saat açık, kişisel antrenör" },
    { icon: "🚗", title: "Vale Park", description: "Ücretsiz vale ve otopark hizmeti" },
    { icon: "📶", title: "Ücretsiz WiFi", description: "Tüm alanlarda yüksek hızlı internet" },
  ];
  const cards = amenities.map(a => `
    <div class="flex items-start gap-4 p-6 rounded-2xl hover:shadow-lg transition" style="background:var(--card);border:1px solid var(--border)">
      <div class="text-3xl flex-shrink-0">${escapeHtml(a.icon || "✨")}</div>
      <div>
        <h3 class="font-semibold font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(a.title)}</h3>
        ${a.description ? `<p class="text-sm mt-1" style="color:var(--muted-foreground)">${escapeHtml(a.description)}</p>` : ""}
      </div>
    </div>`).join("");
  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-5xl mx-auto px-6">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.title ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h2>` : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
  </div>
</section>`;
}

function renderSkillsGrid(s: SiteSection): string {
  const p = s.props;
  const skills = (p.skills as Array<{ name: string; level?: number; category?: string }>) || [];
  const tags = skills.map(sk => `<div class="px-4 py-2 rounded-full text-sm font-medium" style="background:var(--muted);color:var(--foreground)">${escapeHtml(sk.name)}${sk.level ? ` <span style="color:var(--primary)">${sk.level}%</span>` : ""}</div>`).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-4xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="flex flex-wrap gap-3 justify-center">${tags}</div>
  </div>
</section>`;
}

function renderProjectShowcase(s: SiteSection): string {
  const p = s.props;
  const projects = (p.projects as Array<{ title: string; description?: string; image?: string; category?: string; link?: string }>) || [];
  const cards = projects.map(proj => {
    const rawImg = proj.image || "";
    const img = rawImg;
    return `<div class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group" style="background:var(--card)">
      ${img ? `<div class="overflow-hidden"><img src="${escapeHtml(img)}" alt="${escapeHtml(proj.title)}" class="w-full h-52 object-cover group-hover:scale-105 transition duration-300" /></div>` : `<div class="w-full h-52 flex items-center justify-center text-4xl" style="background:var(--muted)">📁</div>`}
      <div class="p-6">
        ${proj.category ? `<span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--primary)">${escapeHtml(proj.category)}</span>` : ""}
        <h3 class="text-lg font-semibold mt-1 mb-2 font-heading-dynamic" style="color:var(--card-foreground)">${escapeHtml(proj.title)}</h3>
        ${proj.description ? `<p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(proj.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");
  return `<section id="projects" class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderDentalServices(s: SiteSection): string {
  const p = s.props;
  const services = (p.services as Array<{ title: string; description?: string; icon?: string; image?: string }>) || [];
  const cards = services.map(sv => {
    const rawImg = sv.image || "";
    const img = rawImg;
    return `<div class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition" style="background:var(--card)">
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(sv.title)}" class="w-full h-48 object-cover" />` : `<div class="w-full h-48 flex items-center justify-center text-5xl" style="background:var(--muted)">${escapeHtml(sv.icon || "🦷")}</div>`}
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-2 font-heading-dynamic" style="color:var(--card-foreground)">${escapeHtml(sv.title)}</h3>
        ${sv.description ? `<p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(sv.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");
  return `<section id="services" class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderDentalTips(s: SiteSection): string {
  const p = s.props;
  const tips = (p.tips as Array<{ title: string; content?: string; icon?: string }>) || [];
  const cards = tips.map(tip => `
    <div class="p-6 rounded-2xl" style="background:var(--card);border:1px solid var(--border)">
      ${tip.icon ? `<div class="text-3xl mb-3">${escapeHtml(tip.icon)}</div>` : `<div class="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-sm" style="background:var(--primary);color:var(--primary-foreground)">✓</div>`}
      <h3 class="font-semibold mb-2 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(tip.title)}</h3>
      ${tip.content ? `<p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(tip.content)}</p>` : ""}
    </div>`).join("");
  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
  </div>
</section>`;
}

function renderAddableSiteFooter(s: SiteSection): string {
  const p = s.props;
  const year = new Date().getFullYear();
  return `<footer style="background:var(--foreground);color:var(--background);padding:3rem 0">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;margin-bottom:2rem">
      <div>
        <h3 class="font-heading-dynamic" style="font-size:1.25rem;font-weight:700;color:var(--background);margin-bottom:0.5rem">${escapeHtml(p.siteName as string || "")}</h3>
        ${p.tagline ? `<p style="font-size:0.875rem;opacity:0.7">${escapeHtml(p.tagline as string)}</p>` : ""}
      </div>
      <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.875rem;opacity:0.8">
        ${p.phone ? `<span>📞 ${escapeHtml(p.phone as string)}</span>` : ""}
        ${p.email ? `<span>📧 ${escapeHtml(p.email as string)}</span>` : ""}
        ${p.address ? `<span>📍 ${escapeHtml(p.address as string)}</span>` : ""}
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:1.5rem;text-align:center;font-size:0.75rem;opacity:0.5">
      © ${year} ${escapeHtml(p.siteName as string || "")}. Tüm hakları saklıdır.
    </div>
  </div>
</footer>`;
}

function renderAddableBlog(s: SiteSection): string {
  const p = s.props;
  const posts = [];
  for (let i = 1; i <= 4; i++) {
    const title = p[`post${i}Title`] as string;
    const excerpt = p[`post${i}Excerpt`] as string;
    const category = p[`post${i}Category`] as string;
    const image = p[`post${i}Image`] as string;
    const date = p[`post${i}Date`] as string;
    if (title) posts.push({ title, excerpt, category, image: image || "", date });
  }
  const cards = posts.map(post => `
    <div class="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition" style="background:var(--card)">
      ${post.image ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="w-full h-48 object-cover" />` : `<div class="w-full h-48 flex items-center justify-center text-4xl" style="background:var(--muted)">📝</div>`}
      <div class="p-6">
        <div class="flex items-center gap-2 mb-3">
          ${post.category ? `<span class="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full" style="background:color-mix(in srgb, var(--primary) 10%, transparent);color:var(--primary)">${escapeHtml(post.category)}</span>` : ""}
          ${post.date ? `<span class="text-xs" style="color:var(--muted-foreground)">${escapeHtml(post.date)}</span>` : ""}
        </div>
        <h3 class="font-semibold mb-2 font-heading-dynamic" style="color:var(--card-foreground)">${escapeHtml(post.title)}</h3>
        ${post.excerpt ? `<p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(post.excerpt)}</p>` : ""}
      </div>
    </div>`).join("");
  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${p.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(p.sectionSubtitle as string)}</p>` : ""}
    ${p.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderGenericAddable(s: SiteSection): string {
  const p = s.props;
  const title = (p.sectionTitle || p.title) as string || "";
  const desc = (p.sectionDescription || p.description) as string || "";
  if (!title && !desc) return "";
  return `<section class="py-16" style="background:var(--background)">
  <div class="max-w-4xl mx-auto px-6 text-center">
    ${title ? `<h2 class="text-2xl font-bold mb-4 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(title)}</h2>` : ""}
    ${desc ? `<p style="color:var(--muted-foreground)">${escapeHtml(desc)}</p>` : ""}
  </div>
</section>`;
}

// ── Hero variants ──

function renderHeroCafe(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, #2d1b0e, #5c3317)`;
  return `<section class="relative min-h-[90vh] flex items-center text-white" style="${bgStyle}">
  <div class="max-w-6xl mx-auto px-6 py-20">
    ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">${escapeHtml(p.subtitle as string)}</p>` : ""}
    <h1 class="text-5xl md:text-7xl font-bold mb-6 font-heading-dynamic">${escapeHtml(p.title as string)}</h1>
    ${p.description ? `<p class="text-xl opacity-80 mb-8 max-w-xl">${escapeHtml(p.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4">
      ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-4 font-semibold rounded-lg hover:opacity-90 transition text-lg">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
      ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition text-lg">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderHeroDental(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(255,255,255,.92),rgba(255,255,255,.85)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, #e0f2fe, #f0fdf4)`;
  return `<section class="relative min-h-[80vh] flex items-center" style="${bgStyle}">
  <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
    <div>
      ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-3" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
      <h1 class="text-4xl md:text-5xl font-bold mb-4 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h1>
      ${p.description ? `<p class="text-lg mb-8" style="color:var(--muted-foreground)">${escapeHtml(p.description as string)}</p>` : ""}
      <div class="flex flex-wrap gap-4">
        ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
        ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="border:2px solid var(--primary);color:var(--primary)">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
      </div>
    </div>
    <div class="hidden md:flex justify-center">
      ${p.image ? `<img src="${escapeHtml(p.image as string)}" alt="${escapeHtml(p.title as string)}" class="rounded-2xl shadow-2xl max-h-96 object-cover" />` : `<div class="w-64 h-64 rounded-full flex items-center justify-center text-8xl" style="background:var(--muted)">🦷</div>`}
    </div>
  </div>
</section>`;
}

function renderHeroRestaurant(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('${escapeHtml(bg)}') center/cover no-repeat fixed`
    : `background:linear-gradient(to bottom, #1a0a00, #3d1a00)`;
  return `<section class="relative min-h-screen flex items-center justify-center text-white text-center" style="${bgStyle}">
  <div class="max-w-4xl mx-auto px-6 py-20">
    ${p.subtitle ? `<p class="text-sm uppercase tracking-widest mb-6 opacity-70">${escapeHtml(p.subtitle as string)}</p>` : ""}
    <h1 class="text-5xl md:text-7xl font-bold mb-6 font-heading-dynamic">${escapeHtml(p.title as string)}</h1>
    ${p.description ? `<p class="text-xl opacity-80 mb-10 max-w-2xl mx-auto">${escapeHtml(p.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-10 py-4 font-semibold text-lg rounded-full hover:opacity-90 transition">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
      ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-10 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white/10 transition">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderHeroHotel(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, #1e3a5f, #0f2847)`;
  return `<section class="relative min-h-screen flex items-end text-white pb-20" style="${bgStyle}">
  <div class="max-w-6xl mx-auto px-6 w-full">
    ${p.subtitle ? `<p class="text-sm uppercase tracking-widest mb-4 opacity-70">${escapeHtml(p.subtitle as string)}</p>` : ""}
    <h1 class="text-5xl md:text-7xl font-bold mb-4 font-heading-dynamic max-w-3xl">${escapeHtml(p.title as string)}</h1>
    ${p.description ? `<p class="text-xl opacity-80 mb-8 max-w-xl">${escapeHtml(p.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4">
      ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
      ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderHeroPortfolio(s: SiteSection): string {
  const p = s.props;
  return `<section class="min-h-screen flex items-center" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
    <div>
      ${p.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-4" style="color:var(--primary)">${escapeHtml(p.subtitle as string)}</p>` : ""}
      <h1 class="text-5xl md:text-6xl font-bold mb-6 font-heading-dynamic" style="color:var(--foreground)">${escapeHtml(p.title as string)}</h1>
      ${p.description ? `<p class="text-lg mb-8" style="color:var(--muted-foreground)">${escapeHtml(p.description as string)}</p>` : ""}
      <div class="flex flex-wrap gap-4">
        ${p.primaryButtonText ? `<a href="${escapeHtml(p.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition">${escapeHtml(p.primaryButtonText as string)}</a>` : ""}
        ${p.secondaryButtonText ? `<a href="${escapeHtml(p.secondaryButtonLink as string || '#')}" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="border:2px solid var(--border);color:var(--foreground)">${escapeHtml(p.secondaryButtonText as string)}</a>` : ""}
      </div>
    </div>
    <div class="flex justify-center">
      ${p.image ? `<img src="${escapeHtml(p.image as string)}" alt="${escapeHtml(p.title as string)}" class="rounded-2xl shadow-2xl w-full max-w-md object-cover aspect-square" />` : `<div class="w-72 h-72 rounded-full flex items-center justify-center text-8xl" style="background:var(--muted)">👤</div>`}
    </div>
  </div>
</section>`;
}

// ── Pilates Template ──

function renderPilatesHeader(name: string): string {
  return `<header style="position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-bottom:1px solid #e5e7eb">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-size:1.25rem;font-weight:700;color:#1f2937">${escapeHtml(name)}</span>
    <nav style="display:flex;gap:2rem">
      <a href="#about" style="color:#6b7280;text-decoration:none;font-size:0.875rem">Hakkımızda</a>
      <a href="#services" style="color:#6b7280;text-decoration:none;font-size:0.875rem">Dersler</a>
      <a href="#contact" style="color:#6b7280;text-decoration:none;font-size:0.875rem">İletişim</a>
    </nav>
  </div>
</header><div style="height:64px"></div>`;
}

function renderPilatesFooter(name: string, tagline: string): string {
  const year = new Date().getFullYear();
  return `<footer style="background:#1f2937;color:#9ca3af;padding:3rem 0;text-align:center">
  <p style="font-weight:600;color:#fff;margin-bottom:0.5rem">${escapeHtml(name)}</p>
  <p style="font-size:0.875rem;margin-bottom:1rem">${escapeHtml(tagline)}</p>
  <p style="font-size:0.75rem">© ${year} ${escapeHtml(name)}</p>
</footer>`;
}

function renderPilatesHero(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg,#667eea,#764ba2)`;
  return `<section style="${bgStyle};min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff">
  <div style="max-width:48rem;padding:5rem 1.5rem">
    <h1 style="font-size:clamp(2.5rem,5vw,4rem);font-weight:700;margin-bottom:1.5rem">${escapeHtml(p.title as string || "")}</h1>
    ${p.subtitle ? `<p style="font-size:1.25rem;opacity:0.85;margin-bottom:2.5rem">${escapeHtml(p.subtitle as string)}</p>` : ""}
    ${p.ctaText ? `<a href="#contact" style="display:inline-block;padding:1rem 2.5rem;border-radius:9999px;font-weight:600;font-size:1.125rem;background:#fff;color:#764ba2;text-decoration:none">${escapeHtml(p.ctaText as string)}</a>` : ""}
  </div>
</section>`;
}

function renderPilatesFeatures(s: SiteSection): string {
  const p = s.props;
  const features = (p.features as Array<{ icon?: string; title: string; description?: string }>) || [];
  const cards = features.map(f => `
    <div style="text-align:center;padding:2rem">
      ${f.icon ? `<div style="font-size:3rem;margin-bottom:1rem">${escapeHtml(f.icon)}</div>` : ""}
      <h3 style="font-weight:600;margin-bottom:0.5rem;color:#1f2937">${escapeHtml(f.title)}</h3>
      ${f.description ? `<p style="color:#6b7280;font-size:0.875rem">${escapeHtml(f.description)}</p>` : ""}
    </div>`).join("");
  return `<section id="services" style="padding:5rem 0;background:#f9fafb">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    ${p.title ? `<h2 style="font-size:2rem;font-weight:700;text-align:center;margin-bottom:3rem;color:#1f2937">${escapeHtml(p.title as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTour(s: SiteSection): string {
  const p = s.props;
  const images: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const img = p[`image${i}`] as string;
    if (img && !isBase64Image(img)) images.push(img);
  }
  const galleryHtml = images.map(src => `<img src="${escapeHtml(src)}" alt="Studio" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:1rem" />`).join("");
  return `<section style="padding:5rem 0">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    ${p.title ? `<h2 style="font-size:2rem;font-weight:700;text-align:center;margin-bottom:3rem;color:#1f2937">${escapeHtml(p.title as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">${galleryHtml}</div>
  </div>
</section>`;
}

function renderPilatesTeachers(s: SiteSection): string {
  const p = s.props;
  const teachers = (p.teachers as Array<{ name: string; role?: string; bio?: string; image?: string }>) || [];
  const cards = teachers.map(t => {
    const rawImg = t.image || "";
    const img = isBase64Image(rawImg) ? "" : rawImg;
    return `<div style="text-align:center">
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(t.name)}" style="width:8rem;height:8rem;border-radius:50%;object-fit:cover;margin:0 auto 1rem" />` : `<div style="width:8rem;height:8rem;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:3rem;margin:0 auto 1rem">👤</div>`}
      <h3 style="font-weight:600;color:#1f2937">${escapeHtml(t.name)}</h3>
      ${t.role ? `<p style="color:#7c3aed;font-size:0.875rem;margin-bottom:0.5rem">${escapeHtml(t.role)}</p>` : ""}
      ${t.bio ? `<p style="color:#6b7280;font-size:0.875rem">${escapeHtml(t.bio)}</p>` : ""}
    </div>`;
  }).join("");
  return `<section style="padding:5rem 0;background:#f9fafb">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    ${p.title ? `<h2 style="font-size:2rem;font-weight:700;text-align:center;margin-bottom:3rem;color:#1f2937">${escapeHtml(p.title as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTestimonials(s: SiteSection): string {
  const p = s.props;
  const items = (p.testimonials as Array<{ content: string; name: string; role?: string }>) || [];
  const cards = items.map(t => `
    <div style="background:#fff;padding:2rem;border-radius:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <p style="color:#4b5563;font-style:italic;margin-bottom:1rem">"${escapeHtml(t.content)}"</p>
      <p style="font-weight:600;color:#1f2937">${escapeHtml(t.name)}</p>
      ${t.role ? `<p style="color:#7c3aed;font-size:0.875rem">${escapeHtml(t.role)}</p>` : ""}
    </div>`).join("");
  return `<section style="padding:5rem 0">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    ${p.title ? `<h2 style="font-size:2rem;font-weight:700;text-align:center;margin-bottom:3rem;color:#1f2937">${escapeHtml(p.title as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesContact(s: SiteSection): string {
  const p = s.props;
  return `<section id="contact" style="padding:5rem 0;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-align:center">
  <div style="max-width:40rem;margin:0 auto;padding:0 1.5rem">
    ${p.title ? `<h2 style="font-size:2rem;font-weight:700;margin-bottom:1rem">${escapeHtml(p.title as string)}</h2>` : ""}
    ${p.description ? `<p style="opacity:0.85;margin-bottom:2rem">${escapeHtml(p.description as string)}</p>` : ""}
    ${p.phone ? `<p style="font-size:1.25rem;font-weight:600;margin-bottom:0.5rem">${escapeHtml(p.phone as string)}</p>` : ""}
    ${p.email ? `<p style="opacity:0.8">${escapeHtml(p.email as string)}</p>` : ""}
  </div>
</section>`;
}

// ── Lawyer Template ──

function renderLawyerHeader(name: string): string {
  return `<header style="position:fixed;top:0;left:0;right:0;z-index:50;background:#1a1a2e;border-bottom:1px solid rgba(255,255,255,0.1)">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem;height:72px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-size:1.25rem;font-weight:700;color:#fff">${escapeHtml(name)}</span>
    <nav style="display:flex;gap:2rem">
      <a href="#about" style="color:#9ca3af;text-decoration:none;font-size:0.875rem">Hakkımızda</a>
      <a href="#services" style="color:#9ca3af;text-decoration:none;font-size:0.875rem">Hizmetler</a>
      <a href="#contact" style="color:#9ca3af;text-decoration:none;font-size:0.875rem">İletişim</a>
    </nav>
  </div>
</header><div style="height:72px"></div>`;
}

function renderLawyerFooter(name: string): string {
  const year = new Date().getFullYear();
  return `<footer style="background:#0d0d1a;color:#6b7280;padding:3rem 0;text-align:center">
  <p style="color:#fff;font-weight:600;margin-bottom:0.5rem">${escapeHtml(name)}</p>
  <p style="font-size:0.75rem">© ${year} ${escapeHtml(name)}. Tüm hakları saklıdır.</p>
</footer>`;
}

// ── Main renderer ──

function renderSection(section: SiteSection, projectId?: string): string {
  switch (section.type) {
    case "HeroCentered": case "hero-centered":
    case "HeroOverlay": case "hero-overlay":
    case "HeroSplit": case "hero-split":
    case "HeroMedical": case "hero-medical":
      return renderHeroCentered(section);
    case "HeroCafe": case "hero-cafe": return renderHeroCafe(section);
    case "HeroDental": case "hero-dental": return renderHeroDental(section);
    case "HeroRestaurant": case "hero-restaurant": return renderHeroRestaurant(section);
    case "HeroHotel": case "hero-hotel": return renderHeroHotel(section);
    case "HeroPortfolio": case "hero-portfolio": return renderHeroPortfolio(section);
    case "StatisticsCounter": case "statistics-counter": return renderStatisticsCounter(section);
    case "AboutSection": case "about-section": return renderAboutSection(section);
    case "ServicesGrid": case "services-grid": return renderServicesGrid(section);
    case "TestimonialsCarousel": case "testimonials-carousel": return renderTestimonialsCarousel(section);
    case "ImageGallery": case "image-gallery": return renderImageGallery(section);
    case "FAQAccordion": case "faq-accordion": return renderFAQAccordion(section);
    case "ContactForm": case "contact-form": return renderContactForm(section, projectId);
    case "CTABanner": case "cta-banner": return renderCTABanner(section);
    case "PricingTable": case "pricing-table": return renderPricingTable(section);
    case "AppointmentBooking": case "appointment-booking":
    case "DentalBooking": case "dental-booking": return renderAppointmentBooking(section);
    case "CafeFeatures": case "cafe-features": return renderCafeFeatures(section);
    case "MenuShowcase": case "menu-showcase": return renderMenuShowcase(section);
    case "CafeStory": case "cafe-story": return renderCafeStory(section);
    case "CafeGallery": case "cafe-gallery": return renderCafeGallery(section);
    case "ChefShowcase": case "chef-showcase": return renderChefShowcase(section);
    case "RestaurantMenu": case "restaurant-menu": return renderRestaurantMenu(section);
    case "RoomShowcase": case "room-showcase": return renderRoomShowcase(section);
    case "HotelAmenities": case "hotel-amenities": return renderHotelAmenities(section);
    case "SkillsGrid": case "skills-grid": return renderSkillsGrid(section);
    case "ProjectShowcase": case "project-showcase": return renderProjectShowcase(section);
    case "DentalServices": case "dental-services": return renderDentalServices(section);
    case "DentalTips": case "dental-tips": return renderDentalTips(section);
    case "AddableSiteFooter": return renderAddableSiteFooter(section);
    case "AddableBlog": return renderAddableBlog(section);
    case "AddableAppointment": return renderAppointmentBooking(section);
    case "AddableFAQ": return renderFAQAccordion(section);
    case "AddableMessageForm": return renderContactForm(section, projectId);
    case "AddableWorkingHours": case "AddableOnlineConsultation": case "AddableInsurance":
    case "AddableMenuHighlights": case "AddableRoomAvailability": case "AddableCaseEvaluation":
    case "AddableBeforeAfter": case "AddablePetRegistration": case "AddableCallUs":
    case "AddableSocialProof": case "AddableTeamGrid": case "AddablePromotionBanner":
    case "AddableVideo":
      return renderGenericAddable(section);
    case "pilates-hero": return renderPilatesHero(section);
    case "pilates-features": return renderPilatesFeatures(section);
    case "pilates-tour": return renderPilatesTour(section);
    case "pilates-teachers": return renderPilatesTeachers(section);
    case "pilates-testimonials": return renderPilatesTestimonials(section);
    case "pilates-contact": return renderPilatesContact(section);
    default:
      const text = (section.props.title as string) || (section.props.content as string) || "";
      if (text) return `<section class="py-12"><div class="max-w-4xl mx-auto px-6"><p>${escapeHtml(text)}</p></div></section>`;
      return "";
  }
}

function sectionsToHtml(sections: SiteSection[], theme: SiteTheme, projectName: string, projectId?: string, templateId?: string): string {
  const themeCssVars = buildThemeCssVars(theme);
  const fonts = theme?.fonts;
  const headingFont = fonts?.heading || "Inter";
  const bodyFont = fonts?.body || "Inter";
  const borderRadius = theme?.borderRadius || "8px";
  const isPilates = templateId === "pilates1";
  const isLawyer = templateId === "lawyer-firm";
  const allFonts = [...new Set([headingFont, bodyFont, "Playfair Display", "DM Sans", "Inter"])];
  const fontLinks = allFonts.map(f => `<link href="https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`).join("\n  ");

  let sectionsHtml = sections.map(s => renderSection(s, projectId)).filter(Boolean).join("\n");

  if (!sectionsHtml.trim()) {
    sectionsHtml = `<section class="min-h-screen flex items-center justify-center" style="background:var(--background)"><div class="text-center"><h1 class="text-4xl font-bold" style="color:var(--foreground)">${escapeHtml(projectName)}</h1><p class="mt-4" style="color:var(--muted-foreground)">Website coming soon</p></div></section>`;
  }

  if (isPilates) {
    const tagline = "Experience movement in its most authentic form.";
    sectionsHtml = renderPilatesHeader(projectName) + "\n" + sectionsHtml + "\n" + renderPilatesFooter(projectName, tagline);
  }

  if (isLawyer) {
    sectionsHtml = renderLawyerHeader(projectName) + "\n" + sectionsHtml + "\n" + renderLawyerFooter(projectName);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const trackingScript = projectId ? `<script>(function(){var p="${projectId}",u="${supabaseUrl}/functions/v1/track-analytics",a=navigator.userAgent,d=/android|iphone|ipad|mobile/i.test(a)?"mobile":"desktop",v=localStorage.getItem("ol_vid");if(!v){v="v_"+Date.now()+"_"+Math.random().toString(36).substr(2,9);localStorage.setItem("ol_vid",v)}fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project_id:p,event_type:"page_view",page_path:location.pathname,user_agent:a,device_type:d,visitor_id:v})}).catch(function(){})})()<\/script>` : "";
  const projectVarsScript = projectId ? `<script>window.__PROJECT_ID__="${projectId}";window.__SUPABASE_URL__="${supabaseUrl}";<\/script>` : "";

  const animStyles = `
    .fade-in-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
    .fade-in-up.visible { opacity: 1; transform: translateY(0); }
    ::-webkit-scrollbar { display: none; }
  `;
  const animScript = `<script>
document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in-up');var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:0.1});els.forEach(function(el){obs.observe(el)})});
<\/script>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectName)}</title>
  <meta name="description" content="${escapeHtml(projectName)} - Professional Website">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLinks}
  <style>
    :root { ${themeCssVars}; --radius: ${borderRadius}; }
    body { font-family: '${bodyFont}', sans-serif; background-color: var(--background); color: var(--foreground); margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6, .font-heading-dynamic { font-family: '${headingFont}', serif; }
    .font-body-dynamic { font-family: '${bodyFont}', sans-serif; }
    img { max-width: 100%; height: auto; }
    html { scroll-behavior: smooth; }
    ${animStyles}
  </style>
</head>
<body>
${projectVarsScript}
${sectionsHtml}
${animScript}
${trackingScript}
</body>
</html>`;
}

// ── Vercel Deploy Helpers ──

async function vercelCreateOrGetProject(name: string, token: string): Promise<string> {
  console.log(`[Vercel] Creating project: ${name}`);
  const res = await fetch("https://api.vercel.com/v11/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, framework: null }),
  });

  const data = await res.json();

  // 409 = project already exists
  if (res.status === 409 && data.error?.code === "project_already_exists") {
    console.log(`[Vercel] Project already exists, fetching by name`);
    const getRes = await fetch(`https://api.vercel.com/v11/projects/${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    return getData.id;
  }

  if (!res.ok) {
    throw new Error(`Failed to create Vercel project: ${JSON.stringify(data)}`);
  }

  return data.id;
}

async function vercelDeploy(projectId: string, projectName: string, htmlContent: string, token: string): Promise<string> {
  console.log(`[Vercel] Deploying to project: ${projectId}`);

  // Encode HTML as base64
  const encoder = new TextEncoder();
  const bytes = encoder.encode(htmlContent);
  const base64 = btoa(String.fromCharCode(...bytes));

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      files: [
        {
          file: "index.html",
          data: base64,
          encoding: "base64",
        },
      ],
      projectId: projectId,
      target: "production",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to deploy to Vercel: ${JSON.stringify(data)}`);
  }

  console.log(`[Vercel] Deployment created: ${data.url}`);
  return `https://${data.url}`;
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VERCEL_API_TOKEN = Deno.env.get("VERCEL_API_TOKEN");
    if (!VERCEL_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Vercel API token is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sections = (project.site_sections as SiteSection[]) || [];
    const theme = (project.site_theme as SiteTheme) || {};
    const html = sectionsToHtml(sections, theme, project.name, projectId, project.template_id || undefined);

    // Vercel project name (slugified)
    const slug = (project.subdomain || projectId.slice(0, 8)).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const vercelProjectName = `openlucius-${slug}`;

    let vercelProjectId = project.vercel_project_id;

    // Create Vercel project if needed
    if (!vercelProjectId) {
      vercelProjectId = await vercelCreateOrGetProject(vercelProjectName, VERCEL_API_TOKEN);
      await supabaseAdmin
        .from("projects")
        .update({ vercel_project_id: vercelProjectId })
        .eq("id", projectId);
    }

    // Deploy HTML to Vercel
    let vercelUrl: string;
    try {
      vercelUrl = await vercelDeploy(vercelProjectId, vercelProjectName, html, VERCEL_API_TOKEN);
    } catch (deployErr) {
      // Self-healing: recreate project if deploy fails
      console.warn(`[Vercel] Deploy failed, recreating project: ${deployErr}`);
      const newName = `${vercelProjectName}-${Date.now().toString(36)}`;
      vercelProjectId = await vercelCreateOrGetProject(newName, VERCEL_API_TOKEN);
      await supabaseAdmin
        .from("projects")
        .update({ vercel_project_id: vercelProjectId, vercel_url: null })
        .eq("id", projectId);
      vercelUrl = await vercelDeploy(vercelProjectId, newName, html, VERCEL_API_TOKEN);
    }

    // Check for verified custom domain and attach it to Vercel project
    const { data: verifiedDomain } = await supabaseAdmin
      .from("custom_domains")
      .select("domain")
      .eq("project_id", projectId)
      .eq("status", "verified")
      .limit(1)
      .single();

    let vercelCustomDomain = project.vercel_custom_domain;

    if (verifiedDomain?.domain && !vercelCustomDomain) {
      try {
        const domainRes = await fetch(
          `https://api.vercel.com/v9/projects/${vercelProjectId}/domains`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${VERCEL_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: verifiedDomain.domain }),
          }
        );
        if (domainRes.ok) {
          vercelCustomDomain = verifiedDomain.domain;
        } else {
          const errData = await domainRes.json();
          console.warn(`[Vercel] Domain attach failed:`, errData);
        }
      } catch (e) {
        console.error("[Vercel] Custom domain error:", e);
      }
    }

    // Update project record
    await supabaseAdmin
      .from("projects")
      .update({
        vercel_url: vercelUrl,
        vercel_custom_domain: vercelCustomDomain,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return new Response(
      JSON.stringify({
        success: true,
        vercelUrl,
        vercelCustomDomain,
        projectId: vercelProjectId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deploy error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
