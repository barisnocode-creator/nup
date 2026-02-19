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
    vars[`--${key}`] = colors[key] || fallback;
  }
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join("; ");
}

// ── Section Renderers ──

function isBase64Image(str: string): boolean {
  if (!str) return false;
  return str.startsWith("data:image/") || (str.length > 500 && /^[A-Za-z0-9+/=]+$/.test(str.substring(0, 100)));
}

function renderHeroCentered(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg 
    ? `background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, color-mix(in srgb, var(--primary) 85%, black), color-mix(in srgb, var(--primary) 40%, black))`;
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
  const rawImg = p.image as string || "";
  const img = isBase64Image(rawImg) ? "" : rawImg;
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
        <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title as string)}" class="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />
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
  const rawBg = p.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, color-mix(in srgb, var(--primary) 80%, black), color-mix(in srgb, var(--primary) 35%, black))`;
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
            <button id="appt-prev-week" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:var(--background);color:var(--foreground);display:flex;align-items:center;justify-content:center;cursor:pointer" title="Önceki hafta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span id="appt-month-label" style="font-weight:600;font-size:15px;color:var(--foreground)"></span>
            <button id="appt-next-week" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:var(--background);color:var(--foreground);display:flex;align-items:center;justify-content:center;cursor:pointer" title="Sonraki hafta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div id="appt-dates" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px"></div>
        </div>
        <div id="appt-slots-container" style="display:none;margin-bottom:24px">
          <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;color:var(--foreground)">Müsait Saatler</label>
          <div id="appt-slots" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px"></div>
          <div id="appt-slots-skeleton" style="display:none">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
              <div style="height:40px;border-radius:9999px;background:var(--muted);animation:pulse 1.5s ease-in-out infinite"></div>
              <div style="height:40px;border-radius:9999px;background:var(--muted);animation:pulse 1.5s ease-in-out infinite;animation-delay:.15s"></div>
              <div style="height:40px;border-radius:9999px;background:var(--muted);animation:pulse 1.5s ease-in-out infinite;animation-delay:.3s"></div>
            </div>
          </div>
        </div>
        <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden" aria-hidden="true">
          <input type="text" id="appt-hp" tabindex="-1" autocomplete="off">
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
<style>
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
#appt-dates button{transition:all .2s}
#appt-slots>div{transition:all .2s}
#appt-fields{transition:all .3s ease}
</style>
<script>
(function(){
  var API='${supabaseUrl}/functions/v1/book-appointment';
  var PID=window.__PROJECT_ID__;
  var selDate='',selSlot='',dur=30;
  var formFields=null,consentRequired=false,consentText='';
  var formLoadedAt='';
  var weekOffset=0;
  var unavailableDates={};
  var checkedWeeks={};
  var dayNames=['Pzr','Pzt','Sal','Çar','Per','Cum','Cmt'];
  var monthNames=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  function getWeekDates(offset){var dates=[];var today=new Date();var start=new Date(today);start.setDate(today.getDate()+1+(offset*7));for(var i=0;i<7;i++){var d=new Date(start);d.setDate(start.getDate()+i);dates.push(d)}return dates}
  function fmtDate(d){return d.toISOString().split('T')[0]}
  function setStep(n){document.querySelectorAll('.appt-step').forEach(function(el){var s=parseInt(el.dataset.step);var icon=el.querySelector('.appt-step-icon');var label=el.querySelector('.appt-step-label');if(s<=n){icon.style.background='var(--primary)';icon.style.color='var(--primary-foreground)';label.style.color='var(--primary)';label.style.fontWeight='600'}else{icon.style.background='var(--muted)';icon.style.color='var(--muted-foreground)';label.style.color='var(--muted-foreground)';label.style.fontWeight='500'}})}
  function renderDates(){var dc=document.getElementById('appt-dates');dc.innerHTML='';var dates=getWeekDates(weekOffset);var ml=document.getElementById('appt-month-label');var first=dates[0],last=dates[6];if(first.getMonth()===last.getMonth()){ml.textContent=monthNames[first.getMonth()]+' '+first.getFullYear()}else{ml.textContent=monthNames[first.getMonth()].substring(0,3)+' - '+monthNames[last.getMonth()].substring(0,3)+' '+last.getFullYear()}dates.forEach(function(d){var dt=fmtDate(d);var btn=document.createElement('button');btn.dataset.date=dt;btn.style.cssText='display:flex;flex-direction:column;align-items:center;padding:10px 4px;border-radius:12px;border:1px solid var(--border);background:var(--background);color:var(--foreground);cursor:pointer;font-size:13px;min-width:0';var dayLabel=document.createElement('span');dayLabel.style.cssText='font-size:11px;color:var(--muted-foreground);margin-bottom:4px';dayLabel.textContent=dayNames[d.getDay()];var dayNum=document.createElement('span');dayNum.style.cssText='font-size:16px;font-weight:600';dayNum.textContent=d.getDate();btn.appendChild(dayLabel);btn.appendChild(dayNum);if(selDate===dt){btn.style.background='var(--primary)';btn.style.color='var(--primary-foreground)';dayLabel.style.color='var(--primary-foreground)'}if(unavailableDates[dt]){btn.style.opacity='0.35';btn.style.pointerEvents='none';dayNum.style.textDecoration='line-through'}btn.onclick=function(){selectDate(dt)};dc.appendChild(btn)});checkWeekAvailability(weekOffset,dates);document.getElementById('appt-prev-week').style.opacity=weekOffset<=0?'0.3':'1';document.getElementById('appt-prev-week').style.pointerEvents=weekOffset<=0?'none':'auto'}
  function checkWeekAvailability(offset,dates){if(checkedWeeks[offset])return;checkedWeeks[offset]=true;var promises=dates.map(function(d){var dt=fmtDate(d);return fetch(API+'?project_id='+PID+'&date='+dt).then(function(r){return r.json()}).then(function(data){return{date:dt,available:data.slots&&data.slots.length>0}}).catch(function(){return{date:dt,available:false}})});Promise.all(promises).then(function(results){var changed=false;results.forEach(function(r){if(!r.available){unavailableDates[r.date]=true;changed=true}});if(changed)renderDates()})}
  function selectDate(dt){selDate=dt;selSlot='';setStep(1);document.getElementById('appt-fields').style.display='none';document.getElementById('appt-consent').style.display='none';document.getElementById('appt-submit').disabled=true;document.getElementById('appt-submit').style.opacity='0.4';document.getElementById('appt-submit').style.cursor='not-allowed';var dc=document.getElementById('appt-dates');dc.querySelectorAll('button').forEach(function(btn){var bdt=btn.dataset.date;if(bdt===dt){btn.style.background='var(--primary)';btn.style.color='var(--primary-foreground)';btn.querySelectorAll('span').forEach(function(s){s.style.color='var(--primary-foreground)'})}else if(!unavailableDates[bdt]){btn.style.background='var(--background)';btn.style.color='var(--foreground)';var spans=btn.querySelectorAll('span');if(spans[0])spans[0].style.color='var(--muted-foreground)';if(spans[1])spans[1].style.color='var(--foreground)'}});var sc=document.getElementById('appt-slots-container');var sl=document.getElementById('appt-slots');var sk=document.getElementById('appt-slots-skeleton');sc.style.display='block';sl.innerHTML='';sk.style.display='block';fetch(API+'?project_id='+PID+'&date='+dt).then(function(r){return r.json()}).then(function(data){sk.style.display='none';dur=data.duration||30;formFields=data.form_fields||null;consentRequired=data.consent_required||false;consentText=data.consent_text||'';if(!data.slots||data.slots.length===0){sl.innerHTML='<p style="color:var(--muted-foreground);font-size:14px;text-align:center;padding:20px 0">Bu tarihte müsait saat bulunmuyor.</p>';return}renderSlots(data.slots)}).catch(function(){sk.style.display='none';sl.innerHTML='<p style="color:#b91c1c;font-size:14px;text-align:center;padding:20px 0">Saatler yüklenirken hata oluştu.</p>'})}
  function addMinutes(t,m){var pr=t.split(':').map(Number);var total=pr[0]*60+pr[1]+m;return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0')}
  function renderSlots(slots){var sl=document.getElementById('appt-slots');sl.innerHTML='';slots.forEach(function(t){var endTime=addMinutes(t,dur);var row=document.createElement('div');row.dataset.time=t;row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;border:1px solid var(--border);background:var(--background);color:var(--foreground);cursor:pointer;font-size:14px';var timeSpan=document.createElement('span');timeSpan.style.fontWeight='500';timeSpan.textContent=t+' – '+endTime;var durSpan=document.createElement('span');durSpan.style.cssText='font-size:12px;color:var(--muted-foreground)';durSpan.textContent=dur+' dk';row.appendChild(timeSpan);row.appendChild(durSpan);row.onmouseenter=function(){if(selSlot!==t)row.style.background='var(--muted)'};row.onmouseleave=function(){if(selSlot!==t)row.style.background='var(--background)'};row.onclick=function(){selectSlot(t)};sl.appendChild(row)})}
  function selectSlot(t){selSlot=t;formLoadedAt=new Date().toISOString();setStep(3);var sl=document.getElementById('appt-slots');sl.querySelectorAll('div[data-time]').forEach(function(row){if(row.dataset.time===t){row.style.background='var(--primary)';row.style.color='var(--primary-foreground)';row.querySelectorAll('span').forEach(function(s){s.style.color='var(--primary-foreground)'})}else{row.style.background='var(--background)';row.style.color='var(--foreground)';var spans=row.querySelectorAll('span');if(spans[0])spans[0].style.color='var(--foreground)';if(spans[1])spans[1].style.color='var(--muted-foreground)'}});document.getElementById('appt-fields').style.display='block';renderDynamicFields(formFields);renderConsent();document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').style.opacity='1';document.getElementById('appt-submit').style.cursor='pointer'}
  function renderDynamicFields(fields){var fc=document.getElementById('appt-fields');fc.innerHTML='';if(!fields||!fields.length){fc.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px"><div><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">Adınız *</label><input id="appt-name" required style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="Adınızı girin"></div><div><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">E-posta *</label><input id="appt-email" type="email" required style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="E-posta adresiniz"></div></div><div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">Telefon</label><input id="appt-phone" type="tel" style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none" placeholder="Telefon numaranız"></div><div style="margin-bottom:16px"><label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)">Mesaj / Not</label><textarea id="appt-note" rows="3" style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none;resize:none" placeholder="Eklemek istediğiniz not..."></textarea></div>';return}var sorted=fields.slice().sort(function(a,b){return a.order-b.order});var sysFields=sorted.filter(function(f){return f.system});var customFields=sorted.filter(function(f){return !f.system});if(sysFields.length>0){var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px';sysFields.forEach(function(f){grid.appendChild(makeFieldEl(f))});fc.appendChild(grid)}customFields.forEach(function(f){var w=document.createElement('div');w.style.marginBottom='16px';w.appendChild(makeFieldEl(f));fc.appendChild(w)})}
  function makeFieldEl(f){var wrap=document.createElement('div');var lbl=document.createElement('label');lbl.style.cssText='display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--foreground)';lbl.textContent=f.label+(f.required?' *':'');wrap.appendChild(lbl);var inputStyle='width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--input);background:var(--background);color:var(--foreground);font-size:14px;outline:none';if(f.type==='textarea'){var ta=document.createElement('textarea');ta.id='appt-field-'+f.id;ta.name=f.id;ta.rows=3;ta.style.cssText=inputStyle+';resize:none';if(f.placeholder)ta.placeholder=f.placeholder;if(f.required)ta.required=true;wrap.appendChild(ta)}else if(f.type==='select'){var sel=document.createElement('select');sel.id='appt-field-'+f.id;sel.name=f.id;sel.style.cssText=inputStyle;if(f.required)sel.required=true;var defOpt=document.createElement('option');defOpt.value='';defOpt.textContent='Seçin...';sel.appendChild(defOpt);(f.options||[]).forEach(function(o){var opt=document.createElement('option');opt.value=o;opt.textContent=o;sel.appendChild(opt)});wrap.appendChild(sel)}else{var inp=document.createElement('input');inp.id='appt-field-'+f.id;inp.name=f.id;inp.type=f.type||'text';inp.style.cssText=inputStyle;if(f.placeholder)inp.placeholder=f.placeholder;if(f.required)inp.required=true;wrap.appendChild(inp)}return wrap}
  function renderConsent(){var cc=document.getElementById('appt-consent');cc.innerHTML='';if(!consentRequired||!consentText)return;cc.style.display='block';cc.style.marginBottom='16px';var wrap=document.createElement('div');wrap.style.cssText='display:flex;align-items:start;gap:10px';var cb=document.createElement('input');cb.type='checkbox';cb.id='appt-consent-cb';cb.style.marginTop='3px';var lbl=document.createElement('label');lbl.htmlFor='appt-consent-cb';lbl.style.cssText='font-size:13px;color:var(--muted-foreground);cursor:pointer';lbl.textContent=consentText;wrap.appendChild(cb);wrap.appendChild(lbl);cc.appendChild(wrap)}
  document.getElementById('appt-prev-week').onclick=function(){if(weekOffset>0){weekOffset--;renderDates()}};
  document.getElementById('appt-next-week').onclick=function(){weekOffset++;renderDates()};
  renderDates();
  document.getElementById('appt-submit').onclick=function(){if(!selDate||!selSlot)return;document.getElementById('appt-error').style.display='none';var hp=document.getElementById('appt-hp').value;var consentCb=document.getElementById('appt-consent-cb');if(consentRequired&&consentText&&(!consentCb||!consentCb.checked)){document.getElementById('appt-error').textContent='Gizlilik onayını kabul etmelisiniz';document.getElementById('appt-error').style.display='block';return}var payload={project_id:PID,date:selDate,start_time:selSlot,honeypot:hp||'',form_loaded_at:formLoadedAt,consent_given:consentCb?consentCb.checked:false};var formDataExtra={};if(formFields&&formFields.length){var hasError=false;formFields.forEach(function(f){if(hasError)return;var el=document.getElementById('appt-field-'+f.id);if(!el)return;var v=el.value||'';if(f.system){if(f.id==='client_name')payload.client_name=v;else if(f.id==='client_email')payload.client_email=v}else{if(f.id==='client_phone')payload.client_phone=v;else if(f.id==='client_note')payload.client_note=v;else formDataExtra[f.id]=v}if(f.required&&!v.trim()){document.getElementById('appt-error').textContent=f.label+' alanı zorunludur';document.getElementById('appt-error').style.display='block';hasError=true}});if(hasError)return}else{var nEl=document.getElementById('appt-name'),eEl=document.getElementById('appt-email');if(nEl)payload.client_name=nEl.value;if(eEl)payload.client_email=eEl.value;var pEl=document.getElementById('appt-phone');if(pEl)payload.client_phone=pEl.value||null;var ntEl=document.getElementById('appt-note');if(ntEl)payload.client_note=ntEl.value||null}if(!payload.client_name||!payload.client_email){document.getElementById('appt-error').textContent='Ad ve e-posta zorunludur';document.getElementById('appt-error').style.display='block';return}if(Object.keys(formDataExtra).length>0)payload.form_data=formDataExtra;document.getElementById('appt-submit').disabled=true;document.getElementById('appt-submit').textContent='Gönderiliyor...';document.getElementById('appt-submit').style.opacity='0.6';fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})}).then(function(res){if(res.ok){document.getElementById('appt-form-container').style.display='none';document.getElementById('appt-success').style.display='block'}else{document.getElementById('appt-error').textContent=res.data.error||'Bir hata oluştu';document.getElementById('appt-error').style.display='block';document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').textContent='${btnText}';document.getElementById('appt-submit').style.opacity='1'}}).catch(function(){document.getElementById('appt-error').textContent='Bağlantı hatası';document.getElementById('appt-error').style.display='block';document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').textContent='${btnText}';document.getElementById('appt-submit').style.opacity='1'})};
})();
<\/script>`;
}

// ── Pilates Template Renderers ──

function renderPilatesHero(s: SiteSection): string {
  const p = s.props;
  const rawBg = p.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg
    ? `background-image:url('${escapeHtml(bg)}')`
    : `background:linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))`;
  return `<section class="relative min-h-screen flex items-end overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="${bgStyle}"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to right,color-mix(in srgb, var(--primary) 60%, transparent),color-mix(in srgb, var(--primary) 20%, transparent))"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.4),transparent)"></div>
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-40">
    <div class="grid md:grid-cols-2 gap-12 items-end">
      <div class="fade-in-up">
        <h1 class="font-heading-dynamic" style="font-size:clamp(3rem,8vw,6rem);color:#fff;line-height:0.95;margin-bottom:1.5rem">${escapeHtml(p.title as string)}</h1>
        ${p.description ? `<p style="color:rgba(255,255,255,0.8);font-size:1.25rem;max-width:28rem">${escapeHtml(p.description as string)}</p>` : ""}
      </div>
      <div class="fade-in-up" style="animation-delay:0.3s">
        <div style="backdrop-filter:blur(20px);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:1rem;padding:2rem;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">
          <h3 style="color:#fff;font-size:1.25rem;font-weight:600;margin-bottom:0.5rem">${escapeHtml(p.subtitle as string || "Dönüşümünüze Başlayın")}</h3>
          <p style="color:rgba(255,255,255,0.6);font-size:0.875rem;margin-bottom:1.5rem">İlk seanstan itibaren</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem">
            <input type="text" placeholder="Ad Soyad" style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:0.5rem;color:#fff;outline:none">
            <input type="tel" placeholder="Telefon Numarası" style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:0.5rem;color:#fff;outline:none">
            <button style="width:100%;padding:0.75rem;background:var(--primary-foreground);color:var(--primary);font-weight:600;border-radius:0.5rem;border:none;cursor:pointer" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Bizi Arayın</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:10;color:rgba(255,255,255,0.7);display:flex;flex-direction:column;align-items:center;gap:0.5rem">
    <span style="font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Keşfedin</span>
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7"/></svg>
  </div>
</section>`;
}

function renderPilatesFeatures(s: SiteSection): string {
  const p = s.props;
  const services = (p.services as Array<{ title: string; description: string; image?: string }>) || [];
  const cards = services.slice(0, 3).map((sv, i) => `
    <div class="fade-in-up" style="animation-delay:${i * 0.2}s">
      <div style="overflow:hidden;border-radius:1rem;margin-bottom:1.5rem;aspect-ratio:4/5;position:relative">
        ${sv.image ? `<img src="${escapeHtml(sv.image)}" alt="${escapeHtml(sv.title)}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.7s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--primary),color-mix(in srgb, var(--primary) 70%, white))"></div>`}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.3),transparent)"></div>
      </div>
      <h3 class="font-heading-dynamic" style="font-size:1.5rem;color:var(--foreground);margin-bottom:0.5rem">${escapeHtml(sv.title)}</h3>
      <p style="color:var(--muted-foreground);font-size:0.875rem">${escapeHtml(sv.description)}</p>
    </div>`).join("");

  return `<section id="features" style="padding:6rem 0;background:var(--background)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    ${p.sectionTitle ? `<h2 class="font-heading-dynamic fade-in-up" style="font-size:clamp(1.875rem,4vw,3rem);text-align:center;color:var(--foreground);margin-bottom:4rem">${escapeHtml(p.sectionTitle as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTour(s: SiteSection): string {
  const p = s.props;
  const images: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = p[`image${i}`] as string;
    if (img && !isBase64Image(img)) images.push(img);
  }
  const captions = (p.captions as string[] | undefined) || ['Stüdyo', 'Eğitim Alanı', 'Ekipman', 'Resepsiyon', 'İç Mekan', 'Soyunma Odası', 'Uygulama Alanı', 'Giriş'];
  const cards = images.map((img, i) => `
    <div style="flex-shrink:0;width:350px;scroll-snap-align:start">
      <div style="overflow:hidden;border-radius:0.75rem;aspect-ratio:4/3">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(captions[i] || '')}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      </div>
      <h4 class="font-heading-dynamic" style="font-size:1.125rem;color:var(--background);margin-top:1rem">${escapeHtml(captions[i] || `Alan ${i+1}`)}</h4>
    </div>`).join("");

  return `<section id="tour" style="padding:6rem 0;background:var(--foreground);overflow:hidden">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem;margin-bottom:3rem">
    <h2 class="font-heading-dynamic fade-in-up" style="font-size:clamp(1.875rem,4vw,3rem);color:var(--background);margin-bottom:0.75rem">${escapeHtml(p.title as string || "Mekanımızı Keşfedin")}</h2>
    <p class="fade-in-up" style="color:color-mix(in srgb, var(--background) 60%, transparent);font-size:1.125rem">${escapeHtml(p.subtitle as string || "Stüdyomuzu deneyimleyin")}</p>
  </div>
  <div style="display:flex;gap:1.5rem;overflow-x:auto;padding:0 3rem 2rem;scroll-snap-type:x mandatory;-ms-overflow-style:none;scrollbar-width:none">${cards}</div>
</section>`;
}

function renderPilatesTeachers(s: SiteSection): string {
  const p = s.props;
  const teachers = (p.teachers as Array<{ name: string; role: string; image?: string }>) || [];
  const cards = teachers.map((t, i) => `
    <div class="fade-in-up" style="text-align:center;animation-delay:${i*0.15}s">
      <div style="overflow:hidden;border-radius:1rem;aspect-ratio:3/4;margin-bottom:1rem">
        ${t.image ? `<img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name)}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--primary),color-mix(in srgb, var(--primary) 70%, white))"></div>`}
      </div>
      <h3 class="font-heading-dynamic" style="font-size:1.125rem;color:var(--foreground)">${escapeHtml(t.name)}</h3>
      <p style="color:var(--muted-foreground);font-size:0.875rem">${escapeHtml(t.role)}</p>
    </div>`).join("");

  return `<section id="teachers" style="padding:6rem 0;background:var(--background)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="text-align:center;margin-bottom:4rem" class="fade-in-up">
      <h2 class="font-heading-dynamic" style="font-size:clamp(1.875rem,4vw,3rem);color:var(--foreground);margin-bottom:1rem">${escapeHtml(p.title as string || "Ekibimiz")}</h2>
      ${p.description ? `<p style="color:var(--muted-foreground);font-size:1.125rem;max-width:42rem;margin:0 auto">${escapeHtml(p.description as string)}</p>` : ""}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTestimonials(s: SiteSection): string {
  const p = s.props;
  const items = (p.testimonials as Array<{ name: string; role?: string; content: string }>) || [];
  const cards = items.map((t, i) => `
    <div class="fade-in-up" style="animation-delay:${i*0.2}s;background:rgba(255,255,255,0.05);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);border-radius:1rem;padding:2rem">
      <div style="display:flex;gap:0.25rem;margin-bottom:1rem">${'★★★★★'.split('').map(() => `<span style="color:var(--primary)">★</span>`).join('')}</div>
      <p style="color:color-mix(in srgb, var(--background) 80%, transparent);font-style:italic;margin-bottom:1.5rem;line-height:1.7">"${escapeHtml(t.content)}"</p>
      <p style="color:var(--primary);font-weight:600;font-size:0.875rem">${escapeHtml(t.name)}</p>
    </div>`).join("");

  return `<section id="testimonials" style="padding:6rem 0;background:var(--foreground)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <h2 class="font-heading-dynamic fade-in-up" style="font-size:clamp(1.875rem,4vw,3rem);color:var(--background);text-align:center;margin-bottom:4rem">${escapeHtml(p.sectionTitle as string || "Müşterilerimiz Ne Diyor")}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesContact(s: SiteSection): string {
  const p = s.props;
  return `<section id="contact" style="padding:6rem 0;background:var(--background)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="text-align:center;margin-bottom:4rem" class="fade-in-up">
      <h2 class="font-heading-dynamic" style="font-size:clamp(1.875rem,4vw,3rem);color:var(--foreground);margin-bottom:1rem">${escapeHtml(p.sectionTitle as string || "İletişime Geçin")}</h2>
      ${p.sectionDescription ? `<p style="color:var(--muted-foreground);font-size:1.125rem">${escapeHtml(p.sectionDescription as string)}</p>` : ""}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:4rem" class="fade-in-up">
      <div style="display:flex;flex-direction:column;gap:2rem">
        ${p.address ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:color-mix(in srgb, var(--primary) 10%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0">📍</div><div><h4 style="font-weight:600;color:var(--foreground);margin-bottom:0.25rem">Adres</h4><p style="color:var(--muted-foreground)">${escapeHtml(p.address as string)}</p></div></div>` : ""}
        ${p.phone ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:color-mix(in srgb, var(--primary) 10%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0">📞</div><div><h4 style="font-weight:600;color:var(--foreground);margin-bottom:0.25rem">Telefon</h4><p style="color:var(--muted-foreground)">${escapeHtml(p.phone as string)}</p></div></div>` : ""}
        ${p.email ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:color-mix(in srgb, var(--primary) 10%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0">📧</div><div><h4 style="font-weight:600;color:var(--foreground);margin-bottom:0.25rem">E-posta</h4><p style="color:var(--muted-foreground)">${escapeHtml(p.email as string)}</p></div></div>` : ""}
      </div>
      <div style="background:var(--card);border-radius:1rem;padding:2rem;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);border:1px solid var(--border)">
        <form onsubmit="event.preventDefault();alert('Mesajınız gönderildi!')" style="display:flex;flex-direction:column;gap:1rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <input type="text" placeholder="Adınız" style="padding:0.75rem 1rem;background:var(--muted);border:1px solid var(--border);border-radius:0.5rem;color:var(--foreground);outline:none" required>
            <input type="text" placeholder="Soyadınız" style="padding:0.75rem 1rem;background:var(--muted);border:1px solid var(--border);border-radius:0.5rem;color:var(--foreground);outline:none" required>
          </div>
          <input type="email" placeholder="E-posta" style="padding:0.75rem 1rem;background:var(--muted);border:1px solid var(--border);border-radius:0.5rem;color:var(--foreground);outline:none" required>
          <textarea placeholder="Mesajınız" rows="4" style="padding:0.75rem 1rem;background:var(--muted);border:1px solid var(--border);border-radius:0.5rem;color:var(--foreground);outline:none;resize:none" required></textarea>
          <button type="submit" style="padding:0.75rem;background:var(--primary);color:var(--primary-foreground);font-weight:600;border-radius:0.5rem;border:none;cursor:pointer" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Mesaj Gönder</button>
        </form>
      </div>
    </div>
  </div>
</section>`;
}

function renderPilatesHeader(siteName: string): string {
  return `<header id="pilates-header" style="position:fixed;top:0;left:0;right:0;z-index:50;transition:all 0.5s;background:transparent">
  <div style="max-width:80rem;margin:0 auto;padding:1rem 3rem;display:flex;align-items:center;justify-content:between">
    <div style="display:flex;align-items:center;gap:0.75rem">
      <div style="width:2rem;height:2rem;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center"><div style="width:0.75rem;height:0.75rem;border-radius:50%;background:#fff"></div></div>
      <span class="font-heading-dynamic" style="font-size:1.125rem;color:#fff;letter-spacing:0.05em">${escapeHtml(siteName)}</span>
    </div>
    <nav style="display:flex;align-items:center;gap:2rem;margin-left:auto">
      <a href="#features" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Neden Biz</a>
      <a href="#tour" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Mekanımız</a>
      <a href="#teachers" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Ekibimiz</a>
      <a href="#testimonials" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Yorumlar</a>
      <a href="#contact" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">İletişim</a>
    </nav>
  </div>
</header>
<script>
window.addEventListener('scroll',function(){var h=document.getElementById('pilates-header');if(window.scrollY>50){h.style.background='color-mix(in srgb, var(--background) 95%, transparent)';h.style.backdropFilter='blur(12px)';h.querySelectorAll('a,span').forEach(function(e){e.style.color='var(--foreground)'})}else{h.style.background='transparent';h.style.backdropFilter='none';h.querySelectorAll('a,span').forEach(function(e){e.style.color='rgba(255,255,255,0.9)'})}});
<\/script>`;
}

function renderPilatesFooter(siteName: string, tagline: string): string {
  return `<footer style="background:var(--foreground);padding:4rem 0;border-top:1px solid rgba(255,255,255,0.1)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
      <div style="width:2rem;height:2rem;border-radius:50%;border:2px solid var(--primary);display:flex;align-items:center;justify-content:center"><div style="width:0.75rem;height:0.75rem;border-radius:50%;background:var(--primary)"></div></div>
      <span class="font-heading-dynamic" style="font-size:1.25rem;color:var(--background)">${escapeHtml(siteName)}</span>
    </div>
    <p style="color:color-mix(in srgb, var(--background) 50%, transparent);font-size:0.875rem;max-width:24rem;margin-bottom:2rem">${escapeHtml(tagline)}</p>
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
      <p style="color:color-mix(in srgb, var(--background) 30%, transparent);font-size:0.75rem">© ${new Date().getFullYear()} ${escapeHtml(siteName)}. Tüm hakları saklıdır.</p>
      <div style="display:flex;gap:1.5rem">
        <a href="#" style="color:color-mix(in srgb, var(--background) 30%, transparent);font-size:0.75rem;text-decoration:none">Gizlilik Politikası</a>
        <a href="#" style="color:color-mix(in srgb, var(--background) 30%, transparent);font-size:0.75rem;text-decoration:none">Kullanım Koşulları</a>
      </div>
    </div>
  </div>
</footer>`;
}

// ── Lawyer Template Renderers ──

function renderLawyerHeader(siteName: string): string {
  return `<header id="lawyer-header" style="position:fixed;top:0;left:0;right:0;z-index:50;transition:all 0.5s;background:transparent">
  <div style="max-width:80rem;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between">
    <span class="font-heading-dynamic" style="font-size:1.125rem;color:#fff;font-weight:700">${escapeHtml(siteName)}</span>
    <nav style="display:flex;align-items:center;gap:2rem">
      <a href="#about" style="color:rgba(255,255,255,0.85);font-size:0.875rem;text-decoration:none;transition:opacity 0.3s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Hakkımızda</a>
      <a href="#practice" style="color:rgba(255,255,255,0.85);font-size:0.875rem;text-decoration:none;transition:opacity 0.3s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Alanlar</a>
      <a href="#team" style="color:rgba(255,255,255,0.85);font-size:0.875rem;text-decoration:none;transition:opacity 0.3s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Ekip</a>
      <a href="#contact" style="color:rgba(255,255,255,0.85);font-size:0.875rem;text-decoration:none;transition:opacity 0.3s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">İletişim</a>
    </nav>
  </div>
</header>
<script>
window.addEventListener('scroll',function(){var h=document.getElementById('lawyer-header');if(window.scrollY>50){h.style.background='rgba(0,0,0,0.85)';h.style.backdropFilter='blur(12px)'}else{h.style.background='transparent';h.style.backdropFilter='none'}});
<\/script>`;
}

function renderLawyerFooter(siteName: string): string {
  return `<footer style="background:#000;padding:4rem 1.5rem;border-top:1px solid #262626">
  <div style="max-width:72rem;margin:0 auto">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;margin-bottom:3rem">
      <div>
        <h3 class="font-heading-dynamic" style="font-size:1.25rem;color:#fff;font-weight:700;margin-bottom:1rem">${escapeHtml(siteName)}</h3>
        <p style="font-size:0.875rem;color:#737373;line-height:1.6">Adalet ve güven ile 30 yılı aşkın hukuki deneyim.</p>
      </div>
      <div>
        <h4 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#a3a3a3;margin-bottom:1rem">Hızlı Bağlantılar</h4>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          <a href="#about" style="font-size:0.875rem;color:#737373;text-decoration:none">Hakkımızda</a>
          <a href="#practice" style="font-size:0.875rem;color:#737373;text-decoration:none">Uygulama Alanları</a>
          <a href="#team" style="font-size:0.875rem;color:#737373;text-decoration:none">Ekibimiz</a>
          <a href="#contact" style="font-size:0.875rem;color:#737373;text-decoration:none">İletişim</a>
        </div>
      </div>
      <div>
        <h4 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#a3a3a3;margin-bottom:1rem">İletişim</h4>
        <div style="font-size:0.875rem;color:#737373;display:flex;flex-direction:column;gap:0.5rem">
          <span>📞 +90 212 555 0000</span>
          <span>📧 info@chambers.com.tr</span>
          <span>📍 Levent, İstanbul</span>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid #262626;padding-top:2rem;display:flex;justify-content:space-between;align-items:center">
      <p style="font-size:0.75rem;color:#525252">© ${new Date().getFullYear()} ${escapeHtml(siteName)}. Tüm hakları saklıdır.</p>
      <div style="display:flex;gap:1.5rem">
        <a href="#" style="font-size:0.75rem;color:#525252;text-decoration:none">Gizlilik Politikası</a>
        <a href="#" style="font-size:0.75rem;color:#525252;text-decoration:none">Kullanım Şartları</a>
      </div>
    </div>
  </div>
</footer>`;
}

// ── Main renderer ──

function renderSection(section: SiteSection, projectId?: string): string {
  switch (section.type) {
    case "hero-centered":
    case "hero-overlay":
    case "hero-split":
      return renderHeroCentered(section);
    case "statistics-counter":
      return renderStatisticsCounter(section);
    case "about-section":
      return renderAboutSection(section);
    case "services-grid":
      return renderServicesGrid(section);
    case "testimonials-carousel":
      return renderTestimonialsCarousel(section);
    case "image-gallery":
      return renderImageGallery(section);
    case "faq-accordion":
      return renderFAQAccordion(section);
    case "contact-form":
      return renderContactForm(section, projectId);
    case "cta-banner":
      return renderCTABanner(section);
    case "pricing-table":
      return renderPricingTable(section);
    case "appointment-booking":
      return renderAppointmentBooking(section);
    // Pilates template types
    case "pilates-hero":
      return renderPilatesHero(section);
    case "pilates-features":
      return renderPilatesFeatures(section);
    case "pilates-tour":
      return renderPilatesTour(section);
    case "pilates-teachers":
      return renderPilatesTeachers(section);
    case "pilates-testimonials":
      return renderPilatesTestimonials(section);
    case "pilates-contact":
      return renderPilatesContact(section);
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

// ── Deploy payload ──

async function createDeployPayload(htmlContent: string): Promise<{ sha1: string; content: Uint8Array }> {
  const encoder = new TextEncoder();
  const content = encoder.encode(htmlContent);
  const hashBuffer = await crypto.subtle.digest("SHA-1", content);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha1 = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { sha1, content };
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NETLIFY_API_TOKEN = Deno.env.get("NETLIFY_API_TOKEN");
    if (!NETLIFY_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Netlify API token is not configured" }),
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

    // Use site_sections and site_theme only
    const sections = (project.site_sections as SiteSection[]) || [];
    const theme = (project.site_theme as SiteTheme) || {};

    const html = sectionsToHtml(sections, theme, project.name, projectId, project.template_id || undefined);
    const { sha1, content } = await createDeployPayload(html);

    let netlifySiteId = project.netlify_site_id;

    // Create site if needed
    if (!netlifySiteId) {
      const createRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `openlucius-${project.subdomain || projectId.slice(0, 8)}`,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Netlify create site error:", errText);
        return new Response(
          JSON.stringify({ error: "Failed to create Netlify site", details: errText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const siteData = await createRes.json();
      netlifySiteId = siteData.id;

      await supabaseAdmin
        .from("projects")
        .update({ netlify_site_id: netlifySiteId, netlify_url: siteData.ssl_url || siteData.url })
        .eq("id", projectId);
    }

    // Deploy
    let deployRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: { "/index.html": sha1 } }),
      }
    );

    // Self-healing: if site was deleted/lost, create a new one and retry
    if (deployRes.status === 404) {
      console.warn("Netlify site not found (404), creating a new site...");
      
      await supabaseAdmin
        .from("projects")
        .update({ netlify_site_id: null, netlify_url: null })
        .eq("id", projectId);

      const createRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `openlucius-${project.subdomain || projectId.slice(0, 8)}-${Date.now().toString(36)}`,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Netlify re-create site error:", errText);
        return new Response(
          JSON.stringify({ error: "Failed to re-create Netlify site", details: errText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newSiteData = await createRes.json();
      netlifySiteId = newSiteData.id;

      await supabaseAdmin
        .from("projects")
        .update({ netlify_site_id: netlifySiteId, netlify_url: newSiteData.ssl_url || newSiteData.url })
        .eq("id", projectId);

      deployRes = await fetch(
        `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: { "/index.html": sha1 } }),
        }
      );
    }

    if (!deployRes.ok) {
      const errText = await deployRes.text();
      console.error("Netlify deploy error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to deploy to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deployData = await deployRes.json();
    const deployId = deployData.id;

    // Upload file
    const uploadRes = await fetch(
      `https://api.netlify.com/api/v1/deploys/${deployId}/files/index.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: content,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Netlify file upload error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to upload file to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get final URL
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${netlifySiteId}`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });
    const siteInfo = await siteRes.json();
    const netlifyUrl = siteInfo.ssl_url || siteInfo.url;

    // Check for verified custom domain
    const { data: verifiedDomain } = await supabaseAdmin
      .from("custom_domains")
      .select("domain")
      .eq("project_id", projectId)
      .eq("status", "verified")
      .limit(1)
      .single();

    let netlifyCustomDomain = project.netlify_custom_domain;

    if (verifiedDomain?.domain && !netlifyCustomDomain) {
      try {
        const domainRes = await fetch(
          `https://api.netlify.com/api/v1/sites/${netlifySiteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ custom_domain: verifiedDomain.domain }),
          }
        );
        if (domainRes.ok) {
          netlifyCustomDomain = verifiedDomain.domain;
        }
      } catch (e) {
        console.error("Custom domain error:", e);
      }
    }

    // Update project
    await supabaseAdmin
      .from("projects")
      .update({
        netlify_url: netlifyUrl,
        netlify_custom_domain: netlifyCustomDomain,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return new Response(
      JSON.stringify({
        success: true,
        netlifyUrl,
        netlifyCustomDomain,
        siteId: netlifySiteId,
        deployId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deploy error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
