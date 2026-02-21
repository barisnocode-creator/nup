
# Sorun Tespiti ve Cozum

## Tespit Edilen Sorun

`deploy-to-vercel` edge function'i backend'e deploy edilmemisti. Fonksiyon kodu dogru yazilmis ve `config.toml`'da tanimlanmis olmasina ragmen, gercek deploy yapilmamisti. Bu nedenle yayinlama butonuna basildiginda fonksiyon cagrilsa da backend'de bulunamiyor ve hata donuyordu.

## Yapilan Islem

Edge function basariyla deploy edildi ve test edildi. Test sonucu:
- Fonksiyon dogru calisiyor (gecersiz proje ID'si icin beklenen "Project not found" hatasi donuyor)
- Vercel API entegrasyonu hazir (`VERCEL_API_TOKEN` ve `VERCEL_TEAM_ID` secret'lari mevcut)
- Veritabani sutunlari (`vercel_project_id`, `vercel_url`) mevcut

## Mevcut Durum

Yayinlama akisi simdi soyle calismali:

```text
1. Kullanici editorde "Yayinla" butonuna tiklar
2. PublishModal acilir, subdomain secilir
3. "Yayinla" butonuna basilir
4. deploy-to-vercel edge function cagirilir
5. Vercel API'sine rewrite projesi deploy edilir
6. vercel_url ve vercel_project_id veritabanina kaydedilir
7. Kullaniciya basari mesaji ve URL gosterilir
```

## Ek Kontroller / Olasi Sorunlar

Eger yayinlama hala calismiyorsa, su kontroller yapilmali:

### 1. Vercel API Token Kontrolu
`VERCEL_API_TOKEN` secret'inin gecerli olup olmadigini dogrulamak gerekir. Token suresi dolmus veya yanlis girilmis olabilir.

### 2. Vercel Team ID Kontrolu  
`VERCEL_TEAM_ID` dolu ama yanlis bir deger icerebilir. Eger kisisel Vercel hesabi kullaniliyorsa bu bos birakilmali.

### 3. PublishModal'daki Hata Yakalama
`handlePublish` fonksiyonunda `supabase.functions.invoke` hatalari `deployError.message` ile gosteriliyor. Eger fonksiyon 500 donerse kullaniciya "Yayinlama basarisiz" mesaji gosterilecek.

## Onerilen Adimlar

| Adim | Islem |
|---|---|
| 1 | Edge function zaten deploy edildi (tamamlandi) |
| 2 | Bir test projesi olusturup "Yayinla" butonuna basarak akisi dogrulayin |
| 3 | Eger hata alinirsai edge function loglarini kontrol edin |
| 4 | Gerekirse VERCEL_API_TOKEN degerini guncelleyin |
