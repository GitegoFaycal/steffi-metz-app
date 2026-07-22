import { Link } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";

const logo = "/assets/image-1.png";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const links = [
    ["boxes", "Boxes"],
    ["events", "Events"],
    ["loyalty", "Loyalty"],
    ["community", "Community"],
  ];

  const scrollToSection = (id) => {
    setOpen(false);

    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-transparent">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">

            <img
              src={logo}
              alt="Steffi Metz"
              className="h-12 w-auto object-contain"
            />

            <span
              className="hidden md:block text-2xl font-serif text-cream [text-shadow:0_2px_8px_rgba(0,0,0,.8)]"
            >
              Steffi Metz
            </span>

          </Link>

          {/* Desktop Menu */}

          <div className="hidden lg:flex items-center gap-8">

            {links.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="uppercase tracking-[.15em] text-xs text-cream hover:text-orange-200 transition [text-shadow:0_2px_8px_rgba(0,0,0,.8)]"
              >
                {label}
              </button>
            ))}

            <a
              href="https://wa.me/c/250785211051"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full hover:scale-105 transition"
            >
              <MessageCircle size={16} />
              Catalogue
            </a>

          </div>

          {/* Mobile Button */}

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden"
          >
            <Menu
              size={28}
              className="text-white [filter:drop-shadow(0_2px_8px_rgba(0,0,0,.8))]"
            />
          </button>

        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <div className="fixed inset-0 z-[60] bg-olive-dark/95 flex flex-col items-center justify-center gap-8">

          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={30} />
          </button>

          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="text-3xl font-serif text-white hover:text-bordeaux transition"
            >
              {label}
            </button>
          ))}

          <a
            href="https://wa.me/c/250785211051"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[#25D366] text-2xl"
          >
            <MessageCircle />
            Catalogue
          </a>

        </div>
      )}

      {/* ================= CONTENT ================= */}

      <main>{children}</main>

      {/* ================= LOYALTY BAR ================= */}

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-olive-dark border-t border-bordeaux px-4 py-2 flex items-center gap-3">

        <span className="bg-bordeaux text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded">
          🌱 Gourmet Curious
        </span>

        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[6%] h-full bg-gradient-to-r from-bordeaux to-orange-500" />
        </div>

        <span className="hidden md:block text-white/60 text-xs">
          100,000 RWF/month → 10% off everything
        </span>

        <button
          onClick={() => scrollToSection("loyalty")}
          className="bg-bordeaux text-white text-xs uppercase tracking-wider px-3 py-2 rounded hover:opacity-90"
        >
          See Benefits →
        </button>

      </div>

      {/* ================= FOOTER ================= */}

      <footer className="bg-olive-dark text-white py-14 pb-24">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          <div>

            <img
              src={logo}
              alt="Steffi Metz"
              className="h-16 w-auto mb-4"
            />

            <p className="text-white/60 leading-7 text-sm">
              Artisan foods, catering, gourmet gift boxes, cooking classes and
              unforgettable culinary experiences handcrafted in Kigali.
            </p>

          </div>

          <div>

            <h3 className="font-serif text-2xl mb-4">
              Contact
            </h3>

            <p className="text-white/60 text-sm leading-7">
              Kigali, Rwanda
              <br />
              WhatsApp: +250 785 211 051
              <br />
              Email: hello@steffimetz.rw
            </p>

          </div>

          <div>

            <h3 className="font-serif text-2xl mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-white/60">

              {links.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-left hover:text-white transition"
                >
                  {label}
                </button>
              ))}

            </div>

          </div>

        </div>

      </footer>
    </>
  );
}