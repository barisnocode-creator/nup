
## Yayinlama Hatasinin Duzeltilmesi

### Sorunun Kaynagi

Netlify sitesi artik mevcut degil (silinmis veya erisim kaybi). Veritabaninda kayitli `netlify_site_id` (`01ef82f4-...`) gecersiz oldugu icin deploy islemi `404 Not Found` hatasi aliyor.

Mevcut kodda `netlify_site_id` varsa yeni site olusturulmuyor, dogrudan deploy edilmeye calisiliyor. Eski site bulunamadiginda hata veriyor ve kurtarma mekanizmasi yok.

### Cozum

`deploy-to-netlify` fonksiyonuna **otomatik kurtarma** (self-healing) mekanizmasi eklenecek. Deploy islemi 404 donerse, eski site ID temizlenip yeni bir Netlify sitesi olusturulacak.

### Dosya Degisiklikleri

| Dosya | Islem |
|-------|-------|
| `supabase/functions/deploy-to-netlify/index.ts` | Deploy 404 hatasinda otomatik yeni site olusturma |

### Teknik Detay

Deploy API cagrisindan `404` donerse:
1. `netlifySiteId` degiskeni `null` yapilir
2. Veritabanindaki `netlify_site_id` ve `netlify_url` alanlari temizlenir
3. Yeni bir Netlify sitesi olusturulur (mevcut "site yoksa olustur" mantigi tekrar calisir)
4. Deploy islemi yeni site uzerinde tekrarlanir

Boylece kullanici hic bir sey yapmadan "Yayinla" butonuna bastiginda site otomatik olarak yeniden olusturulup yayinlanir.

### Degisiklik Detayi (satirlar ~1188-1208 arasi)

Mevcut deploy cagrisinin hata kontrolune 404 ozel durumu eklenecek:

```text
Deploy -> 404 mu?
  Evet -> netlify_site_id'yi temizle -> Yeni site olustur -> Tekrar deploy et
  Hayir -> Mevcut hata davranisi (500 don)
```

Bu tek dosya degisikligidir ve mevcut akisi bozmaz. Diger tum durumlarda (basarili deploy, farkli hatalar) davranis ayni kalir.
