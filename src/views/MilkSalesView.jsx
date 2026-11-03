import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Printer,
  Search,
  CreditCard,
  CheckCircle,
  FileText,
  DollarSign,
  Tag
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { PrintReceiptModal } from '../components/common/PrintReceiptModal';

export const MilkSalesView = () => {
  const { products, sales, addSale, customers, showToast } = useDairy();

  // Cart State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+91 98000 00000');
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0); // 0% on fresh liquid milk/paneer, customizable
  const [paymentMethod, setPaymentMethod] = useState('UPI / PhonePe');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Slip Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock!`, 'warning');
      return;
    }
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        showToast(`Cannot add more than available stock (${product.stock})`, 'warning');
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.price } : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        total: product.price
      }]);
    }
  };

  const updateCartQty = (productId, delta) => {
    const prod = products.find(p => p.id === productId);
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const nextQty = item.qty + delta;
        if (nextQty <= 0) return null;
        if (prod && nextQty > prod.stock) {
          showToast(`Only ${prod.stock} units available in inventory`, 'warning');
          return item;
        }
        return { ...item, qty: nextQty, total: nextQty * item.price };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Financial Calculations
  const subtotal = cart.reduce((acc, it) => acc + it.total, 0);
  const taxAmount = (subtotal * parseFloat(taxPercent || 0)) / 100;
  const netTotal = Math.max(0, subtotal - parseFloat(discount || 0) + taxAmount);

  // Complete Checkout
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Cart is empty. Add products to generate bill.', 'warning');
      return;
    }

    const newSale = addSale({
      customerName,
      phone: customerPhone,
      items: cart,
      subtotal,
      discount: parseFloat(discount) || 0,
      tax: taxAmount,
      total: netTotal,
      paymentMethod
    });

    // Clear cart and show invoice receipt modal
    clearCart();
    setSelectedInvoice(newSale);
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Milk Sales & POS Billing</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Point of sale terminal for retail milk, bilona ghee, and value-added dairy orders with instant receipt printing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge-dairy success" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            POS Terminal Active • Auto-Deduct Stock
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Product Selector Catalog */}
        <div className="col-12 col-lg-7 col-xl-8">
          {/* Search & Categories */}
          <div className="card-dairy mb-3">
            <div className="card-dairy-body" style={{ padding: '0.85rem 1rem' }}>
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-6">
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-control-dairy"
                      placeholder="Quick search product..."
                      style={{ paddingLeft: '36px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {categories.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedCategory(c)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          border: `1px solid ${selectedCategory === c ? 'var(--primary)' : 'var(--border)'}`,
                          backgroundColor: selectedCategory === c ? 'var(--primary)' : '#ffffff',
                          color: selectedCategory === c ? '#ffffff' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="row g-3">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="col-12 col-sm-6 col-xl-4">
                <div
                  className="pos-product-card"
                  onClick={() => addToCart(prod)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span className="badge-dairy info" style={{ fontSize: '0.68rem' }}>
                      {prod.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: prod.stock > prod.minStock ? 'var(--success)' : 'var(--danger)' }}>
                      {prod.stock} in stock
                    </span>
                  </div>

                  <div className="fw-bold" style={{ fontSize: '0.95rem', marginBottom: '2px' }}>
                    {prod.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {prod.unit}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="fw-bold text-success" style={{ fontSize: '1.15rem', fontFamily: 'Outfit' }}>
                      ₹{prod.price.toFixed(2)}
                    </span>
                    <button
                      className="btn-dairy btn-primary-dairy btn-sm-dairy"
                      disabled={prod.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod);
                      }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Past Invoices Summary Table */}
          <div className="card-dairy mt-4">
            <div className="card-dairy-header">
              <div className="card-dairy-title">
                <FileText size={18} className="text-primary" />
                <span>Today's Sales Register</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table-dairy">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Payment Mode</th>
                    <th>Total (₹)</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(s => (
                    <tr key={s.id}>
                      <td className="mono-font fw-bold text-primary">#{s.id}</td>
                      <td>
                        <div className="fw-semibold">{s.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.phone}</div>
                      </td>
                      <td>{s.items.length} items</td>
                      <td>{s.paymentMethod}</td>
                      <td className="fw-bold text-success">₹{s.total.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-icon"
                          title="Print Receipt"
                          onClick={() => setSelectedInvoice(s)}
                        >
                          <Printer size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Active Billing Cart & Terminal */}
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="card-dairy" style={{ position: 'sticky', top: '90px' }}>
            <div className="card-dairy-header">
              <div className="card-dairy-title">
                <ShoppingBag size={18} className="text-primary" />
                <span>Current Billing Order</span>
              </div>
              {cart.length > 0 && (
                <button
                  className="btn-dairy btn-secondary-dairy btn-sm-dairy"
                  onClick={clearCart}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="card-dairy-body">
              {/* Customer Selector / Walk-in input */}
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    className="form-control-dairy"
                    placeholder="Walk-in or Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <select
                    className="form-control-dairy"
                    style={{ width: '110px' }}
                    onChange={(e) => {
                      if (e.target.value) {
                        const found = customers.find(c => c.id === e.target.value);
                        if (found) {
                          setCustomerName(found.name);
                          setCustomerPhone(found.phone);
                        }
                      }
                    }}
                  >
                    <option value="">Choose</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cart Items List */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                {cart.length > 0 ? (
                  cart.map(item => (
                    <div
                      key={item.productId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ₹{item.price} each
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '10px' }}>
                        <button
                          className="btn-icon"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => updateCartQty(item.productId, -1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="fw-bold" style={{ fontSize: '0.85rem', minWidth: '18px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          className="btn-icon"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => updateCartQty(item.productId, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem' }}>
                        ₹{item.total.toFixed(2)}
                      </div>

                      <button
                        className="btn-icon text-danger"
                        style={{ width: '24px', height: '24px', marginLeft: '6px' }}
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={32} style={{ opacity: 0.4, marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.85rem' }}>Select items from the catalog to build cart</div>
                  </div>
                )}
              </div>

              {/* Subtotal & Adjustments */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '80px', padding: '2px 6px', textAlign: 'right', border: '1px solid var(--border)', borderRadius: '4px' }}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span>GST Tax (%):</span>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '80px', padding: '2px 6px', textAlign: 'right', border: '1px solid var(--border)', borderRadius: '4px' }}
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="fw-bold" style={{ fontSize: '1rem' }}>Net Amount:</span>
                  <span className="fw-bold text-success" style={{ fontSize: '1.4rem', fontFamily: 'Outfit' }}>
                    ₹{netTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control-dairy"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="UPI / PhonePe">UPI (Google Pay / PhonePe / QR)</option>
                  <option value="Cash">Cash Currency</option>
                  <option value="Credit / Debit Card">Credit / Debit Card Swipe</option>
                  <option value="Bank Transfer (IMPS)">Bank Transfer (IMPS / NEFT)</option>
                </select>
              </div>

              {/* Checkout Button */}
              <button
                className="btn-dairy btn-primary-dairy"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <CheckCircle size={18} /> Generate Invoice & Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <PrintReceiptModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          data={selectedInvoice}
          type="sales"
        />
      )}
    </div>
  );
};
