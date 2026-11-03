import React from 'react';
import { Printer } from 'lucide-react';
import { Modal } from './Modal';
import { useDairy } from '../../context/DairyContext';

export const PrintReceiptModal = ({ isOpen, onClose, data, type = 'milk' }) => {
  const { settings } = useDairy();

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'milk' ? 'Milk Collection Slip' : 'Sales Tax Invoice'}
      footer={
        <>
          <button className="btn-dairy btn-secondary-dairy" onClick={onClose}>
            Close
          </button>
          <button className="btn-dairy btn-primary-dairy" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>
        </>
      }
    >
      <div className="print-area">
        {type === 'milk' ? (
          <div className="thermal-slip">
            <div className="slip-header">
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>
                {settings.dairyName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>
                {settings.address}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                Contact: {settings.phone} | Reg: {settings.registrationNo}
              </div>
              <div style={{ marginTop: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                *** MILK COLLECTION RECEIPT ***
              </div>
            </div>

            <div className="slip-row">
              <span>Slip No:</span>
              <span style={{ fontWeight: 700 }}>{data.slipNo || 'SLIP-NEW'}</span>
            </div>
            <div className="slip-row">
              <span>Date & Time:</span>
              <span>{data.date} {data.time}</span>
            </div>
            <div className="slip-row">
              <span>Shift:</span>
              <span style={{ fontWeight: 700 }}>{data.shift}</span>
            </div>
            <div className="slip-divider"></div>

            <div className="slip-row">
              <span>Farmer ID:</span>
              <span style={{ fontWeight: 700 }}>{data.farmerId}</span>
            </div>
            <div className="slip-row">
              <span>Farmer Name:</span>
              <span style={{ fontWeight: 700 }}>{data.farmerName}</span>
            </div>
            <div className="slip-divider"></div>

            <div className="slip-row">
              <span>Milk Type:</span>
              <span style={{ fontWeight: 700 }}>{data.milkType} Milk</span>
            </div>
            <div className="slip-row">
              <span>Quantity:</span>
              <span style={{ fontWeight: 700 }}>{Number(data.quantity).toFixed(1)} Liters</span>
            </div>
            <div className="slip-row">
              <span>Fat %:</span>
              <span>{Number(data.fat).toFixed(1)}%</span>
            </div>
            <div className="slip-row">
              <span>SNF %:</span>
              <span>{Number(data.snf).toFixed(1)}%</span>
            </div>
            <div className="slip-row">
              <span>Rate / Liter:</span>
              <span>₹{Number(data.rate).toFixed(2)}</span>
            </div>

            <div className="slip-total">
              <span>TOTAL AMOUNT:</span>
              <span>₹{Number(data.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', textAlign: 'center', color: '#475569' }}>
              <div>Operator: {data.recordedBy || 'Center Desk'}</div>
              <div style={{ marginTop: '4px' }}>Thank you for providing pure milk!</div>
              <div>--- Computer Generated Voucher ---</div>
            </div>
          </div>
        ) : (
          <div className="thermal-slip" style={{ maxWidth: '420px' }}>
            <div className="slip-header">
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                {settings.dairyName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                GSTIN: {settings.gstNumber}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                {settings.address}
              </div>
              <div style={{ marginTop: '6px', fontWeight: 700 }}>
                RETAIL MILK SALES INVOICE
              </div>
            </div>

            <div className="slip-row">
              <span>Invoice No:</span>
              <span style={{ fontWeight: 700 }}>#{data.id}</span>
            </div>
            <div className="slip-row">
              <span>Date:</span>
              <span>{data.date}</span>
            </div>
            <div className="slip-row">
              <span>Customer:</span>
              <span style={{ fontWeight: 700 }}>{data.customerName}</span>
            </div>
            <div className="slip-row">
              <span>Phone:</span>
              <span>{data.phone}</span>
            </div>
            <div className="slip-divider"></div>

            <div style={{ marginBottom: '0.5rem' }}>
              <div className="slip-row" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
                <span>Item</span>
                <span>Qty x Rate</span>
                <span>Total</span>
              </div>
              <div className="slip-divider"></div>
              {data.items && data.items.map((it, idx) => (
                <div key={idx} className="slip-row" style={{ fontSize: '0.75rem' }}>
                  <span>{it.name}</span>
                  <span>{it.qty} x ₹{it.price}</span>
                  <span>₹{it.total}</span>
                </div>
              ))}
            </div>

            <div className="slip-divider"></div>
            <div className="slip-row">
              <span>Subtotal:</span>
              <span>₹{data.subtotal?.toFixed(2)}</span>
            </div>
            <div className="slip-row">
              <span>Discount:</span>
              <span>-₹{data.discount?.toFixed(2)}</span>
            </div>
            <div className="slip-total">
              <span>NET PAYABLE:</span>
              <span>₹{data.total?.toFixed(2)}</span>
            </div>
            <div className="slip-row" style={{ marginTop: '0.35rem' }}>
              <span>Payment Mode:</span>
              <span style={{ fontWeight: 700 }}>{data.paymentMethod}</span>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', textAlign: 'center', color: '#475569' }}>
              <div>Cashier: {data.servedBy}</div>
              <div style={{ marginTop: '4px' }}>AmritDhara: Purity & Health in Every Drop!</div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
