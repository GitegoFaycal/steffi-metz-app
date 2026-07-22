import SectionTitle from '../components/SectionTitle';
import Newsletter from './Newsletter';
import Boxes from './Boxes';
import Events from './Events';
import Loyalty from './Loyalty';
import Community from './Community';
import Marquee from '../components/Marquee';

const hero = '/assets/image-3.jpg';
const about1 = '/assets/image-4.jpg';
const about2 = '/assets/image-5.jpg';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen grid lg:grid-cols-[54%_46%]">
        <div className="bg-olive-dark flex flex-col justify-center px-6 md:px-16 pt-28 pb-24">
          <div className="text-white/40 text-xs tracking-[.28em] uppercase mb-5">
            Kigali, Rwanda · Since 2020
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-cream font-light leading-tight">
            Handcrafted with
            <br />
            love{' '}
            <em className="text-orange-200/80">
              made for
              <br />
              real food lovers
            </em>
          </h1>

          <p className="text-white/50 max-w-md leading-8 mt-6 font-light">
            Artisan breads, handmade cheeses, fermented kombucha, gourmet boxes,
            cooking classes, events and catering. All made fresh in Kigali.
          </p>

          <div className="grid grid-cols-4 max-w-lg border border-white/10 bg-white/5 mt-8 text-center">
            <div className="p-3">
              <b className="font-serif text-white text-2xl">0%</b>
              <p className="text-[.55rem] text-white/35 uppercase">
                Curious
              </p>
            </div>

            <div className="p-3">
              <b className="font-serif text-white text-2xl">10%</b>
              <p className="text-[.55rem] text-white/35 uppercase">
                Regular
              </p>
            </div>

            <div className="p-3">
              <b className="font-serif text-white text-2xl">20%</b>
              <p className="text-[.55rem] text-white/35 uppercase">
                Insider
              </p>
            </div>

            <div className="p-3">
              <b className="font-serif text-white text-2xl">25%</b>
              <p className="text-[.55rem] text-white/35 uppercase">
                VIP
              </p>
            </div>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#boxes"
              className="bg-bordeaux text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Explore Boxes
            </a>

            <a
              href="#loyalty"
              className="border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-olive-dark transition"
            >
              View Loyalty
            </a>
          </div>
        </div>

        <div
          className="hidden lg:block bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${hero})`,
          }}
        />
      </section>

      <Marquee />

      {/* About */}
      <section className="section bg-linen">
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[520px]">
            <div
              className="absolute top-0 left-0 w-2/3 h-[85%] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${about1})`,
              }}
            />

            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat border-8 border-cream"
              style={{
                backgroundImage: `url(${about2})`,
              }}
            />
          </div>

          <div>
            <SectionTitle
              eyebrow="About Steffi"
              title={`European chef,<br/><em>Kigali heart</em>`}
            >
              The Gourmet Shop brings European craft, fresh local ingredients
              and warm community experiences together in Kigali.
            </SectionTitle>

            <blockquote className="font-serif italic text-2xl text-olive-dark leading-9 border-l-2 border-bordeaux pl-5">
              “Food should feel generous, beautiful and real — handmade with
              love.”
            </blockquote>

            <a
              href="#community"
              className="inline-block mt-8 bg-bordeaux text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Join the Community
            </a>
          </div>
        </div>
      </section>

      <div id="boxes">
        <Boxes />
      </div>

      <div id="events">
        <Events />
      </div>

      <div id="loyalty">
        <Loyalty />
      </div>

      <div id="community">
        <Community />
      </div>

      <Newsletter />
    </>
  );
}