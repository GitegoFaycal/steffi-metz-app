import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { getLoyaltyTiers } from '../api/loyaltyApi';
import { whatsapp } from '../api/index';

const defaultTiers = [
  {
    icon: '🌱',
    name: 'Gourmet Curious',
    monthly_spend: '0 RWF/month',
    discount: '0%',
    benefits: 'App access & community · Free monthly recipe',
  },
  {
    icon: '⭐',
    name: 'Gourmet Regular',
    monthly_spend: '100,000 RWF/month',
    discount: '10%',
    benefits: '10% off all boxes & products · Priority event booking',
  },
  {
    icon: '🥇',
    name: 'Gourmet Gold',
    monthly_spend: '250,000 RWF/month',
    discount: '15%',
    benefits: '15% off everything · 1 free event per month',
  },
  {
    icon: '💎',
    name: 'Gourmet Connoisseur',
    monthly_spend: '500,000 RWF/month',
    discount: '20%',
    benefits: '20% off all orders · All regular events at no cost',
  },
  {
    icon: '👑',
    name: 'Gourmet VIP',
    monthly_spend: '1,000,000 RWF/month',
    discount: '25%',
    benefits: '25% off everything, always · All events permanently included',
  },
];

function getDiscountNumber(discount) {
  return Number(String(discount).replace('%', '').trim()) || 0;
}

export default function Loyalty() {
  const [tiers, setTiers] = useState(defaultTiers);

  useEffect(() => {
    async function loadTiers() {
      try {
        const data = await getLoyaltyTiers();
        setTiers(data.tiers || defaultTiers);
      } catch (error) {
        console.error('Failed to load loyalty tiers:', error);
      }
    }

    loadTiers();
  }, []);

  const exampleAmount = 250000;

  const savingsRows = tiers
    .filter((tier) => getDiscountNumber(tier.discount) > 0)
    .map((tier) => {
      const discountNumber = getDiscountNumber(tier.discount);
      const saving = (exampleAmount * discountNumber) / 100;

      return {
        name: tier.name.replace('Gourmet ', ''),
        discount: tier.discount,
        saving,
      };
    });

  return (
    <section id="loyalty" className="section bg-bordeaux text-white pt-32">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[45%_55%] gap-12 items-start">
        <div>
          <SectionTitle
            eyebrow="Why become a member?"
            title={`Order more,<br/><em>save more — every month</em>`}
            light
          >
            The Steffi Metz loyalty programme rewards you automatically. Every
            purchase, every event, every referral earns points. The more you
            engage, the more value you unlock.
          </SectionTitle>

          <div className="bg-black/15 border-l-2 border-orange-200/50 p-6 mt-8">
            <p className="text-[.65rem] uppercase tracking-[.2em] text-orange-200/70 mb-5">
              💰 Example savings — 250,000 RWF/month
            </p>

            <div className="grid gap-4">
              {savingsRows.map((row) => (
                <div
                  key={row.name}
                  className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0"
                >
                  <span className="text-white/65">
                    {row.name} ({row.discount})
                  </span>

                  <span className="font-serif text-orange-100">
                    Save {row.saving.toLocaleString()} RWF/month
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              type="button"
              onClick={() =>
                whatsapp(
                  'Hi Steffi! I would like to join the Gourmet loyalty programme.'
                )
              }
              className="bg-[#25D366] text-white px-6 py-3 rounded-none uppercase tracking-[.16em] text-xs font-medium inline-flex items-center gap-2 hover:bg-[#1da85a] transition"
            >
              <MessageCircle size={16} />
              Join via WhatsApp
            </button>

            <button
              type="button"
              onClick={() => {
                const section = document.getElementById('loyalty-tiers');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-white/25 text-white px-6 py-3 rounded-none uppercase tracking-[.16em] text-xs hover:bg-white hover:text-bordeaux transition"
            >
              See all {tiers.length} tiers →
            </button>
          </div>
        </div>

        <div id="loyalty-tiers" className="grid gap-3">
          {tiers.map((tier) => (
            <div
              key={tier.id || tier.name}
              className="bg-white/8 border border-white/5 px-6 py-5 grid grid-cols-[48px_1fr_auto] gap-4 items-center hover:bg-white/12 transition"
            >
              <div className="text-3xl">
                {tier.icon || '★'}
              </div>

              <div>
                <h3 className="font-serif text-xl text-white">
                  {tier.name}
                </h3>

                <p className="text-white/45 text-xs mt-1">
                  {tier.monthly_spend}
                </p>

                <p className="text-white/50 text-xs mt-1">
                  {tier.benefits}
                </p>
              </div>

              <div className="font-serif text-3xl text-orange-100">
                {tier.discount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}