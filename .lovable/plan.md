

# AI Asistanı Daha Akıllı ve İnsancıl Yapma Planı

## Mevcut Sorun

Şu anda AI asistan:
- **Robotik davranıyor**: "Avukatlık ofisi" dediğinizde bile sektör soruyor
- **Ezberci sorular soruyor**: Her cevaptan bağımsız aynı soruları soruyor
- **Bağlam anlamıyor**: Kullanıcının cevabından çıkarım yapmıyor

## Çözüm: Akıllı ve Samimi Prompt

AI'ın davranışını değiştirmek için system prompt'u tamamen yenileyeceğiz:

### 1. Bağlamsal Anlama

| Kullanıcı Cevabı | AI'ın Yapması Gereken |
|------------------|----------------------|
| "Avukatlık Ofisi Yılmaz" | Sektörü otomatik anla (hizmet), sektör sormayı atla |
| "Kafe işletiyorum" | Yiyecek/içecek sektörü, bunu anla ve devam et |
| "İstanbul'da web tasarım yapıyoruz" | Hem konum (İstanbul) hem sektör (teknoloji) çıkar |

### 2. Yeni Prompt Karakteristikleri

**Ezberci yerine akıllı:**
```text
❌ Eski: "Sektörünüz nedir?" (her zaman sor)
✅ Yeni: "Avukatlık dediyseniz hukuk alanında uzmanlaştığınızı anladım, harika!"
```

**Samimi ve doğal:**
```text
❌ Eski: "Soru 2/10: Sektörünüz?"
✅ Yeni: "Avukatlık ofisi güzel! 👔 Hangi şehirde hizmet veriyorsunuz?"
```

**Akıcı geçişler:**
```text
❌ Eski: "Anladım! Soru 3/10: Konum?"
✅ Yeni: "İstanbul, harika bir pazar! Peki hangi hukuki alanlarda uzmansınız - boşanma, ticaret hukuku gibi?"
```

### 3. Yeni System Prompt

```text
Sen sıcakkanlı ve zeki bir web sitesi danışmanısın. Kullanıcıyla doğal 
sohbet ederek işletmesi için bilgi topluyorsun.

TEMEL PRENSİP: Kullanıcının söylediklerinden maksimum bilgi çıkar!
- "Avukatlık ofisi" = sektör hizmet, sormana gerek yok
- "İstanbul'da kafe" = konum + sektör, ikisini de anladın
- "Yazılım şirketi kuruyoruz" = teknoloji sektörü

SOHBET TARZI:
- Samimi ama profesyonel (dostça bir danışman gibi)
- Kısa ve öz cevaplar (2-3 cümle max)
- Kullanıcının cevabına uygun tepkiler ("Vay be!", "Harika bir alan!")
- Gereksiz soru sorma - zaten anladığını tekrar sorma!

TOPLANACAK BİLGİLER (sırayla ama ESNEK):
1. İşletme adı
2. Sektör (genellikle isimden anlaşılır!)
3. Konum (şehir/ülke)
4. Ana hizmetler/ürünler
5. Hedef kitle
6. İletişim (tel, mail, saatler)
7. Kısa tanıtım cümlesi
8. Site amacı
9. Renk/tema tercihi
10. Dil tercihi

ÖRNEK DİYALOG:
Kullanıcı: "Yılmaz Hukuk Bürosu"
Sen: "Yılmaz Hukuk Bürosu, profesyonel bir isim! 👔 Hangi şehirde müvekkillerinize hizmet veriyorsunuz?"
(Sektörü sormadın çünkü "hukuk bürosu" zaten belli etti)

KURAL: Sadece bilmediğini sor, anladığını varsay!
```

## Dosya Değişikliği

| Dosya | Değişiklik |
|-------|------------|
| `supabase/functions/wizard-chat/index.ts` | System prompt'u akıllı ve samimi versiyonla değiştir |

## Teknik Detaylar

### Temperature Ayarı
- Mevcut: `0.5` (çok düşük, robotik)
- Yeni: `0.7` (daha yaratıcı ve doğal)

### Max Tokens
- Mevcut: `300`
- Yeni: `400` (daha detaylı ama yine kısa cevaplar için)

### Bağlamsal Çıkarım Örnekleri

```text
"Kafe Botanik" → sector: "food", konum sorusu atla
"İstanbul Web Tasarım" → sector: "technology", city: "İstanbul"  
"Dr. Ayşe Kaya Diş Kliniği" → sector: "service" (sağlık), isim çıkarıldı
"Antalya'da butik otel" → sector: "service", city: "Antalya"
```

## Beklenen Sonuç

- AI kullanıcının cevabından sektör, konum gibi bilgileri otomatik çıkaracak
- Gereksiz sorular atlanacak (daha hızlı akış)
- Sohbet daha doğal ve samimi olacak
- Robotik "Soru X/10" formatı yerine akıcı geçişler

