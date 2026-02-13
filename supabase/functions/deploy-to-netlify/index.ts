import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChaiBlock {
  _id: string;
  _type: string;
  [key: string]: unknown;
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

function extractThemeColor(colors: Record<string, unknown>, key: string, fallback: string, index = 0): string {
  const val = colors?.[key];
  if (Array.isArray(val) && val[index]) return val[index];
  if (typeof val === "string") return val;
  return fallback;
}

function buildThemeCssVars(theme: Record<string, unknown>): string {
  const colors = (theme?.colors || {}) as Record<string, unknown>;
  const vars: Record<string, string> = {
    "--background": extractThemeColor(colors, "background", "#ffffff"),
    "--foreground": extractThemeColor(colors, "foreground", "#1a1a1a"),
    "--primary": extractThemeColor(colors, "primary", "#f97316"),
    "--primary-foreground": extractThemeColor(colors, "primary-foreground", "#ffffff"),
    "--secondary": extractThemeColor(colors, "secondary", "#f4f4f5"),
    "--secondary-foreground": extractThemeColor(colors, "secondary-foreground", "#4a4a4a"),
    "--muted": extractThemeColor(colors, "muted", "#f4f4f5"),
    "--muted-foreground": extractThemeColor(colors, "muted-foreground", "#737373"),
    "--accent": extractThemeColor(colors, "accent", "#f97316"),
    "--accent-foreground": extractThemeColor(colors, "accent-foreground", "#ffffff"),
    "--border": extractThemeColor(colors, "border", "#e5e5e5"),
    "--input": extractThemeColor(colors, "input", "#e5e5e5"),
    "--ring": extractThemeColor(colors, "ring", "#f97316"),
    "--card": extractThemeColor(colors, "card", "#ffffff"),
    "--card-foreground": extractThemeColor(colors, "card-foreground", "#1a1a1a"),
  };
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join("; ");
}

// ── Block Renderers ──

// Check if a string is base64 image data (should be skipped)
function isBase64Image(str: string): boolean {
  if (!str) return false;
  return str.startsWith("data:image/") || (str.length > 500 && /^[A-Za-z0-9+/=]+$/.test(str.substring(0, 100)));
}

function renderHeroCentered(b: ChaiBlock): string {
  const rawBg = b.backgroundImage as string || "";
  // Skip base64 images - use gradient-only fallback
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg 
    ? `background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, color-mix(in srgb, var(--primary) 85%, black), color-mix(in srgb, var(--primary) 40%, black))`;
  return `<section class="relative min-h-[80vh] flex items-center justify-center text-center text-white" style="${bgStyle}">
  <div class="max-w-3xl mx-auto px-6 py-20">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">${escapeHtml(b.title as string)}</h1>
    ${b.subtitle ? `<p class="text-lg md:text-xl opacity-90 mb-4">${escapeHtml(b.subtitle as string)}</p>` : ""}
    ${b.description ? `<p class="text-base opacity-80 mb-8 max-w-2xl mx-auto">${escapeHtml(b.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${b.primaryButtonText ? `<a href="${escapeHtml(b.primaryButtonLink as string || '#')}" style="background:var(--primary);color:var(--primary-foreground)" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition">${escapeHtml(b.primaryButtonText as string)}</a>` : ""}
      ${b.secondaryButtonText ? `<a href="${escapeHtml(b.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(b.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderStatisticsCounter(b: ChaiBlock): string {
  const stats: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const val = b[`stat${i}Value`] as string;
    const label = b[`stat${i}Label`] as string;
    if (val && label) {
      stats.push(`<div class="text-center"><div class="text-3xl md:text-4xl font-bold" style="color:var(--primary)">${escapeHtml(val)}</div><div class="text-sm mt-1" style="color:var(--muted-foreground)">${escapeHtml(label)}</div></div>`);
    }
  }
  return `<section class="py-16" style="background:var(--muted)">
  <div class="max-w-5xl mx-auto px-6">
    ${b.title ? `<h2 class="text-2xl font-bold text-center mb-8" style="color:var(--foreground)">${escapeHtml(b.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">${stats.join("")}</div>
  </div>
</section>`;
}

function renderAboutSection(b: ChaiBlock): string {
  const rawImg = b.image as string || "";
  const img = isBase64Image(rawImg) ? "" : rawImg;
  const features = (b.features as string || "").split("\n").filter(Boolean);
  const featuresHtml = features.map(f => `<li class="flex items-center gap-2"><span style="color:var(--primary)">✓</span> ${escapeHtml(f)}</li>`).join("");
  const isRight = (b.imagePosition as string) === "right";

  return `<section id="about" class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider mb-2" style="color:var(--primary)">${escapeHtml(b.subtitle as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12 items-center ${isRight ? "" : ""}">
      <div class="${isRight ? "order-1" : "order-2 md:order-1"}">
        <h2 class="text-3xl font-bold mb-6" style="color:var(--foreground)">${escapeHtml(b.title as string)}</h2>
        <div class="leading-relaxed mb-6 whitespace-pre-line" style="color:var(--muted-foreground)">${nl2br(b.description as string)}</div>
        ${featuresHtml ? `<ul class="space-y-2">${featuresHtml}</ul>` : ""}
      </div>
      <div class="${isRight ? "order-2" : "order-1 md:order-2"}">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(b.title as string)}" class="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />
      </div>
    </div>
  </div>
</section>`;
}

function renderServicesGrid(b: ChaiBlock): string {
  const services = (b.services as Array<{ title: string; description: string; image?: string; icon?: string }>) || [];
  const cards = services.map(s => `
    <div class="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition" style="background:var(--card)">
      ${s.image ? `<img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}" class="w-full h-48 object-cover" />` : ""}
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-2" style="color:var(--card-foreground)">${escapeHtml(s.title)}</h3>
        <p class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(s.description)}</p>
      </div>
    </div>`).join("");

  return `<section id="services" class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4" style="color:var(--foreground)">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    ${b.sectionDescription ? `<p class="text-center max-w-2xl mx-auto mb-12" style="color:var(--muted-foreground)">${escapeHtml(b.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderTestimonialsCarousel(b: ChaiBlock): string {
  const items = (b.testimonials as Array<{ name: string; role: string; content: string }>) || [];
  const cards = items.map(t => `
    <div class="rounded-xl p-6 shadow-md" style="background:var(--card)">
      <p class="italic mb-4" style="color:var(--muted-foreground)">"${escapeHtml(t.content)}"</p>
      <div class="font-semibold" style="color:var(--card-foreground)">${escapeHtml(t.name)}</div>
      <div class="text-sm" style="color:var(--muted-foreground)">${escapeHtml(t.role)}</div>
    </div>`).join("");

  return `<section class="py-20" style="background:var(--background)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12" style="color:var(--foreground)">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderImageGallery(b: ChaiBlock): string {
  const images: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = b[`image${i}`] as string;
    if (img) images.push(img);
  }
  const cols = b.columns as string || "3";
  const gridCols = cols === "2" ? "md:grid-cols-2" : cols === "4" ? "md:grid-cols-4" : "md:grid-cols-3";
  const imgHtml = images.map(src => `<img src="${escapeHtml(src)}" alt="Galeri" class="rounded-lg w-full aspect-square object-cover hover:scale-105 transition duration-300" />`).join("");

  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.subtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(b.subtitle as string)}</p>` : ""}
    ${b.title ? `<h2 class="text-3xl font-bold text-center mb-12" style="color:var(--foreground)">${escapeHtml(b.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 ${gridCols} gap-4">${imgHtml}</div>
  </div>
</section>`;
}

function renderFAQAccordion(b: ChaiBlock): string {
  const items = (b.items as Array<{ question: string; answer: string }>) || [];
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
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12" style="color:var(--foreground)">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div>${faqHtml}</div>
  </div>
</section>`;
}

function renderContactForm(b: ChaiBlock): string {
  return `<section id="contact" class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold uppercase tracking-wider text-center mb-2" style="color:var(--primary)">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4" style="color:var(--foreground)">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    ${b.sectionDescription ? `<p class="text-center max-w-2xl mx-auto mb-12" style="color:var(--muted-foreground)">${escapeHtml(b.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12">
      <div class="space-y-6">
        ${b.phone ? `<div class="flex items-center gap-3"><span class="text-2xl">📞</span><div><div class="text-sm" style="color:var(--muted-foreground)">Telefon</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(b.phone as string)}</div></div></div>` : ""}
        ${b.email ? `<div class="flex items-center gap-3"><span class="text-2xl">📧</span><div><div class="text-sm" style="color:var(--muted-foreground)">E-posta</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(b.email as string)}</div></div></div>` : ""}
        ${b.address ? `<div class="flex items-center gap-3"><span class="text-2xl">📍</span><div><div class="text-sm" style="color:var(--muted-foreground)">Adres</div><div class="font-medium" style="color:var(--foreground)">${escapeHtml(b.address as string)}</div></div></div>` : ""}
      </div>
      <form class="space-y-4" onsubmit="event.preventDefault();alert('Mesajınız alındı!')">
        <input type="text" placeholder="Adınız" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required />
        <input type="email" placeholder="E-posta" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required />
        <textarea placeholder="Mesajınız" rows="4" class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style="border:1px solid var(--border);background:var(--background);color:var(--foreground)" required></textarea>
        <button type="submit" class="w-full px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="background:var(--primary);color:var(--primary-foreground)">${escapeHtml((b.submitButtonText as string) || "Gönder")}</button>
      </form>
    </div>
  </div>
</section>`;
}

function renderCTABanner(b: ChaiBlock): string {
  const rawBg = b.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg
    ? `background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('${escapeHtml(bg)}') center/cover no-repeat`
    : `background:linear-gradient(135deg, color-mix(in srgb, var(--primary) 80%, black), color-mix(in srgb, var(--primary) 35%, black))`;
  return `<section class="relative py-20 text-white text-center" style="${bgStyle}">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">${escapeHtml(b.title as string)}</h2>
    ${b.description ? `<p class="text-lg opacity-90 mb-8">${escapeHtml(b.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${b.buttonText ? `<a href="${escapeHtml(b.buttonLink as string || '#')}" class="px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition" style="background:var(--primary);color:var(--primary-foreground)">${escapeHtml(b.buttonText as string)}</a>` : ""}
      ${b.secondaryButtonText ? `<a href="${escapeHtml(b.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(b.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderPricingTable(b: ChaiBlock): string {
  const plans = (b.plans as Array<{ name: string; price: string; period?: string; features?: string; buttonText?: string; highlighted?: boolean }>) || [];
  const cards = plans.map(p => {
    const features = (p.features || "").split("\n").filter(Boolean);
    const featList = features.map(f => `<li class="flex items-center gap-2 py-1"><span style="color:var(--primary)">✓</span>${escapeHtml(f)}</li>`).join("");
    return `<div class="rounded-xl p-8 shadow-md" style="background:var(--card);${p.highlighted ? 'ring:2px solid var(--primary);box-shadow:0 0 0 2px var(--primary)' : ''}">
      <h3 class="text-xl font-bold mb-2" style="color:var(--card-foreground)">${escapeHtml(p.name)}</h3>
      <div class="text-3xl font-bold mb-1" style="color:var(--primary)">${escapeHtml(p.price)}</div>
      ${p.period ? `<div class="text-sm mb-6" style="color:var(--muted-foreground)">${escapeHtml(p.period)}</div>` : '<div class="mb-6"></div>'}
      <ul class="space-y-1 mb-8 text-sm">${featList}</ul>
      <a href="#contact" class="block text-center px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition" style="${p.highlighted ? 'background:var(--primary);color:var(--primary-foreground)' : 'background:var(--muted);color:var(--foreground)'}">${escapeHtml(p.buttonText || 'Seç')}</a>
    </div>`;
  }).join("");

  return `<section class="py-20" style="background:var(--muted)">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12" style="color:var(--foreground)">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderAppointmentBooking(b: ChaiBlock): string {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const title = escapeHtml(b.sectionTitle as string || "Randevu Alın");
  const subtitle = b.sectionSubtitle ? `<span class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style="background:color-mix(in srgb, var(--primary) 10%, transparent);color:var(--primary)">${escapeHtml(b.sectionSubtitle as string)}</span>` : "";
  const desc = b.sectionDescription ? `<p class="max-w-2xl mx-auto mt-4" style="color:var(--muted-foreground)">${escapeHtml(b.sectionDescription as string)}</p>` : "";
  const btnText = escapeHtml(b.submitButtonText as string || "Randevu Oluştur");
  const successMsg = escapeHtml(b.successMessage as string || "Randevunuz başarıyla oluşturuldu!");

  return `<section id="appointment" class="py-20" style="background:var(--muted)">
  <div class="max-w-2xl mx-auto px-6">
    <div class="text-center mb-12">
      ${subtitle}
      <h2 class="text-3xl font-bold" style="color:var(--foreground)">${title}</h2>
      ${desc}
    </div>
    <div class="p-8 rounded-2xl" style="background:var(--card);border:1px solid var(--border)">
      <div id="appt-form-container">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-3" style="color:var(--foreground)">📅 Tarih Seçin</label>
            <div id="appt-dates" class="flex gap-2 flex-wrap max-h-32 overflow-y-auto"></div>
          </div>
          <div id="appt-slots-container" style="display:none">
            <label class="block text-sm font-medium mb-3" style="color:var(--foreground)">🕐 Saat Seçin</label>
            <div id="appt-slots" class="flex gap-2 flex-wrap"></div>
          </div>
          <!-- Honeypot -->
          <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden" aria-hidden="true">
            <input type="text" id="appt-hp" tabindex="-1" autocomplete="off">
          </div>
          <div id="appt-fields" style="display:none"></div>
          <div id="appt-consent" style="display:none"></div>
          <div id="appt-error" style="display:none" class="p-3 rounded-lg text-sm" style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c"></div>
          <button id="appt-submit" disabled class="w-full px-6 py-4 rounded-lg font-medium transition opacity-50 cursor-not-allowed" style="background:var(--primary);color:var(--primary-foreground)">${btnText}</button>
        </div>
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
  var formLoadedAt='';
  var dates=[];
  var today=new Date();
  for(var i=1;i<=30;i++){var d=new Date(today);d.setDate(today.getDate()+i);dates.push(d.toISOString().split('T')[0])}
  var dc=document.getElementById('appt-dates');
  function renderDynamicFields(fields){
    var fc=document.getElementById('appt-fields');
    fc.innerHTML='';
    if(!fields||!fields.length){
      fc.innerHTML='<div class="grid sm:grid-cols-2 gap-4 mb-4"><div><label class="block text-sm font-medium mb-2" style="color:var(--foreground)">Adınız *</label><input id="appt-name" required class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--input);background:var(--background);color:var(--foreground)" placeholder="Adınızı girin"></div><div><label class="block text-sm font-medium mb-2" style="color:var(--foreground)">E-posta *</label><input id="appt-email" type="email" required class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--input);background:var(--background);color:var(--foreground)" placeholder="E-posta adresiniz"></div></div><div class="mb-4"><label class="block text-sm font-medium mb-2" style="color:var(--foreground)">Telefon</label><input id="appt-phone" type="tel" class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--input);background:var(--background);color:var(--foreground)" placeholder="Telefon numaranız"></div><div class="mb-4"><label class="block text-sm font-medium mb-2" style="color:var(--foreground)">Not</label><textarea id="appt-note" rows="3" class="w-full px-4 py-3 rounded-lg resize-none" style="border:1px solid var(--input);background:var(--background);color:var(--foreground)" placeholder="Eklemek istediğiniz not..."></textarea></div>';
      return;
    }
    var sorted=fields.slice().sort(function(a,b){return a.order-b.order});
    var sysFields=sorted.filter(function(f){return f.system});
    var customFields=sorted.filter(function(f){return !f.system});
    if(sysFields.length>0){
      var grid=document.createElement('div');grid.className='grid sm:grid-cols-2 gap-4 mb-4';
      sysFields.forEach(function(f){grid.appendChild(makeFieldEl(f))});
      fc.appendChild(grid);
    }
    customFields.forEach(function(f){var w=document.createElement('div');w.className='mb-4';w.appendChild(makeFieldEl(f));fc.appendChild(w)});
  }
  function makeFieldEl(f){
    var wrap=document.createElement('div');
    var lbl=document.createElement('label');lbl.className='block text-sm font-medium mb-2';lbl.style.color='var(--foreground)';
    lbl.textContent=f.label+(f.required?' *':'');wrap.appendChild(lbl);
    var inputStyle='border:1px solid var(--input);background:var(--background);color:var(--foreground)';
    if(f.type==='textarea'){
      var ta=document.createElement('textarea');ta.id='appt-field-'+f.id;ta.name=f.id;ta.rows=3;
      ta.className='w-full px-4 py-3 rounded-lg resize-none';ta.style.cssText=inputStyle;
      if(f.placeholder)ta.placeholder=f.placeholder;if(f.required)ta.required=true;wrap.appendChild(ta);
    }else if(f.type==='select'){
      var sel=document.createElement('select');sel.id='appt-field-'+f.id;sel.name=f.id;
      sel.className='w-full px-4 py-3 rounded-lg';sel.style.cssText=inputStyle;
      if(f.required)sel.required=true;
      var defOpt=document.createElement('option');defOpt.value='';defOpt.textContent='Seçin...';sel.appendChild(defOpt);
      (f.options||[]).forEach(function(o){var opt=document.createElement('option');opt.value=o;opt.textContent=o;sel.appendChild(opt)});
      wrap.appendChild(sel);
    }else{
      var inp=document.createElement('input');inp.id='appt-field-'+f.id;inp.name=f.id;inp.type=f.type||'text';
      inp.className='w-full px-4 py-3 rounded-lg';inp.style.cssText=inputStyle;
      if(f.placeholder)inp.placeholder=f.placeholder;if(f.required)inp.required=true;wrap.appendChild(inp);
    }
    return wrap;
  }
  function renderConsent(){
    var cc=document.getElementById('appt-consent');
    cc.innerHTML='';
    if(!consentRequired||!consentText)return;
    cc.style.display='block';
    var wrap=document.createElement('div');wrap.className='flex items-start gap-3';
    var cb=document.createElement('input');cb.type='checkbox';cb.id='appt-consent-cb';cb.style.marginTop='4px';
    var lbl=document.createElement('label');lbl.htmlFor='appt-consent-cb';lbl.className='text-sm';
    lbl.style.color='var(--muted-foreground)';lbl.style.cursor='pointer';lbl.textContent=consentText;
    wrap.appendChild(cb);wrap.appendChild(lbl);cc.appendChild(wrap);
  }
  dates.forEach(function(dt){
    var dd=new Date(dt+'T00:00:00');
    var label=dd.toLocaleDateString('tr-TR',{day:'numeric',month:'short',weekday:'short'});
    var btn=document.createElement('button');
    btn.textContent=label;btn.dataset.date=dt;
    btn.className='px-3 py-2 rounded-lg text-sm transition';
    btn.style.cssText='border:1px solid var(--border);color:var(--foreground);background:var(--background)';
    btn.onclick=function(){
      selDate=dt;selSlot='';
      dc.querySelectorAll('button').forEach(function(b){b.style.background='var(--background)';b.style.color='var(--foreground)'});
      btn.style.background='var(--primary)';btn.style.color='var(--primary-foreground)';
      document.getElementById('appt-fields').style.display='none';
      document.getElementById('appt-consent').style.display='none';
      document.getElementById('appt-submit').disabled=true;
      document.getElementById('appt-submit').style.opacity='0.5';
      fetch(API+'?project_id='+PID+'&date='+dt).then(function(r){return r.json()}).then(function(data){
        var sc=document.getElementById('appt-slots-container');
        var sl=document.getElementById('appt-slots');
        sl.innerHTML='';dur=data.duration||30;
        formFields=data.form_fields||null;
        consentRequired=data.consent_required||false;
        consentText=data.consent_text||'';
        if(!data.slots||data.slots.length===0){sl.innerHTML='<p style="color:var(--muted-foreground)" class="text-sm">Bu tarihte müsait saat yok.</p>';sc.style.display='block';return}
        data.slots.forEach(function(t){
          var sb=document.createElement('button');sb.textContent=t;sb.dataset.time=t;
          sb.className='px-4 py-2 rounded-lg text-sm transition';
          sb.style.cssText='border:1px solid var(--border);color:var(--foreground);background:var(--background)';
          sb.onclick=function(){
            selSlot=t;formLoadedAt=new Date().toISOString();
            sl.querySelectorAll('button').forEach(function(b){b.style.background='var(--background)';b.style.color='var(--foreground)'});
            sb.style.background='var(--primary)';sb.style.color='var(--primary-foreground)';
            document.getElementById('appt-fields').style.display='block';
            renderDynamicFields(formFields);
            renderConsent();
            document.getElementById('appt-submit').disabled=false;
            document.getElementById('appt-submit').style.opacity='1';
            document.getElementById('appt-submit').style.cursor='pointer';
          };
          sl.appendChild(sb);
        });
        sc.style.display='block';
      });
    };
    dc.appendChild(btn);
  });
  document.getElementById('appt-submit').onclick=function(){
    if(!selDate||!selSlot)return;
    var hp=document.getElementById('appt-hp').value;
    var consentCb=document.getElementById('appt-consent-cb');
    if(consentRequired&&consentText&&(!consentCb||!consentCb.checked)){
      document.getElementById('appt-error').textContent='Gizlilik onayını kabul etmelisiniz';
      document.getElementById('appt-error').style.display='block';return;
    }
    var payload={project_id:PID,date:selDate,start_time:selSlot,honeypot:hp||'',form_loaded_at:formLoadedAt,consent_given:consentCb?consentCb.checked:false};
    var formDataExtra={};
    var systemIds=['client_name','client_email'];
    if(formFields&&formFields.length){
      formFields.forEach(function(f){
        var el=document.getElementById('appt-field-'+f.id);
        if(!el)return;
        var v=el.value||'';
        if(f.system){
          if(f.id==='client_name')payload.client_name=v;
          else if(f.id==='client_email')payload.client_email=v;
        } else {
          if(f.id==='client_phone')payload.client_phone=v;
          else if(f.id==='client_note')payload.client_note=v;
          else formDataExtra[f.id]=v;
        }
        if(f.required&&!v.trim()){
          document.getElementById('appt-error').textContent=f.label+' alanı zorunludur';
          document.getElementById('appt-error').style.display='block';payload=null;return;
        }
      });
    }else{
      var nEl=document.getElementById('appt-name'),eEl=document.getElementById('appt-email');
      if(nEl)payload.client_name=nEl.value;
      if(eEl)payload.client_email=eEl.value;
      var pEl=document.getElementById('appt-phone');if(pEl)payload.client_phone=pEl.value||null;
      var ntEl=document.getElementById('appt-note');if(ntEl)payload.client_note=ntEl.value||null;
    }
    if(!payload)return;
    if(!payload.client_name||!payload.client_email){document.getElementById('appt-error').textContent='Ad ve e-posta zorunludur';document.getElementById('appt-error').style.display='block';return}
    if(Object.keys(formDataExtra).length>0)payload.form_data=formDataExtra;
    document.getElementById('appt-submit').disabled=true;document.getElementById('appt-submit').textContent='Gönderiliyor...';
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})}).then(function(res){
      if(res.ok){document.getElementById('appt-form-container').style.display='none';document.getElementById('appt-success').style.display='block'}
      else{document.getElementById('appt-error').textContent=res.data.error||'Bir hata oluştu';document.getElementById('appt-error').style.display='block';document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').textContent='${btnText}'}
    }).catch(function(){document.getElementById('appt-error').textContent='Bağlantı hatası';document.getElementById('appt-error').style.display='block';document.getElementById('appt-submit').disabled=false;document.getElementById('appt-submit').textContent='${btnText}'});
  };
})();
<\/script>`;
}

// ── Pilates Template Renderers ──

function renderPilatesHero(b: ChaiBlock): string {
  const rawBg = b.backgroundImage as string || "";
  const bg = isBase64Image(rawBg) ? "" : rawBg;
  const bgStyle = bg
    ? `background-image:url('${escapeHtml(bg)}')`
    : `background:linear-gradient(135deg, #c4775a, #d4956e)`;
  return `<section class="relative min-h-screen flex items-end overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="${bgStyle}"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to right,rgba(196,119,90,0.6),rgba(196,119,90,0.2))"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.4),transparent)"></div>
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-40">
    <div class="grid md:grid-cols-2 gap-12 items-end">
      <div class="fade-in-up">
        <h1 style="font-family:'Playfair Display',serif;font-size:clamp(3rem,8vw,6rem);color:#fff;line-height:0.95;margin-bottom:1.5rem">${escapeHtml(b.title as string)}</h1>
        ${b.description ? `<p style="color:rgba(255,255,255,0.8);font-size:1.25rem;max-width:28rem">${escapeHtml(b.description as string)}</p>` : ""}
      </div>
      <div class="fade-in-up" style="animation-delay:0.3s">
        <div style="backdrop-filter:blur(20px);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:1rem;padding:2rem;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">
          <h3 style="color:#fff;font-size:1.25rem;font-weight:600;margin-bottom:0.5rem">${escapeHtml(b.subtitle as string || "Begin Your Transformation")}</h3>
          <p style="color:rgba(255,255,255,0.6);font-size:0.875rem;margin-bottom:1.5rem">Starting from your first session</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem">
            <input type="text" placeholder="Full Name" style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:0.5rem;color:#fff;outline:none">
            <input type="tel" placeholder="Phone Number" style="width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:0.5rem;color:#fff;outline:none">
            <button style="width:100%;padding:0.75rem;background:#fff;color:#c4775a;font-weight:600;border-radius:0.5rem;border:none;cursor:pointer" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Request A Callback</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:10;color:rgba(255,255,255,0.7);display:flex;flex-direction:column;align-items:center;gap:0.5rem">
    <span style="font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Discover More</span>
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7"/></svg>
  </div>
</section>`;
}

function renderPilatesFeatures(b: ChaiBlock): string {
  const services = (b.services as Array<{ title: string; description: string; image?: string }>) || [];
  const cards = services.slice(0, 3).map((s, i) => `
    <div class="fade-in-up" style="animation-delay:${i * 0.2}s">
      <div style="overflow:hidden;border-radius:1rem;margin-bottom:1.5rem;aspect-ratio:4/5;position:relative">
        ${s.image ? `<img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.7s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#c4775a,#d4956e)"></div>`}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.3),transparent)"></div>
      </div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:#2d2420;margin-bottom:0.5rem">${escapeHtml(s.title)}</h3>
      <p style="color:#6b5e54;font-size:0.875rem">${escapeHtml(s.description)}</p>
    </div>`).join("");

  return `<section style="padding:6rem 0;background:#f5ebe0">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    ${b.sectionTitle ? `<h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.875rem,4vw,3rem);text-align:center;color:#2d2420;margin-bottom:4rem" class="fade-in-up">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTour(b: ChaiBlock): string {
  const images: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = b[`image${i}`] as string;
    if (img && !isBase64Image(img)) images.push(img);
  }
  const captions = ['Wunda Chair Studio', 'Reformer Training', 'Equipment Storage', 'Reception Area', 'Studio Interior', 'Lockers', 'Practice Space', 'Entrance'];
  const cards = images.map((img, i) => `
    <div style="flex-shrink:0;width:350px;scroll-snap-align:start">
      <div style="overflow:hidden;border-radius:0.75rem;aspect-ratio:4/3">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(captions[i] || '')}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      </div>
      <h4 style="font-family:'Playfair Display',serif;font-size:1.125rem;color:#f5ebe0;margin-top:1rem">${escapeHtml(captions[i] || `Space ${i+1}`)}</h4>
    </div>`).join("");

  return `<section style="padding:6rem 0;background:#2d2420;overflow:hidden">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem;margin-bottom:3rem">
    <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.875rem,4vw,3rem);color:#f5ebe0;margin-bottom:0.75rem" class="fade-in-up">${escapeHtml(b.title as string || "Tour our Space")}</h2>
    <p style="color:rgba(245,235,224,0.6);font-size:1.125rem" class="fade-in-up">${escapeHtml(b.subtitle as string || "Experience our studio")}</p>
  </div>
  <div style="display:flex;gap:1.5rem;overflow-x:auto;padding:0 3rem 2rem;scroll-snap-type:x mandatory;-ms-overflow-style:none;scrollbar-width:none">${cards}</div>
</section>`;
}

function renderPilatesTeachers(b: ChaiBlock): string {
  const teachers = (b.teachers as Array<{ name: string; role: string; image?: string }>) || [
    { name: 'Sarah Chen', role: 'Lead Instructor' },
    { name: 'Maya Patel', role: 'Reformer Specialist' },
    { name: 'Elena Rossi', role: 'Mat Pilates Expert' },
    { name: 'Liam Foster', role: 'Rehabilitation Coach' },
  ];
  const cards = teachers.map((t, i) => `
    <div class="fade-in-up" style="text-align:center;animation-delay:${i*0.15}s">
      <div style="overflow:hidden;border-radius:1rem;aspect-ratio:3/4;margin-bottom:1rem">
        ${t.image ? `<img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name)}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#c4775a,#d4956e)"></div>`}
      </div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.125rem;color:#2d2420">${escapeHtml(t.name)}</h3>
      <p style="color:#6b5e54;font-size:0.875rem">${escapeHtml(t.role)}</p>
    </div>`).join("");

  return `<section style="padding:6rem 0;background:#f5ebe0">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="text-align:center;margin-bottom:4rem" class="fade-in-up">
      <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.875rem,4vw,3rem);color:#2d2420;margin-bottom:1rem">${escapeHtml(b.title as string || "Our Teachers")}</h2>
      ${b.description ? `<p style="color:#6b5e54;font-size:1.125rem;max-width:42rem;margin:0 auto">${escapeHtml(b.description as string)}</p>` : ""}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesTestimonials(b: ChaiBlock): string {
  const items = (b.testimonials as Array<{ name: string; role?: string; content: string }>) || [];
  const cards = items.map((t, i) => `
    <div class="fade-in-up" style="animation-delay:${i*0.2}s;background:rgba(255,255,255,0.05);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);border-radius:1rem;padding:2rem">
      <div style="display:flex;gap:0.25rem;margin-bottom:1rem">${'★★★★★'.split('').map(() => `<span style="color:#c4775a">★</span>`).join('')}</div>
      <p style="color:rgba(245,235,224,0.8);font-style:italic;margin-bottom:1.5rem;line-height:1.7">"${escapeHtml(t.content)}"</p>
      <p style="color:#c4775a;font-weight:600;font-size:0.875rem">${escapeHtml(t.name)}</p>
    </div>`).join("");

  return `<section style="padding:6rem 0;background:#2d2420">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.875rem,4vw,3rem);color:#f5ebe0;text-align:center;margin-bottom:4rem" class="fade-in-up">${escapeHtml(b.sectionTitle as string || "What Our Clients Say")}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem">${cards}</div>
  </div>
</section>`;
}

function renderPilatesContact(b: ChaiBlock): string {
  return `<section style="padding:6rem 0;background:#f5ebe0">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="text-align:center;margin-bottom:4rem" class="fade-in-up">
      <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.875rem,4vw,3rem);color:#2d2420;margin-bottom:1rem">${escapeHtml(b.sectionTitle as string || "Get In Touch")}</h2>
      ${b.sectionDescription ? `<p style="color:#6b5e54;font-size:1.125rem">${escapeHtml(b.sectionDescription as string)}</p>` : ""}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:4rem" class="fade-in-up">
      <div style="display:flex;flex-direction:column;gap:2rem">
        ${b.address ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:rgba(196,119,90,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">📍</div><div><h4 style="font-weight:600;color:#2d2420;margin-bottom:0.25rem">Address</h4><p style="color:#6b5e54">${escapeHtml(b.address as string)}</p></div></div>` : ""}
        ${b.phone ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:rgba(196,119,90,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">📞</div><div><h4 style="font-weight:600;color:#2d2420;margin-bottom:0.25rem">Phone</h4><p style="color:#6b5e54">${escapeHtml(b.phone as string)}</p></div></div>` : ""}
        ${b.email ? `<div style="display:flex;align-items:flex-start;gap:1rem"><div style="width:3rem;height:3rem;border-radius:50%;background:rgba(196,119,90,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">📧</div><div><h4 style="font-weight:600;color:#2d2420;margin-bottom:0.25rem">Email</h4><p style="color:#6b5e54">${escapeHtml(b.email as string)}</p></div></div>` : ""}
      </div>
      <div style="background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);border:1px solid #e8ddd0">
        <form onsubmit="event.preventDefault();alert('Message sent!')" style="display:flex;flex-direction:column;gap:1rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <input type="text" placeholder="First Name" style="padding:0.75rem 1rem;background:rgba(245,235,224,0.5);border:1px solid #e8ddd0;border-radius:0.5rem;color:#2d2420;outline:none" required>
            <input type="text" placeholder="Last Name" style="padding:0.75rem 1rem;background:rgba(245,235,224,0.5);border:1px solid #e8ddd0;border-radius:0.5rem;color:#2d2420;outline:none" required>
          </div>
          <input type="email" placeholder="Email" style="padding:0.75rem 1rem;background:rgba(245,235,224,0.5);border:1px solid #e8ddd0;border-radius:0.5rem;color:#2d2420;outline:none" required>
          <textarea placeholder="Message" rows="4" style="padding:0.75rem 1rem;background:rgba(245,235,224,0.5);border:1px solid #e8ddd0;border-radius:0.5rem;color:#2d2420;outline:none;resize:none" required></textarea>
          <button type="submit" style="padding:0.75rem;background:#c4775a;color:#fff;font-weight:600;border-radius:0.5rem;border:none;cursor:pointer" onmouseover="this.style.background='#b36a4f'" onmouseout="this.style.background='#c4775a'">Send Message</button>
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
      <span style="font-family:'Playfair Display',serif;font-size:1.125rem;color:#fff;letter-spacing:0.05em">${escapeHtml(siteName)}</span>
    </div>
    <nav style="display:flex;align-items:center;gap:2rem;margin-left:auto">
      <a href="#features" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Why Us</a>
      <a href="#tour" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Our Studio</a>
      <a href="#teachers" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Teachers</a>
      <a href="#testimonials" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Testimonials</a>
      <a href="#contact" style="color:rgba(255,255,255,0.9);font-size:0.875rem;text-decoration:none;letter-spacing:0.05em">Contact</a>
    </nav>
  </div>
</header>
<script>
window.addEventListener('scroll',function(){var h=document.getElementById('pilates-header');if(window.scrollY>50){h.style.background='rgba(245,235,224,0.95)';h.style.backdropFilter='blur(12px)';h.querySelectorAll('a,span').forEach(function(e){e.style.color='#2d2420'})}else{h.style.background='transparent';h.style.backdropFilter='none';h.querySelectorAll('a,span').forEach(function(e){e.style.color='rgba(255,255,255,0.9)'})}});
<\/script>`;
}

function renderPilatesFooter(siteName: string, tagline: string): string {
  return `<footer style="background:#2d2420;padding:4rem 0;border-top:1px solid rgba(255,255,255,0.1)">
  <div style="max-width:80rem;margin:0 auto;padding:0 3rem">
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
      <div style="width:2rem;height:2rem;border-radius:50%;border:2px solid #c4775a;display:flex;align-items:center;justify-content:center"><div style="width:0.75rem;height:0.75rem;border-radius:50%;background:#c4775a"></div></div>
      <span style="font-family:'Playfair Display',serif;font-size:1.25rem;color:#f5ebe0">${escapeHtml(siteName)}</span>
    </div>
    <p style="color:rgba(245,235,224,0.5);font-size:0.875rem;max-width:24rem;margin-bottom:2rem">${escapeHtml(tagline)}</p>
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
      <p style="color:rgba(245,235,224,0.3);font-size:0.75rem">© ${new Date().getFullYear()} ${escapeHtml(siteName)}. All rights reserved.</p>
      <div style="display:flex;gap:1.5rem">
        <a href="#" style="color:rgba(245,235,224,0.3);font-size:0.75rem;text-decoration:none">Privacy Policy</a>
        <a href="#" style="color:rgba(245,235,224,0.3);font-size:0.75rem;text-decoration:none">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>`;
}

// ── Main renderer ──

function renderBlock(block: ChaiBlock): string {
  switch (block._type) {
    case "HeroCentered":
    case "HeroOverlay":
    case "HeroSplit":
      return renderHeroCentered(block);
    case "StatisticsCounter":
      return renderStatisticsCounter(block);
    case "AboutSection":
      return renderAboutSection(block);
    case "ServicesGrid":
      return renderServicesGrid(block);
    case "TestimonialsCarousel":
      return renderTestimonialsCarousel(block);
    case "ImageGallery":
      return renderImageGallery(block);
    case "FAQAccordion":
      return renderFAQAccordion(block);
    case "ContactForm":
      return renderContactForm(block);
    case "CTABanner":
      return renderCTABanner(block);
    case "PricingTable":
      return renderPricingTable(block);
    case "AppointmentBooking":
      return renderAppointmentBooking(block);
    // Pilates template block types
    case "PilatesHero":
      return renderPilatesHero(block);
    case "PilatesFeatures":
      return renderPilatesFeatures(block);
    case "PilatesTour":
      return renderPilatesTour(block);
    case "PilatesTeachers":
      return renderPilatesTeachers(block);
    case "PilatesTestimonials":
      return renderPilatesTestimonials(block);
    case "PilatesContact":
      return renderPilatesContact(block);
    default:
      const text = (block.title as string) || (block.content as string) || "";
      if (text) return `<section class="py-12"><div class="max-w-4xl mx-auto px-6"><p>${escapeHtml(text)}</p></div></section>`;
      return "";
  }
}

function blocksToHtml(blocks: ChaiBlock[], theme: Record<string, unknown>, projectName: string, projectId?: string, templateId?: string): string {
  const themeCssVars = buildThemeCssVars(theme);
  const fontFamily = (theme?.fontFamily as { heading?: string; body?: string });
  const headingFont = fontFamily?.heading || "Inter";
  const bodyFont = fontFamily?.body || "Inter";
  const borderRadius = (theme?.borderRadius as string) || "8px";
  const isPilates = templateId === "pilates1";
  const allFonts = isPilates ? [...new Set([headingFont, bodyFont, "Playfair Display", "DM Sans"])] : [...new Set([headingFont, bodyFont])];
  const fontLinks = allFonts.map(f => `<link href="https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`).join("\n  ");

  let sectionsHtml = blocks.map(b => renderBlock(b)).filter(Boolean).join("\n");

  if (!sectionsHtml.trim()) {
    sectionsHtml = `<section class="min-h-screen flex items-center justify-center" style="background:var(--background)"><div class="text-center"><h1 class="text-4xl font-bold" style="color:var(--foreground)">${escapeHtml(projectName)}</h1><p class="mt-4" style="color:var(--muted-foreground)">Website coming soon</p></div></section>`;
  }

  // Add pilates header/footer if template is pilates
  if (isPilates) {
    const tagline = "Experience movement in its most authentic form.";
    sectionsHtml = renderPilatesHeader(projectName) + "\n" + sectionsHtml + "\n" + renderPilatesFooter(projectName, tagline);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const trackingScript = projectId ? `<script>(function(){var p="${projectId}",u="${supabaseUrl}/functions/v1/track-analytics",a=navigator.userAgent,d=/android|iphone|ipad|mobile/i.test(a)?"mobile":"desktop",v=localStorage.getItem("ol_vid");if(!v){v="v_"+Date.now()+"_"+Math.random().toString(36).substr(2,9);localStorage.setItem("ol_vid",v)}fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project_id:p,event_type:"page_view",page_path:location.pathname,user_agent:a,device_type:d,visitor_id:v})}).catch(function(){})})()<\/script>` : "";
  const projectVarsScript = projectId ? `<script>window.__PROJECT_ID__="${projectId}";window.__SUPABASE_URL__="${supabaseUrl}";<\/script>` : "";

  const pilatesStyles = isPilates ? `
    .fade-in-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
    .fade-in-up.visible { opacity: 1; transform: translateY(0); }
    ::-webkit-scrollbar { display: none; }
  ` : "";
  const pilatesScript = isPilates ? `<script>
document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in-up');var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:0.1});els.forEach(function(el){obs.observe(el)})});
<\/script>` : "";

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
    body { font-family: '${isPilates ? "DM Sans" : bodyFont}', sans-serif; background-color: ${isPilates ? "#f5ebe0" : "var(--background)"}; color: ${isPilates ? "#2d2420" : "var(--foreground)"}; margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6 { font-family: '${isPilates ? "Playfair Display" : headingFont}', ${isPilates ? "serif" : "sans-serif"}; }
    img { max-width: 100%; height: auto; }
    html { scroll-behavior: smooth; }
    ${pilatesStyles}
  </style>
</head>
<body>
${projectVarsScript}
${sectionsHtml}
${pilatesScript}
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

    const chaiBlocks = (project.chai_blocks as ChaiBlock[]) || [];
    const chaiTheme = (project.chai_theme as Record<string, unknown>) || {};

    const html = blocksToHtml(chaiBlocks, chaiTheme, project.name, projectId, project.template_id || undefined);
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
    const deployRes = await fetch(
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
