import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import Newsletter from "./Newsletter";
import Boxes from "./Boxes";
import Events from "./Events";
import Loyalty from "./Loyalty";
import Community from "./Community";
import Marquee from "../components/Marquee";

const hero = "/assets/image-3.jpg";
const about1 = "/assets/image-4.jpg";
const about2 = "/assets/image-5.jpg";

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="min-h-screen grid lg:grid-cols-[54%_46%]">
        <div className="bg-olive-dark flex flex-col justify-center px-6 md:px-16 pt-28 pb-24">
          <div className="text-white/40 text-xs tracking-[.28em] uppercase mb-5">
            Kigali, Rwanda · Since 2020
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-cream font-light leading-tight">
            Handcrafted with
            <br />
            love —{" "}
            <em className="text-orange-200/80">
              made for
              <br />
              real food lovers
            </em>
          </h1>

          <p className="text-white/50 max-w-md leading-8 mt-6 font-light">
            Artisan breads, handmade cheeses, fermented kombucha, gourmet
            boxes, cooking classes, events and catering. All made fresh in
            Kigali.
          </p>

          {/* Loyalty Preview */}
          <div className="max-w-xl border border-white/10 bg-white/5 mt-8 p-5 backdrop-blur-sm">
            <p className="text-[.6rem] text-orange-200/70 uppercase tracking-[.22em] mb-4">
              ★ Order more save more, every month
            </p>

            <div className="grid grid-cols-5 divide-x divide-white/10 text-center">
              {[
                ["0%", "Curious", "Free"],
                ["10%", "Regular", "100K RWF"],
                ["15%", "Gold", "250K RWF"],
                ["20%", "Connoisseur", "500K RWF"],
                ["25%", "VIP", "1M RWF"],
              ].map(([discount, level, spend]) => (
                <div key={level} className="px-2">
                  <b className="font-serif text-white text-2xl">
                    {discount}
                  </b>

                  <p className="text-[.55rem] uppercase mt-1 text-white/40">
                    {level}
                  </p>

                  <p className="text-[.5rem] uppercase text-white/25">
                    {spend}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#boxes" className="btn-primary">
              Explore Our Boxes
            </a>

            <a href="#loyalty" className="btn-outline">
              My Loyalty Savings →
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

      {/* ================= MARQUEE ================= */}
      <Marquee />

      {/* ================= ABOUT ================= */}
      <section className="section bg-linen">
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[520px]">
            <div
              className="absolute top-0 left-0 w-2/3 h-[85%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${about1})`,
              }}
            />

            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2 border-8 border-cream bg-cover bg-center"
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
              The Gourmet Shop brings European craft, fresh local ingredients,
              and warm community experiences together in Kigali.
            </SectionTitle>

            <blockquote className="font-serif italic text-2xl text-olive-dark leading-9 border-l-2 border-bordeaux pl-5">
              “Food should feel generous, beautiful and real — handmade with
              love.”
            </blockquote>

            <a
              href="#community"
              className="btn-primary mt-8 inline-flex"
            >
              Join the Community
            </a>
          </div>
        </div>
      </section>

      {/* ================= BOXES ================= */}
      <section id="boxes">
        <Boxes />
      </section>

      {/* ================= EVENTS ================= */}
      <section id="events">
        <Events />
      </section>

      {/* ================= LOYALTY ================= */}
      <section id="loyalty">
        <Loyalty />
      </section>

      {/* ================= COMMUNITY ================= */}
      <section id="community">
        <Community />
      </section>

      {/* ================= NEWSLETTER ================= */}
      <Newsletter />
    </>
  );
}