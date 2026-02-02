import type { Editor } from 'grapesjs';

export function turkishLocalePlugin(editor: Editor) {
  editor.I18n.addMessages({
    tr: {
      assetManager: {
        addButton: 'Görsel Ekle',
        inputPlh: 'URL yapıştır veya görsel sürükle',
        modalTitle: 'Görsel Seç',
        uploadTitle: 'Dosya Bırak veya Tıkla',
      },
      blockManager: {
        labels: {
          // Basic blocks
          'column1': '1 Sütun',
          'column2': '2 Sütun',
          'column3': '3 Sütun',
          'column3-7': '2 Sütun 3/7',
          'text': 'Metin',
          'link': 'Bağlantı',
          'image': 'Görsel',
          'video': 'Video',
          'map': 'Harita',
          // Hero blocks
          'hero-split': 'Hero (Bölünmüş)',
          'hero-overlay': 'Hero (Arka Plan)',
          'hero-centered': 'Hero (Ortalı)',
          'hero-gradient': 'Hero (Gradyan)',
          // Services blocks
          'services-grid': 'Hizmetler (Grid)',
          'services-list': 'Hizmetler (Liste)',
          'services-cards': 'Hizmetler (Kartlar)',
          // About blocks
          'about-inline': 'Hakkımızda (Yan Yana)',
          'about-fullwidth': 'Hakkımızda (Tam Genişlik)',
          'about-timeline': 'Hakkımızda (Zaman Çizelgesi)',
          // Contact blocks
          'contact-form': 'İletişim Formu',
          'contact-info': 'İletişim Bilgileri',
          'contact-map': 'İletişim (Haritalı)',
          // CTA blocks
          'cta-banner': 'CTA Banner',
          'cta-split': 'CTA (Bölünmüş)',
          // Testimonial blocks
          'testimonials-grid': 'Yorumlar (Grid)',
          'testimonials-carousel': 'Yorumlar (Carousel)',
          // Other blocks
          'statistics': 'İstatistikler',
          'gallery': 'Galeri',
          'faq': 'SSS',
          'process': 'Süreç',
          'team': 'Ekip',
          'form': 'Form',
          'button': 'Buton',
          'divider': 'Ayırıcı',
          'quote': 'Alıntı',
          'list-items': 'Liste',
        },
        categories: {
          'Basic': 'Temel',
          'Forms': 'Formlar',
          'Extra': 'Ekstra',
          'Hero Bölümleri': 'Hero Bölümleri',
          'Hizmet Bölümleri': 'Hizmet Bölümleri',
          'Hakkımızda': 'Hakkımızda',
          'İletişim': 'İletişim',
          'CTA': 'Eylem Çağrısı',
          'Yorumlar': 'Yorumlar',
          'Genel': 'Genel',
        },
      },
      domComponents: {
        names: {
          '': 'Kutu',
          wrapper: 'Body',
          text: 'Metin',
          comment: 'Yorum',
          image: 'Görsel',
          video: 'Video',
          label: 'Etiket',
          link: 'Bağlantı',
          map: 'Harita',
          tfoot: 'Tablo Alt',
          tbody: 'Tablo İçerik',
          thead: 'Tablo Başlık',
          table: 'Tablo',
          row: 'Satır',
          cell: 'Hücre',
        }
      },
      deviceManager: {
        device: 'Cihaz',
        devices: {
          desktop: 'Masaüstü',
          tablet: 'Tablet',
          mobileLandscape: 'Mobil Yatay',
          mobilePortrait: 'Mobil Dikey',
        }
      },
      panels: {
        buttons: {
          titles: {
            preview: 'Önizle',
            fullscreen: 'Tam Ekran',
            'sw-visibility': 'Bileşen Görünürlüğü',
            'export-template': 'Kodu Görüntüle',
            'open-sm': 'Stil Yöneticisi',
            'open-tm': 'Özellikler',
            'open-layers': 'Katmanlar',
            'open-blocks': 'Bloklar',
          }
        }
      },
      selectorManager: {
        label: 'Sınıflar',
        selected: 'Seçili',
        emptyState: '- Durum -',
        states: {
          hover: 'Üzerine Gelince',
          active: 'Aktif',
          'nth-of-type(2n)': 'Çift',
        }
      },
      styleManager: {
        empty: 'Stiller düzenlemek için bir öğe seçin',
        layer: 'Katman',
        fileButton: 'Görseller',
        sectors: {
          general: 'Genel',
          layout: 'Düzen',
          typography: 'Yazı Tipi',
          decorations: 'Dekorasyonlar',
          extra: 'Ekstra',
          flex: 'Flex',
          dimension: 'Boyut',
        },
        properties: {
          // General
          float: 'Hizalama',
          display: 'Görüntüleme',
          position: 'Konum',
          top: 'Üst',
          right: 'Sağ',
          left: 'Sol',
          bottom: 'Alt',
          // Dimension
          width: 'Genişlik',
          height: 'Yükseklik',
          'max-width': 'Maks. Genişlik',
          'max-height': 'Maks. Yükseklik',
          'min-width': 'Min. Genişlik',
          'min-height': 'Min. Yükseklik',
          margin: 'Dış Boşluk',
          padding: 'İç Boşluk',
          // Typography
          'font-family': 'Yazı Tipi',
          'font-size': 'Yazı Boyutu',
          'font-weight': 'Yazı Kalınlığı',
          'letter-spacing': 'Harf Aralığı',
          color: 'Renk',
          'line-height': 'Satır Yüksekliği',
          'text-align': 'Metin Hizalama',
          'text-decoration': 'Metin Dekorasyonu',
          'text-shadow': 'Metin Gölgesi',
          // Decorations
          'background-color': 'Arka Plan Rengi',
          border: 'Kenarlık',
          'border-radius': 'Köşe Yuvarlaklığı',
          'box-shadow': 'Kutu Gölgesi',
          background: 'Arka Plan',
          // Extra
          transition: 'Geçiş',
          perspective: 'Perspektif',
          transform: 'Dönüşüm',
          // Flex
          'flex-direction': 'Flex Yönü',
          'flex-wrap': 'Flex Sarmalama',
          'justify-content': 'Yatay Hizalama',
          'align-items': 'Dikey Hizalama',
          'align-content': 'İçerik Hizalama',
          order: 'Sıra',
          'flex-basis': 'Flex Temel',
          'flex-grow': 'Flex Büyüme',
          'flex-shrink': 'Flex Küçülme',
          'align-self': 'Kendini Hizala',
        }
      },
      traitManager: {
        empty: 'Seçili öğe düzenlenebilir özellik içermiyor',
        label: 'Özellikler',
        traits: {
          labels: {
            id: 'Id',
            alt: 'Alt Metin',
            title: 'Başlık',
            href: 'URL',
            target: 'Hedef',
          },
          options: {
            target: {
              false: 'Bu Pencere',
              _blank: 'Yeni Pencere',
            }
          }
        }
      },
      storageManager: {
        recover: 'Kaydedilmemiş değişiklikleri geri yüklemek ister misiniz?'
      },
      commands: {
        'core:undo': 'Geri Al',
        'core:redo': 'Yinele',
        'tlb-delete': 'Sil',
        'tlb-clone': 'Kopyala',
        'tlb-move': 'Taşı',
      }
    },
  });
  
  editor.I18n.setLocale('tr');
}
