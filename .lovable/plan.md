
# Custom Domain Kullanıcı Dokümantasyonu Planı

Bu plan, özel domain özelliği için kapsamlı bir kullanıcı dokümantasyonu oluşturacak.

---

## Oluşturulacak Dosya

`docs/custom-domain-guide.md` - Türkçe kullanıcı rehberi

---

## Dokümantasyon İçeriği

### 1. Genel Bakış

- Özel domain ne işe yarar?
- Neden özel domain kullanmalısınız?
- Gereksinimler (domain sahipliği, DNS erişimi)

### 2. Adım Adım Kurulum Rehberi

```text
Adım 1: Domain Ayarları Modalını Açın
   └── PublishModal → "Domain Ayarları" linki

Adım 2: Yeni Domain Ekleyin
   └── Domain adınızı girin (örn: www.sirketim.com)

Adım 3: DNS Kayıtlarını Yapılandırın
   └── A Kaydı (Root): @ → 185.158.133.1
   └── A Kaydı (WWW): www → 185.158.133.1
   └── TXT Kaydı: _lovable → lovable_verify=TOKEN

Adım 4: Doğrulama Yapın
   └── "Doğrula" butonuna tıklayın
```

### 3. DNS Kayıt Tablosu

| Kayıt Tipi | Host | Value | Açıklama |
|------------|------|-------|----------|
| A | @ | 185.158.133.1 | Root domain yönlendirmesi |
| A | www | 185.158.133.1 | WWW subdomain yönlendirmesi |
| TXT | _lovable | lovable_verify=TOKEN | Domain sahipliği doğrulaması |

### 4. Popüler DNS Sağlayıcıları Rehberi

Adım adım talimatlar:
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Türk Telekom / Natro / İsimtescil

### 5. Sorun Giderme Rehberi

| Sorun | Olası Neden | Çözüm |
|-------|-------------|-------|
| Doğrulama başarısız | DNS yayılımı tamamlanmadı | 24-48 saat bekleyin |
| Doğrulama başarısız | TXT kaydı yanlış | Host değerini kontrol edin (_lovable) |
| Doğrulama başarısız | Token yanlış | Tam token değerini kopyalayın |
| Site açılmıyor | A kaydı eksik/yanlış | IP adresini kontrol edin |
| SSL hatası | Sertifika henüz oluşmadı | Birkaç saat bekleyin |

### 6. SSS (Sık Sorulan Sorular)

- DNS değişiklikleri ne kadar sürede yayılır?
- Birden fazla domain bağlayabilir miyim?
- Subdomain (blog.site.com) bağlayabilir miyim?
- Mevcut DNS kayıtlarımı silmeli miyim?
- Cloudflare proxy kullanabilir miyim?

### 7. DNS Kontrol Araçları

Kullanıcıların DNS durumunu kontrol etmesi için:
- https://dnschecker.org
- https://mxtoolbox.com
- https://whatsmydns.net

---

## Dosya Yapısı

```text
docs/
  custom-domain-guide.md    <- Ana Türkçe rehber
  
src/components/website-preview/
  HelpLink.tsx              <- Dokümana link (opsiyonel)
```

---

## Doküman Formatı

Markdown formatında, şu özelliklere sahip:
- Emoji kullanımı (görsel çekicilik)
- Kod blokları (DNS değerleri için)
- Tablolar (kayıt referansı için)
- Adım adım listeler
- Uyarı kutuları (önemli notlar için)
- Ekran görüntüsü yer tutucuları

---

## Örnek İçerik Yapısı

```markdown
# 🌐 Özel Domain Bağlama Rehberi

## Gereksinimler
- [ ] Domain sahipliği
- [ ] DNS yönetim paneli erişimi

## Kurulum Adımları

### 1. Domain Ekleyin
...

### 2. DNS Kayıtlarını Yapılandırın
...

## ⚠️ Önemli Notlar
> DNS değişiklikleri 24-48 saat sürebilir

## 🔧 Sorun Giderme
...

## ❓ SSS
...
```

---

## Uygulama Adımları

1. `docs/` klasörü oluştur
2. `custom-domain-guide.md` dosyasını oluştur
3. Tüm bölümleri Türkçe olarak yaz
4. DNS sağlayıcı örneklerini ekle
5. Sorun giderme tablosunu ekle

---

## Ek Geliştirmeler (Opsiyonel)

- DomainSettingsModal'a "Yardım" linki ekle
- In-app tooltip'ler ile DNS talimatlarını zenginleştir
- Video rehber linki ekle (varsa)
