# 🛍 VELOUR Store

متجر ملابس كامل مبني بـ Next.js مع Paymob + Stripe

---

## 📁 هيكل المشروع

```
velour/
├── pages/
│   ├── index.js              ← الموقع الكامل (الرئيسية، منتجات، سلة، تواصل، داشبورد)
│   ├── order-success.js      ← صفحة تأكيد الطلب
│   ├── _app.js
│   └── api/
│       ├── checkout/
│       │   ├── stripe.js     ← Stripe Checkout API
│       │   └── paymob.js     ← Paymob Checkout API
│       └── webhooks/
│           └── paymob.js     ← Paymob Webhook (تأكيد الدفع)
├── lib/
│   └── products.js           ← بيانات المنتجات
├── styles/
│   ├── globals.css
│   └── store.module.css
├── .env.example              ← نموذج متغيرات البيئة
└── vercel.json
```

---

## 🚀 خطوات الرفع على Vercel

### 1. حمّل الكود على GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/USERNAME/velour-store.git
git push -u origin main
```

### 2. ارفع على Vercel
- روح على https://vercel.com
- اضغط "New Project"
- اختار الـ repo اللي رفعته
- اضغط Deploy

### 3. حط متغيرات البيئة
في Vercel Dashboard → Settings → Environment Variables، حط:

| Key | من فين |
|-----|--------|
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | نفس الصفحة |
| `PAYMOB_API_KEY` | https://accept.paymob.com/portal2/en/profile |
| `PAYMOB_INTEGRATION_ID_CARD` | Paymob → Integrations |
| `PAYMOB_IFRAME_ID` | Paymob → Iframes |
| `PAYMOB_HMAC_SECRET` | Paymob → Account → Security Settings |
| `NEXT_PUBLIC_SITE_URL` | رابط موقعك مثلاً https://velour.vercel.app |

---

## 💳 إعداد Paymob

1. سجّل على https://accept.paymob.com
2. روح **Settings → Account Info** → انسخ الـ API Key
3. روح **Developers → Payment Integrations** → أنشئ Card Integration + انسخ الـ ID
4. روح **Developers → Iframes** → أنشئ iframe + انسخ الـ ID
5. روح **Settings → Security Settings** → انسخ الـ HMAC secret
6. حط Webhook URL في Paymob:
   ```
   https://velour.vercel.app/api/webhooks/paymob
   ```

---

## 💳 إعداد Stripe

1. سجّل على https://stripe.com
2. روح **Developers → API Keys**
3. انسخ الـ Secret Key والـ Publishable Key

---

## 🛠 تشغيل محلياً

```bash
# انسخ ملف البيئة
cp .env.example .env.local
# حط القيم الحقيقية في .env.local

# شغّل
npm install
npm run dev
# افتح http://localhost:3000
```

---

## ➕ إضافة منتجات جديدة

افتح `lib/products.js` وأضف منتجك:

```js
{ id: 7, cat: 'tops', nameEn: 'My New Top', nameAr: 'توب جديد', price: 250, bg: '#c8d8e8' }
```

الكاتيجوري المتاحة: `tops` | `dresses` | `bottoms`

---

صُنع بـ ❤️ بواسطة Cleo Business
