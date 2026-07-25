import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/eventsApi';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const emptyForm = {
  title: '',
  price: '',
  badge: '',
  description: '',
  event_date: '',
  event_time: '',
  location: '',
  status: 'active',
};

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

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return '';
  }

  return String(dateValue).slice(0, 10);
}

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data.events || data.data || data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreview('');
  };

  const handleEdit = (eventItem) => {
    setEditingId(eventItem.id);

    setForm({
      title: eventItem.title || '',
      price: eventItem.price || '',
      badge: eventItem.badge || '',
      description: eventItem.description || '',
      event_date: formatDateForInput(eventItem.event_date),
      event_time: eventItem.event_time || '',
      location: eventItem.location || '',
      status: eventItem.status || 'active',
    });

    setPreview(getImageUrl(eventItem.image || ''));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('price', form.price);
      formData.append('badge', form.badge);
      formData.append('description', form.description);
      formData.append('event_date', form.event_date);
      formData.append('event_time', form.event_time);
      formData.append('location', form.location);
      formData.append('status', form.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await updateEvent(editingId, formData);
        setMessage('Event updated successfully.');
      } else {
        await createEvent(formData);
        setMessage('Event created successfully.');
      }

      resetForm();
      await loadEvents();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save event.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this event?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Content Manager
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Events Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Manage cooking classes, tasting evenings, catering events, dates,
          times, location, and booking details.
        </p>

        <p className="text-stone-500 mt-3 text-sm leading-6">
          To add changing event background pictures, upload images in Gallery
          Manager and set category to <strong>events-background</strong>.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <h2 className="font-serif text-3xl text-olive-dark">
            {editingId ? 'Update Event' : 'Add Event'}
          </h2>

          <FormInput
            label="Event Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="From 35,000 RWF"
          />

          <FormInput
            label="Badge"
            name="badge"
            value={form.badge}
            onChange={handleChange}
            placeholder="Weekly"
          />

          <FormInput
            label="Event Date"
            name="event_date"
            type="date"
            value={form.event_date}
            onChange={handleChange}
          />

          <FormInput
            label="Event Time"
            name="event_time"
            value={form.event_time}
            onChange={handleChange}
            placeholder="10:00 - 13:00"
          />

          <FormInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Kigali, Rwanda"
          />

          <FormInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            textarea
            required
          />

          <div>
            <label className="block text-sm font-medium text-olive-dark mb-2">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <ImageUpload
            label="Event Image"
            imagePreview={preview}
            onChange={handleImageChange}
            onRemove={() => {
              setImageFile(null);
              setPreview('');
            }}
          />

          {message && (
            <p className="text-sm text-olive-dark">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition"
          >
            {editingId ? 'Update Event' : 'Create Event'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-bordeaux text-bordeaux px-6 py-3 rounded uppercase tracking-wider text-sm"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Existing Events
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Title</th>
                <th>Price</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((eventItem) => (
                <tr key={eventItem.id} className="border-b border-olive/10">
                  <td className="py-4 font-medium text-olive-dark">
                    {eventItem.title}
                  </td>

                  <td>{eventItem.price}</td>

                  <td>{formatDateForInput(eventItem.event_date) || '-'}</td>

                  <td>{eventItem.event_time || '-'}</td>

                  <td>{eventItem.location || '-'}</td>

                  <td>{eventItem.status}</td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(eventItem)}
                        className="text-bordeaux underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(eventItem.id)}
                        className="text-stone-500 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}