import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import FormInput from '../components/FormInput';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from '../api/usersApi';

const emptyForm = {
  name: '',
  email: '',
  role: 'admin',
  password: '',
};

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || data.data || data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setNotice('');
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'admin',
      password: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice('');

    try {
      if (editingId) {
        await updateUser(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });

        if (form.password.trim()) {
          await updateUserPassword(editingId, {
            password: form.password,
          });
        }

        setNotice('User updated successfully.');
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        });

        setNotice('User created successfully.');
      }

      resetForm();
      await loadUsers();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this user?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Access Control
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Users Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Create, update, and delete admin users who can access the website
          dashboard.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-bordeaux text-white flex items-center justify-center">
              <UserPlus size={20} />
            </div>

            <h2 className="font-serif text-3xl text-olive-dark">
              {editingId ? 'Update User' : 'Add User'}
            </h2>
          </div>

          <FormInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Admin User"
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />

          <div className="grid gap-2">
            <label
              htmlFor="role"
              className="text-xs uppercase tracking-[.16em] text-stone-500"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <FormInput
            label={editingId ? 'New Password Optional' : 'Password'}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              editingId
                ? 'Leave empty to keep current password'
                : 'Enter password'
            }
            required={!editingId}
          />

          {notice && (
            <p className="text-sm text-olive-dark">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading
              ? 'Saving...'
              : editingId
                ? 'Update User'
                : 'Create User'}
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
            Existing Users
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-olive/10">
                  <td className="py-4 font-medium text-olive-dark">
                    {user.name}
                  </td>

                  <td className="text-stone-600">
                    {user.email}
                  </td>

                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-linen text-olive-dark uppercase">
                      {user.role}
                    </span>
                  </td>

                  <td className="text-stone-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : '-'}
                  </td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center gap-1 text-bordeaux underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center gap-1 text-stone-500 underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-stone-500"
                  >
                    No users found.
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