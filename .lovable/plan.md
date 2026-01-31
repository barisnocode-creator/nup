
# Custom Domain UI Komponenti Plani

Bu plan, kullanicilarin kendi alan adlarini yonetmelerini saglayan UI bilesenlerini olusturacak.

---

## Mevcut Durum Analizi

Proje mevcut durumda:
- `PublishModal` ile subdomain bazli yayinlama yapiyor
- `custom_domains` tablosu ve Edge Functions (`add-custom-domain`, `verify-domain`, `remove-domain`) hazir
- Sheet bazli sidebar desenleri mevcut (`CustomizeSidebar`, `EditorSidebar`)
- TypeScript tipleri `custom_domains` tablosunu destekliyor

---

## Cozum Yaklasimi

Iki ana UI bileseni olusturulacak:

### 1. DomainSettingsModal (Ana Modal)

```text
+---------------------------------------+
|      Ozel Alan Adi Baglantisi         |
+---------------------------------------+
|                                       |
|  Bagli Domainler:                     |
|  +-------------------------------+    |
|  | www.drklinik.com   [Dogrulan] |    |
|  | Status: Dogrulaniyor...       |    |
|  | [Sil]                         |    |
|  +-------------------------------+    |
|                                       |
|  [+ Yeni Domain Ekle]                 |
|                                       |
|  ------------------------------------ |
|                                       |
|  DNS Talimatlari (acilir bolum)       |
|                                       |
+---------------------------------------+
```

### 2. AddDomainForm (Domain Ekleme Formu)

```text
+---------------------------------------+
|  Domain adresinizi girin:             |
|  [www.drklinik.com           ]        |
|                                       |
|  [Ekle]                               |
+---------------------------------------+
```

### 3. DNSInstructions (DNS Talimatlari)

```text
+---------------------------------------+
|  DNS Kayitlarinizi Ayarlayin          |
+---------------------------------------+
|                                       |
|  1. A Kaydi (Root Domain)             |
|     Host: @                           |
|     Value: 185.158.133.1    [Kopyala] |
|                                       |
|  2. A Kaydi (WWW)                     |
|     Host: www                         |
|     Value: 185.158.133.1    [Kopyala] |
|                                       |
|  3. TXT Kaydi (Dogrulama)             |
|     Host: _lovable                    |
|     Value: lovable_verify=xxx [Kopyala]|
|                                       |
+---------------------------------------+
```

---

## Teknik Detaylar

### Dosya Yapisi

```text
src/components/website-preview/
  DomainSettingsModal.tsx    <- Ana modal
  DomainListItem.tsx         <- Tek domain karti
  AddDomainForm.tsx          <- Domain ekleme formu
  DNSInstructions.tsx        <- DNS talimatlari
```

### State Yonetimi

```typescript
interface CustomDomain {
  id: string;
  domain: string;
  status: 'pending' | 'verifying' | 'verified' | 'failed';
  verification_token: string;
  is_primary: boolean;
  created_at: string;
  verified_at: string | null;
}

// Modal State
const [domains, setDomains] = useState<CustomDomain[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [showAddForm, setShowAddForm] = useState(false);
const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);
```

### API Entegrasyonu

```typescript
// Domain listesini getir
const fetchDomains = async () => {
  const { data, error } = await supabase
    .from('custom_domains')
    .select('*')
    .eq('project_id', projectId);
};

// Domain ekle
const addDomain = async (domain: string) => {
  const { data, error } = await supabase.functions.invoke('add-custom-domain', {
    body: { projectId, domain }
  });
};

// Domain dogrula
const verifyDomain = async (domainId: string) => {
  const { data, error } = await supabase.functions.invoke('verify-domain', {
    body: { domainId }
  });
};

// Domain sil
const removeDomain = async (domainId: string) => {
  const { data, error } = await supabase.functions.invoke('remove-domain', {
    body: { domainId }
  });
};
```

---

## Kullanici Akisi

```text
1. Kullanici PublishModal'da "Ozel Domain Ekle" tiklar
   |
   v
2. DomainSettingsModal acilir
   |
   +-- Mevcut domainler listelenir
   |
   +-- "Yeni Domain Ekle" tiklanir
       |
       v
3. AddDomainForm gosterilir
   |
   v
4. Domain girilir ve eklenir
   |
   v
5. DNS Talimatlari gosterilir
   |
   v
6. Kullanici DNS'i yapilandirir
   |
   v
7. "Dogrula" butonu tiklanir
   |
   +-- Basarili: Status = verified
   |
   +-- Basarisiz: Hata mesaji + yeniden dene
```

---

## UI Bilesenleri Detayi

### DomainSettingsModal

| Prop | Tip | Aciklama |
|------|-----|----------|
| isOpen | boolean | Modal gorunurlugu |
| onClose | () => void | Kapatma callback |
| projectId | string | Proje ID |

**Ozellikler:**
- Mevcut domainleri listele
- Domain ekleme formunu goster/gizle
- Her domain icin durum goster (pending/verifying/verified/failed)
- Dogrulama butonu
- Silme butonu (onay ile)
- DNS talimatlari (Collapsible)

### DomainListItem

| Prop | Tip | Aciklama |
|------|-----|----------|
| domain | CustomDomain | Domain verisi |
| onVerify | (id) => void | Dogrulama callback |
| onRemove | (id) => void | Silme callback |
| isVerifying | boolean | Dogrulama durumu |

**Ozellikler:**
- Domain adini goster
- Durum badge'i (renk kodlu)
- Dogrulama butonu (pending/failed icin)
- Silme butonu
- Primary badge (is_primary ise)

### DNSInstructions

| Prop | Tip | Aciklama |
|------|-----|----------|
| domain | string | Domain adi |
| verificationToken | string | TXT kaydi icin token |

**Ozellikler:**
- A kaydi talimatlari
- WWW A kaydi talimatlari
- TXT kaydi talimatlari
- Her satir icin kopyalama butonu
- Collapsible/Accordion yapisi

---

## Status Badge Renkleri

| Status | Renk | Ikon |
|--------|------|------|
| pending | Sari (amber) | Clock |
| verifying | Mavi | Loader (animasyonlu) |
| verified | Yesil | Check |
| failed | Kirmizi | X |

---

## PublishModal Entegrasyonu

PublishModal'in "Premium Upsell" bolumu guncellenerek dogrudan `DomainSettingsModal` acilabilir hale getirilecek:

```typescript
// Mevcut:
<Button variant="link">
  Upgrade to Premium
</Button>

// Yeni:
<Button variant="link" onClick={() => setDomainModalOpen(true)}>
  Ozel Domain Bagla
</Button>
```

---

## Uygulama Adimlari

1. **DomainSettingsModal.tsx** - Ana modal bileseni
2. **DomainListItem.tsx** - Tekil domain karti
3. **AddDomainForm.tsx** - Domain ekleme formu  
4. **DNSInstructions.tsx** - DNS talimatlari bileseni
5. **PublishModal guncellemesi** - Domain modal tetikleyici
6. **Project.tsx guncellemesi** - Modal state ve props

---

## Guvenlik Kontrolleri

1. **JWT Dogrulama**: Tum API cagrilari kullanici oturumunu dogrular
2. **Proje Sahipligi**: RLS politikalari ile sadece proje sahibi domain yonetebilir
3. **Domain Format Validasyonu**: Frontend'de de temel validasyon
4. **Silme Onayi**: Yanlislikla silmeyi onlemek icin confirm dialog

---

## Tahmini Sure

| Gorev | Sure |
|-------|------|
| DomainSettingsModal | 1 mesaj |
| Alt bilesenler | 1 mesaj |
| PublishModal entegrasyonu | 1 mesaj |
| Test ve ince ayar | 1 mesaj |
| **Toplam** | **~4 mesaj** |

