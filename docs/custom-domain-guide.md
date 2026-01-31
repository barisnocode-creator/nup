# 🌐 Özel Domain Bağlama Rehberi

Kendi alan adınızı (örn: www.sirketim.com) web sitenize bağlayarak profesyonel bir görünüm elde edin.

---

## 📋 Gereksinimler

Başlamadan önce aşağıdakilere sahip olduğunuzdan emin olun:

- ✅ Kayıtlı bir domain adı (örn: GoDaddy, Namecheap, Google Domains vb. üzerinden)
- ✅ Domain sağlayıcınızın DNS yönetim paneline erişim
- ✅ Yayınlanmış bir web sitesi projesi

---

## 🚀 Kurulum Adımları

### Adım 1: Domain Ayarları Modalını Açın

1. Projenizi açın
2. **"Yayınla"** butonuna tıklayın
3. Açılan modalda **"Domain Ayarları"** linkine tıklayın

### Adım 2: Yeni Domain Ekleyin

1. **"Yeni Domain Ekle"** butonuna tıklayın
2. Domain adınızı girin (örn: `www.sirketim.com` veya `sirketim.com`)
3. **"Ekle"** butonuna tıklayın

> 💡 **İpucu:** Hem root domain (sirketim.com) hem de www subdomain'i (www.sirketim.com) ekleyebilirsiniz.

### Adım 3: DNS Kayıtlarını Yapılandırın

Domain eklendikten sonra, DNS talimatları gösterilecektir. Bu kayıtları domain sağlayıcınızın DNS paneline eklemeniz gerekiyor.

#### Eklemeniz Gereken DNS Kayıtları

| Kayıt Tipi | Host (Ad) | Value (Değer) | Açıklama |
|------------|-----------|---------------|----------|
| **A** | `@` | `185.158.133.1` | Root domain yönlendirmesi |
| **A** | `www` | `185.158.133.1` | WWW subdomain yönlendirmesi |
| **TXT** | `_lovable` | `lovable_verify=YOUR_TOKEN` | Domain sahipliği doğrulaması |

> ⚠️ **Önemli:** TXT kaydındaki `YOUR_TOKEN` değerini, size gösterilen gerçek token ile değiştirin. Token'ı kopyalamak için yanındaki kopyala ikonuna tıklayın.

### Adım 4: Doğrulama Yapın

DNS kayıtlarını ekledikten sonra:

1. Domain Ayarları modalına geri dönün
2. Eklediğiniz domain'in yanındaki **"Doğrula"** butonuna tıklayın
3. Doğrulama başarılı olursa, domain durumu **"Doğrulandı"** olarak değişecektir

---

## 🔧 Popüler DNS Sağlayıcıları Rehberi

### GoDaddy

1. [GoDaddy DNS Yönetimi](https://dcc.godaddy.com/domains)'ne gidin
2. Domain'inizi seçin
3. **"DNS"** sekmesine tıklayın
4. **"Ekle"** butonuyla yeni kayıt ekleyin:
   - **Tür:** A, **Ad:** @, **Değer:** 185.158.133.1
   - **Tür:** A, **Ad:** www, **Değer:** 185.158.133.1
   - **Tür:** TXT, **Ad:** _lovable, **Değer:** lovable_verify=YOUR_TOKEN
5. **"Kaydet"** butonuna tıklayın

### Namecheap

1. [Namecheap Dashboard](https://ap.www.namecheap.com/)'a gidin
2. Domain'inizin yanındaki **"Manage"** butonuna tıklayın
3. **"Advanced DNS"** sekmesine gidin
4. **"Add New Record"** ile kayıtları ekleyin:
   - **Type:** A Record, **Host:** @, **Value:** 185.158.133.1
   - **Type:** A Record, **Host:** www, **Value:** 185.158.133.1
   - **Type:** TXT Record, **Host:** _lovable, **Value:** lovable_verify=YOUR_TOKEN
5. Değişiklikleri kaydedin

### Cloudflare

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)'a gidin
2. Domain'inizi seçin
3. Sol menüden **"DNS"** → **"Records"** seçin
4. **"Add record"** ile kayıtları ekleyin:
   - **Type:** A, **Name:** @, **IPv4 address:** 185.158.133.1, **Proxy status:** DNS only
   - **Type:** A, **Name:** www, **IPv4 address:** 185.158.133.1, **Proxy status:** DNS only
   - **Type:** TXT, **Name:** _lovable, **Content:** lovable_verify=YOUR_TOKEN

> ⚠️ **Cloudflare Kullanıcıları İçin:** A kayıtları için **Proxy status** seçeneğini "DNS only" (gri bulut) olarak ayarlayın. Turuncu bulut (Proxied) aktifken SSL sorunları yaşayabilirsiniz.

### Google Domains

1. [Google Domains](https://domains.google.com/)'e gidin
2. Domain'inizi seçin
3. Sol menüden **"DNS"** seçin
4. **"Özel kayıtlar"** bölümünde kayıtları ekleyin:
   - **Tür:** A, **Ana makine adı:** @, **Veri:** 185.158.133.1
   - **Tür:** A, **Ana makine adı:** www, **Veri:** 185.158.133.1
   - **Tür:** TXT, **Ana makine adı:** _lovable, **Veri:** lovable_verify=YOUR_TOKEN

### Türk Sağlayıcıları (Natro, İsimtescil, Türk Telekom)

#### Natro

1. [Natro Müşteri Paneli](https://www.natro.com/)'ne giriş yapın
2. **"Domain Yönetimi"** → **"DNS Yönetimi"** seçin
3. Kayıtları ekleyin ve kaydedin

#### İsimtescil

1. [İsimtescil Paneli](https://www.isimtescil.net/)'ne giriş yapın
2. **"Alan Adlarım"** → Domain'inizi seçin → **"DNS Yönetimi"**
3. Gerekli kayıtları ekleyin

---

## ❓ Sık Sorulan Sorular (SSS)

### DNS değişiklikleri ne kadar sürede yayılır?

DNS değişikliklerinin tüm dünyada yayılması genellikle **24-48 saat** sürebilir. Ancak çoğu durumda 1-2 saat içinde aktif olur.

### Birden fazla domain bağlayabilir miyim?

Evet! Bir projeye birden fazla domain bağlayabilirsiniz. Her domain için aynı adımları tekrarlayın.

### Subdomain (örn: blog.site.com) bağlayabilir miyim?

Evet, subdomain'leri de bağlayabilirsiniz. Subdomain eklerken:
- Domain alanına tam subdomain'i yazın (örn: `blog.sirketim.com`)
- DNS kayıtlarında A kaydı için host değeri subdomain adı olmalıdır (örn: `blog`)

### Mevcut DNS kayıtlarımı silmeli miyim?

- **A kayıtları:** Aynı host için mevcut A kayıtlarını kaldırmanız gerekebilir
- **TXT kayıtları:** `_lovable` host'u için başka TXT kaydı yoksa sorun olmaz
- **Diğer kayıtlar:** MX (e-posta), CNAME vb. kayıtlara dokunmayın

### Cloudflare proxy kullanabilir miyim?

Doğrulama sırasında proxy'yi **kapalı** tutmanızı öneririz (gri bulut). Doğrulama tamamlandıktan sonra proxy'yi açabilirsiniz, ancak SSL sorunları yaşarsanız kapalı tutun.

### Domain doğrulaması neden başarısız oluyor?

Olası nedenler:
1. **DNS yayılımı tamamlanmadı** - 24-48 saat bekleyin
2. **TXT kaydı yanlış** - Host değerinin `_lovable` olduğundan emin olun
3. **Token eksik/yanlış** - Token'ı tam olarak kopyaladığınızdan emin olun
4. **Mevcut çakışan kayıtlar** - Aynı host için birden fazla kayıt olup olmadığını kontrol edin

---

## 🛠️ Sorun Giderme

| Sorun | Olası Neden | Çözüm |
|-------|-------------|-------|
| Doğrulama başarısız | DNS yayılımı tamamlanmadı | 24-48 saat bekleyin ve tekrar deneyin |
| Doğrulama başarısız | TXT kaydı yanlış | Host değerinin `_lovable` olduğunu kontrol edin |
| Doğrulama başarısız | Token yanlış/eksik | Token'ı tamamen kopyalayın (`lovable_verify=...`) |
| Site açılmıyor | A kaydı eksik/yanlış | IP adresinin `185.158.133.1` olduğunu kontrol edin |
| "Güvenli değil" uyarısı | SSL sertifikası henüz oluşmadı | Birkaç saat bekleyin, otomatik oluşturulacak |
| www çalışmıyor | www A kaydı eksik | www için ayrı A kaydı eklediğinizden emin olun |
| Sayfa yüklenmiyor | Cloudflare proxy aktif | Proxy'yi "DNS only" yapın |

---

## 🔍 DNS Kontrol Araçları

DNS kayıtlarınızın doğru yapılandırıldığını kontrol etmek için:

- **[DNSChecker.org](https://dnschecker.org)** - Global DNS yayılım kontrolü
- **[MXToolbox](https://mxtoolbox.com/SuperTool.aspx)** - Detaylı DNS analizi
- **[WhatsMyDNS](https://www.whatsmydns.net)** - Dünya genelinde DNS sorgusu

### Nasıl Kontrol Edilir?

1. [DNSChecker.org](https://dnschecker.org)'a gidin
2. Domain adınızı girin (örn: sirketim.com)
3. Kayıt tipini seçin (A veya TXT)
4. **"Search"** butonuna tıklayın
5. Tüm lokasyonlarda yeşil tik görüyorsanız, DNS yayılımı tamamlanmıştır

---

## 📞 Destek

Sorun yaşamaya devam ediyorsanız:

1. Bu rehberdeki tüm adımları kontrol edin
2. DNS kayıtlarınızı yukarıdaki araçlarla doğrulayın
3. 48 saat bekledikten sonra hala sorun varsa destek ekibiyle iletişime geçin

---

## 📝 Hızlı Referans Kartı

```
┌─────────────────────────────────────────────────────────┐
│                   DNS KAYITLARI                         │
├─────────────────────────────────────────────────────────┤
│  A Kaydı (Root)                                         │
│  ├── Host: @                                            │
│  └── Value: 185.158.133.1                               │
├─────────────────────────────────────────────────────────┤
│  A Kaydı (WWW)                                          │
│  ├── Host: www                                          │
│  └── Value: 185.158.133.1                               │
├─────────────────────────────────────────────────────────┤
│  TXT Kaydı (Doğrulama)                                  │
│  ├── Host: _lovable                                     │
│  └── Value: lovable_verify=YOUR_TOKEN                   │
└─────────────────────────────────────────────────────────┘
```

---

*Son güncelleme: Ocak 2026*
