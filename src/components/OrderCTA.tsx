'use client';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/store/lang';
import { IconShop } from '@/components/icons';

export default function OrderCTA() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      id="order"
      className="section-spacing"
      style={{
        background: `linear-gradient(135deg, oklch(95% 0.03 55) 0%, oklch(93% 0.05 315 / 0.5) 100%)`,
      }}
    >
      <div className="section-inner">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'center',
          }}
          className="order-grid"
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src="/bar-product.png"
              alt="ТЕПЕ bite — Солен карамел"
              width={260}
              height={260}
              style={{
                width: 'clamp(160px, 22vw, 260px)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 16px 32px oklch(32% 0.09 315 / 0.22))',
                transform: 'rotate(8deg)',
              }}
            />
          </div>

          <div>
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {lang === 'bg' ? 'Поръчай' : 'Order'}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              {lang === 'bg'
                ? 'Готов ли си да опиташ ТЕПЕ bite?'
                : 'Ready to try ТЕПЕ bite?'}
            </h2>
            <p style={{ fontSize: '1.05rem', maxWidth: 480, marginBottom: 32 }}>
              {lang === 'bg'
                ? 'Поръчай барчето със солен карамел и подкрепи първите ни инициативи още сега.'
                : 'Order the salted caramel bar and support our first initiatives right now.'}
            </p>
            <a
              href="/order.html"
              className="btn btn-caramel"
              style={{ fontSize: '1.05rem', padding: '16px 36px' }}
            >
              <IconShop />
              {lang === 'bg' ? 'Поръчай сега' : 'Order Now'}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .order-grid {
            grid-template-columns: 1fr !important;
          }
          .order-grid > div:first-child {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
}
