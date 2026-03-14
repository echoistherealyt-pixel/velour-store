// lib/products.js
export const products = [
  { id: 1, cat: 'dresses', nameEn: 'Linen Midi Dress',      nameAr: 'فستان لينن ميدي',      price: 380, bg: '#d4c9b8', sale: true  },
  { id: 2, cat: 'tops',    nameEn: 'Silk Blouse',           nameAr: 'بلوزة حرير',            price: 220, bg: '#c8b8a2'             },
  { id: 3, cat: 'bottoms', nameEn: 'Wide Leg Trousers',     nameAr: 'بنطال واسع',            price: 320, bg: '#b8a898'             },
  { id: 4, cat: 'dresses', nameEn: 'Wrap Dress',            nameAr: 'فستان راب',             price: 450, bg: '#e8ddd0'             },
  { id: 5, cat: 'tops',    nameEn: 'Cotton Turtleneck',     nameAr: 'تيشيرت رقبة عالية',    price: 180, bg: '#d8cfc4'             },
  { id: 6, cat: 'bottoms', nameEn: 'Pleated Skirt',         nameAr: 'تنورة مكرمشة',          price: 260, bg: '#c4bab0', sale: true  },
]

export const STORE_CONFIG = {
  name: 'VELOUR',
  currency: 'EGP',
  shippingFee: 0, // مجاني
  whatsapp: '+201000000000',
  email: 'hello@velour.store',
}
