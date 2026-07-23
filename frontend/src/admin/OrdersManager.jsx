import { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  searchOrders,
} from '../api/ordersApi';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.orders || data.data || data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!keyword.trim()) {
      loadOrders();
      return;
    }

    try {
      const data = await searchOrders(keyword);
      setOrders(data.orders || data.data || data || []);
    } catch (error) {
      console.error('Failed to search orders:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    setNotice('');

    try {
      await updateOrderStatus(id, status);
      setNotice('Order status updated.');
      await loadOrders();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Failed to update order.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this order?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(id);
      await loadOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-olive/10 rounded-xl p-8">
        <p className="text-stone-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Sales
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Orders Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          View customer orders, update order status, search orders, and remove
          old records.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white border border-olive/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by customer, phone, email, item..."
          className="input flex-1"
        />

        <button
          type="submit"
          className="bg-bordeaux text-white px-5 py-3 rounded uppercase tracking-wider text-xs hover:bg-[#b03358] transition inline-flex items-center justify-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
      </form>

      {notice && (
        <p className="mb-4 text-sm text-olive-dark">
          {notice}
        </p>
      )}

      <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
        <h2 className="font-serif text-3xl text-olive-dark mb-5">
          Orders
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b">
              <th className="py-3">Customer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-olive/10">
                <td className="py-4">
                  <p className="font-medium text-olive-dark">
                    {order.customer_name || order.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {order.phone}
                  </p>
                  {order.email && (
                    <p className="text-xs text-stone-500">
                      {order.email}
                    </p>
                  )}
                </td>

                <td className="text-stone-700">
                  {order.item}
                </td>

                <td>
                  {Number(order.amount || 0).toLocaleString()} RWF
                </td>

                <td>
                  <span className="px-2 py-1 rounded-full text-xs bg-linen text-olive-dark">
                    {order.payment_status || order.paymentStatus || 'unpaid'}
                  </span>
                </td>

                <td>
                  <select
                    value={order.status || 'pending'}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value)
                    }
                    className="border border-olive/20 px-3 py-2 rounded bg-white text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="text-stone-500">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : '-'}
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(order.id)}
                    className="inline-flex items-center gap-1 text-stone-500 underline"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-stone-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}