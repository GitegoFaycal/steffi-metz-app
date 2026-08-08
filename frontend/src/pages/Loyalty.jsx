import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
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
    discount: '20%',
    benefits: '20% off everything · 1 free event per month',
  },
  {
    icon: '💎',
    name: 'Gourmet Connoisseur',
    monthly_spend: '500,000 RWF/month',
    discount: '25%',
    benefits: '25% off all orders · All regular events at no cost',
  },
];

const joinButtonColors = [
  'bg-[#6f8f60]',
  'bg-[#927d5a]',
  'bg-[#dc7735]',
  'bg-[#466c42]',
  'bg-bordeaux',
];

function benefitsToArray(benefits) {
  if (!benefits) {
    return [];
  }

  return String(benefits)
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export default function Loyalty() {
  const [tiers, setTiers] = useState(defaultTiers);

  useEffect(() => {
    async function loadTiers() {
      try {
        const data = await getLoyaltyTiers();
        const apiTiers = data.tiers || [];

        if (apiTiers.length > 0) {
          setTiers(apiTiers);
        }
      } catch (error) {
        console.error('Failed to load loyalty tiers:', error);
      }
    }

    loadTiers();
  }, []);

  const joinProgramme = () => {
    whatsapp(
      'Hi Steffi! I would like to join the Gourmet loyalty programme.'
    );
  };

  const joinTier = (tierName) => {
    whatsapp(
      `Hi Steffi! I would like to join the ${tierName} loyalty tier.`
    );
  };

  return (
    <section
      id="loyalty"
      className="bg-[#f8f4ee] pt-24 pb-20 border-t border-bordeaux"
    >
      <div className="max-w-7xl mx-auto px-1 md:px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-bordeaux mb-4">
            4-Level Loyalty Programme
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-olive-dark font-light">
            The more you order,
            <br />
            <em className="text-bordeaux">
              the more you receive
            </em>
          </h2>

          <p className="text-stone-500 text-xs md:text-sm leading-7 mt-6 max-w-2xl mx-auto">
            Tracked automatically via the app. In-shop orders are added manually
            by Steffi. Your code arrives via WhatsApp when you reach a new tier.
          </p>
        </div>

        <div
          id="loyalty-tiers"
          className={`grid bg-white border border-stone-200 ${
            tiers.length === 4
              ? 'md:grid-cols-2 xl:grid-cols-4'
              : 'md:grid-cols-2 xl:grid-cols-5'
          }`}
        >
          {tiers.map((tier, index) => {
            const benefits = benefitsToArray(tier.benefits);
            const buttonColor =
              joinButtonColors[index % joinButtonColors.length];

            return (
              <article
                key={tier.id || tier.name}
                className="px-7 py-10 border-b md:border-r border-stone-200 xl:border-b-0 last:border-r-0 min-h-[430px] flex flex-col"
              >
                <div className="text-2xl mb-8">
                  {tier.icon || '★'}
                </div>

                <h3 className="font-serif text-base text-olive-dark leading-tight">
                  {tier.name}
                </h3>

                <p className="text-[0.63rem] text-stone-400 mt-1">
                  Your journey begins
                </p>

                <div className="mt-8">
                  <p className="font-serif text-3xl text-bordeaux leading-none">
                    {tier.discount}
                  </p>

                  <p className="text-[0.58rem] text-stone-400 mt-2">
                    {tier.monthly_spend}
                  </p>
                </div>

                <div className="h-px bg-stone-200 my-8" />

                <ul className="grid gap-7 text-[0.63rem] text-stone-600 leading-5 flex-1">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="text-bordeaux leading-5">
                        ✦
                      </span>

                      <span>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => joinTier(tier.name)}
                  className={`${buttonColor} mt-8 w-full text-white py-3 uppercase tracking-[0.18em] text-[0.62rem] font-bold hover:opacity-90 transition`}
                >
                  Join
                </button>
              </article>
            );
          })}
        </div>

        <div className="flex justify-center mt-9">
          <button
            type="button"
            onClick={joinProgramme}
            className="bg-bordeaux text-white px-10 py-4 uppercase tracking-[0.18em] text-xs font-bold inline-flex items-center gap-3 hover:bg-[#b03358] transition"
          >
            <FaWhatsapp size={15} />
            Join the Loyalty Programme
          </button>
        </div>
      </div>
    </section>
  );
}