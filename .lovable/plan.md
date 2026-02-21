

# Custom Domain Altyapisi Duzeltme Plani

## Sorunun Ozeti

nuppel.com gibi ozel domainler "Website Not Found" gosteriyor cunku sistemde birden fazla uyumsuzluk var.

## Tespit Edilen Sorunlar

### 1. Yanlis IP Adresi (Kritik)

DNS talimatlari kullanicilara `75.2.60.5` (eski Vercel IP) adresini gosteriyor. Dogru IP `185.158.133.1` (Lovable platformu) olmali.

**Etkilenen yerler:**
- `src/components/website-dashboard/DomainTab.tsx` - satir 253-257'deki hardcoded IP
- `get_domain_dns_instructions` veritabani fonksiyonu - `75.2.60.5` IP adresi

### 2. nuppel.com Icin Veritabani Kaydi Yok

DNS dogru yere isaret etse bile, `custom_domains` tablosunda `nuppel.com` kaydi olmadigi icin PublicWebsite componenti hangi projeyi gosterecegini bilemiyor.

Bu kayit ya kullanici tarafindan editorden eklenmeli ya da manuell olusturulmali.

## Yapilacak Degisiklikler

### Adim 1: DNS IP Adresini Duzelt (DomainTab.tsx)

`src/components/website-dashboard/DomainTab.tsx` dosyasinda satir 253 ve 257'deki `75.2.60.5` degerleri `185.158.133.1` olarak guncellenecek.

### Adim 2: DNS IP Adresini Duzelt (DB Function)

`get_domain_dns_instructions` veritabani fonksiyonu SQL migration ile guncellenecek. Iki A kaydi icin de IP `75.2.60.5` yerine `185.158.133.1` olacak.

### Adim 3: nuppel.com Domain Kaydini Olustur

nuppel.com icin `custom_domains` tablosuna kayit eklenecek. Bunun icin kullaniciya hangi projeye baglanacagi sorulacak (dashboard uzerinden Domain Ayarlari ile de yapilabilir).

## Etkilenen Dosyalar

| Dosya | Islem |
|---|---|
| `src/components/website-dashboard/DomainTab.tsx` | IP guncelle (75.2.60.5 -> 185.158.133.1) |
| SQL Migration | `get_domain_dns_instructions` fonksiyonunu guncelle |

## Teknik Not

PublishModal.tsx'deki `buildPublicUrl` fonksiyonu `expert-page-gen.lovable.app/site/subdomain` formatinda URL uretiyor. Custom domain akisi bundan bagimsiz calisir: kullanici domain ekler, DNS yapilandirir, dogrular ve `custom_domains` tablosundaki `active` statusu ile PublicWebsite componenti hostname eslemesi yapar.

