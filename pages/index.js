// pages/index.js
import { useState } from 'react'
import Head from 'next/head'
import { products, STORE_CONFIG } from '../lib/products'
import styles from '../styles/store.module.css'

export default function Store() {
  const [page, setPage]     = useState('home')
  const [cart, setCart]     = useState([])
  const [lang, setLang]     = useState('en') // 'en' | 'ar'
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(null) // 'stripe' | 'paymob'

  const t = (en, ar) => lang === 'ar' ? ar : en
  const rtl = lang === 'ar'

  // ---- Cart helpers ----
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }
  const changeQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    )
  }
  const cartCount  = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal  = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const filtered   = filter === 'all' ? products : products.filter(p => p.cat === filter)

  // ---- Checkout ----
  const checkoutStripe = async () => {
    setLoading('stripe')
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) { alert('Stripe error — check console') }
    setLoading(null)
  }

  const checkoutPaymob = async () => {
    setLoading('paymob')
    try {
      const res = await fetch('/api/checkout/paymob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) { alert('Paymob error — check console') }
    setLoading(null)
  }

  return (
    <>
      <Head>
        <title>VELOUR — {t('Fashion Store', 'متجر أزياء')}</title>
        <meta name="description" content={t('Curated fashion for the modern woman', 'أزياء مختارة للمرأة العصرية')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.app} dir={rtl ? 'rtl' : 'ltr'}>

        {/* ── NAV ── */}
        <nav className={styles.nav}>
          <div className={styles.logo}>VELOUR</div>
          <div className={styles.navLinks}>
            {[
              { key: 'home',      en: 'Home',      ar: 'الرئيسية' },
              { key: 'products',  en: 'Shop',      ar: 'المنتجات' },
              { key: 'contact',   en: 'Contact',   ar: 'تواصل' },
              { key: 'dashboard', en: 'Dashboard', ar: 'لوحة التحكم' },
            ].map(item => (
              <span
                key={item.key}
                className={`${styles.navLink} ${page === item.key ? styles.active : ''}`}
                onClick={() => setPage(item.key)}
              >{t(item.en, item.ar)}</span>
            ))}
          </div>
          <div className={styles.navRight}>
            <button className={styles.langBtn} onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}>
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <div className={styles.cartBtn} onClick={() => setPage('cart')}>
              🛍 {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
            </div>
          </div>
        </nav>

        {/* ── HOME ── */}
        {page === 'home' && (
          <div className={styles.hero}>
            <div className={styles.heroLeft}>
              <p className={styles.heroTag}>{t('New Collection 2025', 'الكوليكشن الجديد 2025')}</p>
              <h1 className={styles.heroTitle}>
                {t(<>Wear the<br /><em>Mood,</em><br />Own the Look</>, <>البسي<br /><em>الإحساس،</em><br />امتلكي الإطلالة</>)}
              </h1>
              <p className={styles.heroSub}>{t('Curated fashion for the modern woman — minimal, elegant, timeless.', 'أزياء مختارة للمرأة العصرية — بسيطة، أنيقة، خالدة.')}</p>
              <button className={styles.heroCta} onClick={() => setPage('products')}>
                {t('Explore Collection →', 'تصفح الكوليكشن ←')}
              </button>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <div style={{ width: 80, height: 6, background: '#e8e4dc', borderRadius: 2 }} />
                <div style={{ width: 80, height: 110, background: 'rgba(255,255,255,0.35)', borderRadius: 1 }} />
                <div style={{ width: 60, height: 6, background: '#e8e4dc', borderRadius: 2 }} />
                <div style={{ width: 40, height: 6, background: '#e8e4dc', borderRadius: 2 }} />
              </div>
              <div className={styles.heroBadge}>{t('Free Shipping', 'شحن مجاني')}</div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {page === 'products' && (
          <>
            <div className={styles.productsHeader}>
              <h2 className={styles.productsTitle}>{t('All Products', 'كل المنتجات')}</h2>
              <div className={styles.filters}>
                {[
                  { key: 'all',     en: 'All',     ar: 'الكل' },
                  { key: 'dresses', en: 'Dresses',  ar: 'فساتين' },
                  { key: 'tops',    en: 'Tops',     ar: 'توبات' },
                  { key: 'bottoms', en: 'Bottoms',  ar: 'بناطيل' },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`${styles.filterChip} ${filter === f.key ? styles.active : ''}`}
                    onClick={() => setFilter(f.key)}
                  >{t(f.en, f.ar)}</button>
                ))}
              </div>
            </div>
            <div className={styles.productsGrid}>
              {filtered.map(p => (
                <div key={p.id} className={styles.prodCard}>
                  {p.sale && <div className={styles.prodBadge}>{t('Sale', 'خصم')}</div>}
                  <div className={styles.prodImg} style={{ background: p.bg }}>
                    <div style={{ width: 80, height: 120, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
                    <div className={styles.prodOverlay}>
                      <button className={styles.addBtn} onClick={() => addToCart(p)}>{t('Add to Cart', 'أضف للسلة')}</button>
                      <button className={styles.wishBtn}>♡</button>
                    </div>
                  </div>
                  <div className={styles.prodInfo}>
                    <p className={styles.prodBrand}>VELOUR</p>
                    <p className={styles.prodName}>{t(p.nameEn, p.nameAr)}</p>
                    <p className={styles.prodPrice}>EGP {p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CART ── */}
        {page === 'cart' && (
          <div className={styles.cartWrap}>
            <h2 className={styles.cartTitle}>{t('Shopping Cart', 'سلة الشراء')}</h2>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛍</div>
                <p>{t('Your cart is empty', 'السلة فاضية')}</p>
                <button className={styles.goShop} onClick={() => setPage('products')}>{t('Shop Now', 'تسوق دلوقتي')}</button>
              </div>
            ) : (
              <div className={styles.cartLayout}>
                <div className={styles.cartItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.cartItemImg} style={{ background: item.bg }}>
                        <div style={{ width: 50, height: 70, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
                      </div>
                      <div className={styles.cartItemInfo}>
                        <p className={styles.cartItemName}>{t(item.nameEn, item.nameAr)}</p>
                        <p className={styles.cartItemMeta}>EGP {item.price}</p>
                        <div className={styles.qtyControl}>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                          <span className={styles.qtyNum}>{item.qty}</span>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.id, +1)}>+</button>
                        </div>
                      </div>
                      <p className={styles.cartItemPrice}>EGP {item.price * item.qty}</p>
                      <button className={styles.removeBtn} onClick={() => changeQty(item.id, -item.qty)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className={styles.cartSummary}>
                  <p className={styles.summaryTitle}>{t('Order Summary', 'ملخص الطلب')}</p>
                  <div className={styles.summaryRow}><span>{t('Subtotal', 'المجموع')}</span><span>EGP {cartTotal}</span></div>
                  <div className={styles.summaryRow}><span>{t('Shipping', 'الشحن')}</span><span>{t('Free', 'مجاني')}</span></div>
                  <div className={`${styles.summaryRow} ${styles.total}`}><span>{t('Total', 'الإجمالي')}</span><span>EGP {cartTotal}</span></div>

                  <p className={styles.payLabel}>{t('Pay with:', 'ادفع بـ:')}</p>
                  <button className={styles.paymobBtn} onClick={checkoutPaymob} disabled={!!loading}>
                    {loading === 'paymob' ? '...' : t('💳 Paymob (Cards / Wallet)', '💳 Paymob (كارت / محفظة)')}
                  </button>
                  <button className={styles.stripeBtn} onClick={checkoutStripe} disabled={!!loading}>
                    {loading === 'stripe' ? '...' : t('💳 Stripe (International)', '💳 Stripe (دولي)')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONTACT ── */}
        {page === 'contact' && (
          <div className={styles.contactWrap}>
            <h2 className={styles.contactTitle}>{t('Get in Touch', 'تواصل معنا')}</h2>
            <p className={styles.contactSub}>{t("Have a question or need help with your order? We're here for you.", 'عندك سؤال أو محتاج مساعدة في طلبك؟ إحنا هنا.')}</p>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}><label className={styles.formLabel}>{t('First Name', 'الاسم الأول')}</label><input className={styles.formInput} type="text" /></div>
              <div className={styles.formGroup}><label className={styles.formLabel}>{t('Last Name', 'الاسم الأخير')}</label><input className={styles.formInput} type="text" /></div>
              <div className={`${styles.formGroup} ${styles.full}`}><label className={styles.formLabel}>{t('Email', 'البريد الإلكتروني')}</label><input className={styles.formInput} type="email" /></div>
              <div className={`${styles.formGroup} ${styles.full}`}><label className={styles.formLabel}>{t('Message', 'الرسالة')}</label><textarea className={styles.formTextarea} /></div>
            </div>
            <button className={styles.submitBtn}>{t('Send Message', 'إرسال')}</button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {page === 'dashboard' && (
          <div className={styles.dashWrap}>
            <h2 className={styles.dashTitle}>{t('Dashboard', 'لوحة التحكم')}</h2>
            <div className={styles.dashStats}>
              {[
                { en: 'Revenue',   ar: 'المبيعات',  val: '84,230', change: '↑ 12%' },
                { en: 'Orders',    ar: 'الطلبات',   val: '342',    change: '↑ 8%'  },
                { en: 'Customers', ar: 'العملاء',   val: '1,204',  change: '↑ 5%'  },
                { en: 'Returns',   ar: 'الإرجاع',   val: '3.2%',   change: '↑ 0.4%', down: true },
              ].map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <p className={styles.statLabel}>{t(s.en, s.ar)}</p>
                  <p className={styles.statValue}>{s.val}</p>
                  <p className={`${styles.statChange} ${s.down ? styles.down : ''}`}>{s.change}</p>
                </div>
              ))}
            </div>
            <div className={styles.dashCard}>
              <p className={styles.dashCardTitle}>{t('Recent Orders', 'آخر الطلبات')}</p>
              {[
                { id: '#4821', name: 'Sara Ahmed',  amount: 890,   status: 'delivered' },
                { id: '#4820', name: 'Nour Ali',    amount: 1240,  status: 'pending'   },
                { id: '#4819', name: 'Mona Hassan', amount: 560,   status: 'delivered' },
                { id: '#4818', name: 'Layla Omar',  amount: 2100,  status: 'cancelled' },
              ].map(o => (
                <div key={o.id} className={styles.orderRow}>
                  <span className={styles.orderId}>{o.id}</span>
                  <span className={styles.orderName}>{o.name}</span>
                  <span className={styles.orderAmount}>EGP {o.amount}</span>
                  <span className={`${styles.statusBadge} ${styles['status_' + o.status]}`}>
                    {t(
                      o.status === 'delivered' ? 'Delivered' : o.status === 'pending' ? 'Pending' : 'Cancelled',
                      o.status === 'delivered' ? 'تم التوصيل' : o.status === 'pending' ? 'قيد المعالجة' : 'ملغي'
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
