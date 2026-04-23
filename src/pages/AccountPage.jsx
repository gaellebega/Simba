import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AccountPage() {
  const { currentUser, store } = useSimba();

  const orders = useMemo(() => (
    store.orders.filter((order) => order.userId === currentUser?.id)
  ), [store.orders, currentUser]);

  return (
    <div className="simba-page">
      <section className="simba-account-header simba-panel">
        <div>
          <h1>{currentUser?.name}</h1>
          <p>{currentUser?.email}</p>
          <p>Role: {currentUser?.role}</p>
        </div>
        <Link className="simba-primary-button" to="/catalog">Continue shopping</Link>
      </section>

      <section className="simba-section">
        <div className="simba-section-heading">
          <h2>Your orders</h2>
          <p>Track pending, processing, delivered and cancelled orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="simba-empty-state">No orders yet.</div>
        ) : (
          <div className="simba-table-wrap">
            <table className="simba-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.branchName}</td>
                    <td>{order.status}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
