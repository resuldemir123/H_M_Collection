# H M Collection - React Standalone

Tamamen React tabanlı, backend olmayan bir Single Page Application. Tüm veriler localStorage'da saklanır.

## 🚀 Kurulum

1. Node.js ve npm'in yüklü olduğundan emin olun (Node.js 18+ önerilir)

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Development modunda çalıştırın:
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

4. Production build için:
```bash
npm run build
```

Build dosyaları `dist` klasörüne oluşturulacaktır.

## 📁 Proje Yapısı

```
H_M_Collection/
├── src/
│   ├── components/       # React componentleri (Navbar, Footer)
│   ├── pages/            # Sayfa componentleri
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Satisfaction.jsx
│   │   └── Admin.jsx
│   ├── services/         # Servisler
│   │   ├── storage.js    # localStorage servisi
│   │   └── api.js        # API wrapper'ları
│   ├── App.jsx
│   └── main.jsx
├── public/               # Statik dosyalar
│   └── img/              # Görseller
├── package.json
├── vite.config.js
└── index.html
```

## 📝 Özellikler

- ✅ Tamamen client-side (backend yok)
- ✅ localStorage ile veri depolama
- ✅ Base64 ile dosya saklama
- ✅ React Router ile SPA routing
- ✅ Responsive tasarım
- ✅ Modern CSS animasyonları
- ✅ Yorum sistemi
- ✅ Admin paneli
- ✅ Fotoğraf/video yükleme

## 🎨 Sayfalar

- `/` - Ana sayfa (public fotoğraflar ve yorumlar)
- `/about` - Hakkımızda
- `/contact` - İletişim (harita ile)
- `/satisfaction` - Müşteri memnuniyeti (yorum formu ve medya paylaşımı)
- `/admin` - Admin paneli (yorum onaylama, fotoğraf yönetimi)

## 💾 Veri Depolama

Tüm veriler tarayıcının localStorage'ında saklanır:
- `hm_collection_photos` - Fotoğraflar (base64 olarak)
- `hm_collection_comments` - Yorumlar

**Not:** localStorage sadece tarayıcı bazlıdır. Farklı tarayıcılarda veya cihazlarda veriler görünmez.

## 🛠️ Geliştirme

### Yeni özellik ekleme
1. `src/pages/` klasörüne yeni sayfa ekleyin
2. `src/App.jsx` içinde route ekleyin
3. Gerekirse `src/services/storage.js` içinde yeni storage fonksiyonları ekleyin

### Veri formatı

**Photo:**
```javascript
{
  id: number,
  fileName: string,
  caption: string,
  isPublic: boolean,
  fileData: string, // Base64 data URL
  fileType: string,
  fileSize: number,
  uploadedAt: string // ISO date string
}
```

**Comment:**
```javascript
{
  id: number,
  customerName: string,
  content: string,
  photoId: number | null,
  isApproved: boolean,
  createdAt: string // ISO date string
}
```

## 📦 Bağımlılıklar

- React 18.2
- React Router DOM 6.20
- Vite 5.0
- Font Awesome 6.5 (CDN)

## ⚠️ Notlar

- Backend yok - tüm işlemler client-side yapılır
- Veriler sadece localStorage'da saklanır (tarayıcı bazlı)
- Dosyalar base64 olarak saklanır (büyük dosyalar için localStorage limiti olabilir)
- Production'da static hosting kullanabilirsiniz (Netlify, Vercel, GitHub Pages vb.)

## 🚀 Deployment

### Netlify/Vercel
1. `npm run build` çalıştırın
2. `dist` klasörünü deploy edin

### GitHub Pages
1. `vite.config.js` içinde `base: '/repo-name/'` ekleyin
2. `npm run build` çalıştırın
3. `dist` klasörünü GitHub Pages'e deploy edin


