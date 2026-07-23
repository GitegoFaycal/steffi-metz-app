import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { getPayments } from '../api/ordersApi';

export default function PaymentsManager() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data.payments || data.data || data || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalAmount = payments.reduce((sum, payment) => {
    return sum + Number(payment.amount || 0);
  }, 0);

  if (loading) {
    return (
      <div className="bg-white border border-olive/10 rounded-xl p-8">
        <p className="text-stone-500">Loading payments...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Finance
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Payments Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          View all recorded payments from customer orders.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-7">
        <div className="bg-white border border-olive/10 rounded-xl p-6">
          <p className="text-xs uppercase tracking-[.16em] text-stone-500">
            Total Payments
          </p>
          <h2 className="font-serif text-4xl text-olive-dark mt-2">
            {payments.length}
          </h2>
        </div>

        <div className="bg-white border border-olive/10 rounded-xl p-6 md:col-span-2">
          <p className="text-xs uppercase tracking-[.16em] text-stone-500">
            Total Amount
          </p>
          <h2 className="font-serif text-4xl text-olive-dark mt-2">
            {totalAmount.toLocaleString()} RWF
          </h2>
        </div>
      </div>

      <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
        <h2 className="font-serif text-3xl text-olive-dark mb-5">
          Payment Records
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b">
              <th className="py-3">Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-olive/10">
                <td className="py-4">
                  <div className="flex items-center gap-2 text-olive-dark font-medium">
                    <CreditCard size={16} />
                    #{payment.id}
                  </div>
                </td>

                <td>#{payment.order_id || payment.orderId}</td>

                <td>
                  {Number(payment.amount || 0).toLocaleString()} RWF
                </td>

                <td>{payment.method || 'N/A'}</td>

                <td>
                  <span className="px-2 py-1 rounded-full text-xs bg-linen text-olive-dark">
                    {payment.status || 'paid-demo'}
                  </span>
                </td>

                <td className="text-stone-500">
                  {payment.created_at
                    ? new Date(payment.created_at).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-stone-500"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}