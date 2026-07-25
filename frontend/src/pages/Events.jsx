import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import api from '../api/axiosConfig';
import { getEvents } from '../api/eventsApi';
import { whatsapp } from '../api/index';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultBackgrounds = [
  '/assets/image-13.jpg',
  '/assets/image-12.jpg',
];

function getImageUrl(imagePath) {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_URL}${imagePath}`;
  }

  return imagePath;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Date to be confirmed';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Date to be confirmed';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDay(dateValue) {
  if (!dateValue) {
    return '--';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return String(date.getDate()).padStart(2, '0');
}

function getMonth(dateValue) {
  if (!dateValue) {
    return 'TBC';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'TBC';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [backgrounds, setBackgrounds] = useState(defaultBackgrounds);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    async function loadBackgrounds() {
      try {
        const response = await api.get('/gallery');
        const gallery = response.data.gallery || [];

        const eventBackgrounds = gallery
          .filter((item) => {
            const category = String(item.category || '').toLowerCase();
            return category.includes('events-background');
          })
          .map((item) => getImageUrl(item.image))
          .filter(Boolean);

        if (eventBackgrounds.length > 0) {
          setBackgrounds(eventBackgrounds);
        }
      } catch (error) {
        console.error('Failed to load event backgrounds:', error);
      }
    }

    loadBackgrounds();
  }, []);

  useEffect(() => {
    if (backgrounds.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === backgrounds.length - 1 ? 0 : currentIndex + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [backgrounds]);

  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
      .filter((event) => event.event_date)
      .filter((event) => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    return upcomingEvents[0] || events[0] || null;
  }, [events]);

  const bookEvent = (eventItem) => {
    whatsapp(
      `Hi Steffi! I would like to book: ${eventItem.title} (${eventItem.price}). Please confirm my spot!`
    );
  };

  return (
    <section
      id="events"
      className="relative min-h-[720px] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0">
        {backgrounds.map((background, index) => (
          <div
            key={`${background}-${index}`}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${background})`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-olive-dark/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-20 w-full">
        <div className="grid lg:grid-cols-[42%_58%] gap-10 items-start">
          <div className="bg-black/20 border border-white/10 p-7 md:p-10 backdrop-blur-sm">
            <SectionTitle
              eyebrow="At The Gourmet Shop"
              title={`Events &<br/><em>Experiences</em>`}
              light
            >
              Weekly cooking sessions, tasting evenings and monthly specials.
              Members get priority booking.
            </SectionTitle>

            {nextEvent && (
              <div className="bg-white/70 backdrop-blur-md text-olive-dark mt-6 p-5 border border-white/40 shadow-xl">
                <p className="text-[.65rem] uppercase tracking-[.25em] text-bordeaux mb-4">
                  Next Event
                </p>

                <div className="flex gap-5 items-start">
                  <div className="w-20 min-w-20 bg-bordeaux text-white text-center p-3">
                    <p className="text-xs uppercase tracking-widest">
                      {getMonth(nextEvent.event_date)}
                    </p>

                    <p className="font-serif text-3xl mt-1">
                      {getDay(nextEvent.event_date)}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-olive-dark">
                      {nextEvent.title}
                    </h3>

                    <p className="text-stone-700 text-sm mt-3 flex gap-2 items-center">
                      <CalendarDays size={15} />
                      {formatDate(nextEvent.event_date)}
                    </p>

                    {nextEvent.event_time && (
                      <p className="text-stone-700 text-sm mt-2 flex gap-2 items-center">
                        <Clock size={15} />
                        {nextEvent.event_time}
                      </p>
                    )}

                    {nextEvent.location && (
                      <p className="text-stone-700 text-sm mt-2 flex gap-2 items-center">
                        <MapPin size={15} />
                        {nextEvent.location}
                      </p>
                    )}

                    <p className="text-bordeaux font-semibold mt-4">
                      {nextEvent.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => bookEvent(nextEvent)}
                      className="mt-5 bg-[#25D366] text-white px-5 py-3 uppercase tracking-[.16em] text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#1ea954] transition"
                    >
                      <FaWhatsapp size={16} />
                      Book
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="text-white/60 text-xs leading-6 mt-6">
              To change the background images, upload pictures in Gallery
              Manager and set their category to <strong>events-background</strong>.
            </p>
          </div>

          <div className="grid gap-5">
            {events.map((eventItem) => (
              <div
                key={eventItem.id}
                className="bg-white/65 backdrop-blur-md border border-white/40 p-4 md:p-5 shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {eventItem.badge && (
                    <span className="text-[.6rem] uppercase tracking-widest text-bordeaux">
                      {eventItem.badge}
                    </span>
                  )}

                  {eventItem.event_date && (
                    <span className="text-[.6rem] uppercase tracking-widest text-stone-500">
                      {formatDate(eventItem.event_date)}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-olive-dark mt-2">
                  {eventItem.title}
                </h3>

                <p className="text-stone-700 text-sm leading-6 mt-2">
                  {eventItem.description}
                </p>

                <div className="grid gap-2 mt-4 text-sm text-stone-600">
                  {eventItem.event_time && (
                    <p className="flex items-center gap-2">
                      <Clock size={15} />
                      {eventItem.event_time}
                    </p>
                  )}

                  {eventItem.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {eventItem.location}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 mt-5">
                  <span className="font-semibold text-bordeaux">
                    {eventItem.price}
                  </span>

                  <button
                    type="button"
                    className="bg-bordeaux text-white px-4 py-2.5 uppercase tracking-[.15em] text-[11px] font-semibold inline-flex items-center gap-2 hover:bg-[#b03358] transition"
                    onClick={() => bookEvent(eventItem)}
                  >
                    <FaWhatsapp size={15} />
                    Book
                  </button>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="bg-white/70 backdrop-blur-md p-7 text-stone-700">
                No events available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}