
## CustomizePanel Renk Düzeltmesi — SaaS UI Tutarlılığı

### Sorun

`CustomizePanel.tsx` içindeki iki buton (`Template Değiştir` ve `Eklenebilir Bölümler`) ile toggle satırları `bg-muted`, `border-border`, `text-foreground`, `hover:bg-accent` gibi **CSS değişkenleri** kullanıyor. Bu değişkenler template'in temasından etkilenerek siyah/koyu renge dönüşüyor.

Diğer bölümler (`Hızlı Tema`, `Renkler`, `Yazı Tipleri`) zaten `bg-white`, `text-gray-500` gibi **sabit Tailwind renkleri** kullanıyor — doğru olan bu.

### Değiştirilecek Öğeler

Panelin tamamını SaaS UI renk sistemine (turuncu vurgu + gri/beyaz zemin) sabitlemek için değişkene dayalı her sınıf sabit renkle değiştirilecek:

#### 1. "Template Değiştir" Butonu
```
Önce: border-border bg-muted text-foreground hover:bg-accent
Sonra: border-gray-200 bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700
```

#### 2. "Eklenebilir Bölümler" Accordion Butonu
```
Önce: border-border bg-muted text-foreground hover:bg-accent
Sonra: border-gray-200 bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700
```

#### 3. "Aktif" Badge
```
Önce: bg-primary text-primary-foreground  (template'in primary rengi oluyor)
Sonra: bg-orange-500 text-white  (her zaman turuncu — SaaS marka rengi)
```

#### 4. AddableToggleRow — Her Toggle Satırı
```
Önce: bg-muted/50 border-border/50 hover:border-border text-foreground
Sonra: bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white text-gray-700
```

Aktif (checked) toggle satırları için ek vurgu:
```
checked=true → bg-orange-50 border-orange-200 text-orange-800
checked=false → bg-gray-50 border-gray-200 text-gray-700
```

#### 5. "Sektörünüze Özel" Divider
```
Önce: bg-border text-muted-foreground
Sonra: bg-gray-200 text-gray-400
```

#### 6. Şablon Section Başlığı
```
Önce: text-muted-foreground  (template rengini miras alıyor)
Sonra: text-gray-400
```

#### 7. Switch Bileşeni
`Switch` bileşeni `checked` durumunda `bg-primary` kullanıyor. Bunu SaaS turuncu rengiyle override etmek için toggle satırına özel `data-checked` sınıfı veya Switch'e doğrudan `className` eklenebilir.

### Sonuç Görünüm (Her Template'de Aynı)

```text
┌─────────────────────────────────────────────────┐
│  Şablon                                         │
│  ┌─────────────────────────────────────────┐    │
│  │ ▦ Template Değiştir          [gri buton]│    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ≡ Eklenebilir Bölümler  [3 aktif🟠] ▼  │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │ Randevu / Rezervasyon          [ ● ]    │ ← aktif: turuncu zemin
│  │ Sık Sorulan Sorular            [   ]    │ ← pasif: gri zemin
│  │ 📞 Sizi Arayalım               [ ● ]    │
│  │ ───── Sektörünüze Özel ─────           │
│  │ Online Konsültasyon            [   ]    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

- Butonlar: gri zemin, hover'da hafif turuncu vurgu
- Badge: her zaman `orange-500`
- Aktif toggle satırı: `orange-50` zemin + `orange-200` kenarlık
- Pasif toggle satırı: `gray-50` zemin + `gray-200` kenarlık
- Template temasından **tamamen bağımsız**

### Değişecek Dosya

| Dosya | İşlem |
|---|---|
| `src/components/editor/CustomizePanel.tsx` | CSS değişkenleri → sabit Tailwind renkleri |

Sadece bu tek dosya değişiyor. Mantık, toggle işlemleri, accordion animasyonu, sıralama — hiçbiri değişmez. Yalnızca renk sınıfları güncelleniyor.
