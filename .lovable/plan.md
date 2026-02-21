
# Yayinlama Sistemini Bastan Yazma Plani

## Mevcut Sorun

Kod degisiklikleri dogru yapildi (`nuppel.com` PLATFORM_HOSTNAMES listesinde) ancak iki kritik sorun var:

1. **Kodun yuklenmesi (deploy)**: `nuppel.com` DNS'i Lovable altyapisina (185.158.133.1) yonleniyor, ancak Lovable altyapisi bu domain icin hangi projeyi sunacagini bilmiyor. Lovable'in Settings > Domains bolumunden `nuppel.com`'un bu projeye baglanmasi gerekiyor. Bu bir KOD degisikligi degil, altyapi yapilandirmasi.

2. **Tekrarlanan kod**: PLATFORM_HOSTNAMES listesi iki ayri dosyada tekrarlaniyor, bu da senkronizasyon sorunlarina neden oluyor.

## Yapilacaklar

### Adim 1: Merkezi Domain Yapilandirma Dosyasi Olustur

`src/config/domains.ts` adinda yeni bir dosya olusturulacak. Tum platform domain bilgileri burada tek yerde tanimlanacak:

- PLATFORM_HOSTNAMES listesi
- isPlatformDomain() fonksiyonu
- buildPublicUrl() fonksiyonu (PublishModal'daki hardcoded URL yerine)

### Adim 2: App.tsx'i Guncelle

- Yerel PLATFORM_HOSTNAMES ve isPlatformDomain tanimlarini kaldir
- `src/config/domains.ts`'den import et

### Adim 3: PublicWebsite.tsx'i Guncelle

- Yerel PLATFORM_HOSTNAMES ve isPlatformDomain tanimlarini kaldir
- `src/config/domains.ts`'den import et

### Adim 4: PublishModal.tsx'i Guncelle

- Hardcoded `expert-page-gen.lovable.app` URL'ini dinamik hale getir
- `buildPublicUrl()` fonksiyonunu merkezi dosyadan kullan
- URL sablonu: `https://{window.location.host}/site/{subdomain}` seklinde calisacak

## Teknik Detay

### Yeni dosya: `src/config/domains.ts`

```typescript
export const PLATFORM_HOSTNAMES = [
  'localhost',
  'lovable.app',
  'lovable.dev',
  'webcontainer.io',
  'lovableproject.com',
  'nuppel.com',
  'www.nuppel.com',
];

export function isPlatformDomain(hostname: string): boolean {
  return PLATFORM_HOSTNAMES.some(
    ph => hostname === ph || hostname.endsWith(`.${ph}`)
  );
}

export function buildPublicUrl(subdomain: string): string {
  const host = window.location.host;
  return `${window.location.protocol}//${host}/site/${subdomain}`;
}
```

### Degisecek dosyalar:
- `src/config/domains.ts` (yeni)
- `src/App.tsx` - yerel tanimlar kaldirilip import edilecek
- `src/pages/PublicWebsite.tsx` - yerel tanimlar kaldirilip import edilecek  
- `src/components/website-preview/PublishModal.tsx` - hardcoded URL kaldirilip merkezi fonksiyon kullanilacak

## Onemli Not

Kod degisikligi tek basina `nuppel.com` sorununu cozmez. Lovable altyapisi (185.158.133.1 IP'si) `nuppel.com` icin hangi uygulamayi sunacagini bilmelidir. Bunun icin Lovable projesinin Settings > Domains bolumunden `nuppel.com` domain'inin baglanmasi ve yayinlanmasi (Publish) gerekir.
