// pages/order-success.js
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/store.module.css'

export default function OrderSuccess() {
  const router = useRouter()
  return (
    <>
      <Head><title>VELOUR — Order Confirmed</title></Head>
      <div className={styles.app}>
        <div className={styles.successPage}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successTitle}>Order Confirmed!</h1>
          <p className={styles.successSub}>شكراً لطلبك — سنتواصل معك قريباً لتأكيد التوصيل</p>
          <button className={styles.heroCta} onClick={() => router.push('/')}>
            ← Back to Store
          </button>
        </div>
      </div>
    </>
  )
}
