import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const MilkProductsView = () => {
  const { products, addProduct, updateProductStock, setActiveTab, showToast } = useDairy();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAdjustDelta, setStockAdjustDelta] = useState(10);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Liquid Milk',
    sku: '',
    unit: '1 Liter Pouch',
    price: '',
    stock: 100,
    minStock: 20,
    description: ''
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please enter product name and price', 'warning');
      return;
    }
    addProduct({
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 10
    });
    setIsAddModalOpen(false);
  };

  const handleStockAdjustSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProductStock(selectedProduct.id, stockAdjustDelta);
      setIsAdjustModalOpen(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dairy Products & Stock</h1>
          <p className="text-sm text-slate-500">
            Fresh pasteurized milk pouches, Vedic bilona cow ghee, paneer, and fermented dairy products.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            className="btn-dairy btn-secondary-dairy"
            onClick={() => setActiveTab('sales')}
          >
            <ShoppingBag size={16} /> Open Sales POS
          </button>
          <button
            className="btn-dairy btn-primary-dairy"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} /> Add New Dairy Product
          </button>
        </div>
      </div>

      <div className="card-dairy mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center bg-gradient-to-br from-green-900 to-green-800 text-white rounded-2xl overflow-hidden">
          <div className="flex-1 basis-[340px] p-6 sm:p-7">
            <span className="inline-block bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold mb-3">
              Artisan & Farm Fresh
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Pure Traditional Processing
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              All AmritDhara dairy products are manufactured from same-day chilled milk sourced directly from our cooperative farmers with strict fat and purity controls.
            </p>
          </div>
          <div className="flex-1 basis-[240px] h-[180px] overflow-hidden">
            <img src="/dairy-products.jpg" alt="Dairy Products" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="card-dairy mb-4">
        <div className="card-dairy-body p-4 sm:p-5">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="form-control-dairy pl-9 text-xs"
                  placeholder="Search products by title or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-control-dairy"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>Category: {c}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-4 text-right">
              <span className="text-xs text-slate-500 font-semibold">
                {filteredProducts.length} Items Listed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-dairy">
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Packaging Unit</th>
                <th>Retail Price</th>
                <th>Available Stock</th>
                <th>Status</th>
                <th className="text-center">Stock Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-sm text-slate-800">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.description}</div>
                  </td>
                  <td>
                    <span className="badge-dairy info text-[11px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="font-mono font-semibold text-xs text-slate-700">
                    {p.sku}
                  </td>
                  <td>{p.unit}</td>
                  <td className="font-bold text-emerald-600 text-sm">
                    ₹{p.price.toFixed(2)}
                  </td>
                  <td>
                    <div className={`font-bold text-sm ${p.stock <= p.minStock ? 'text-rose-600' : 'text-slate-900'}`}>
                      {p.stock} Units
                    </div>
                    <div className="text-[11px] text-slate-400">Min: {p.minStock}</div>
                  </td>
                  <td>
                    <span className={`badge-dairy ${p.status === 'In Stock' ? 'success' : (p.status === 'Low Stock' ? 'warning' : 'danger')}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        className="btn-icon"
                        title="Quick Add 10 Units"
                        onClick={() => updateProductStock(p.id, 10)}
                      >
                        <PlusCircle size={16} className="text-success" />
                      </button>
                      <button
                        className="btn-icon"
                        title="Quick Deduct 1 Unit"
                        onClick={() => updateProductStock(p.id, -1)}
                      >
                        <MinusCircle size={16} className="text-danger" />
                      </button>
                      <button
                        className="btn-dairy btn-secondary-dairy btn-sm-dairy"
                        title="Adjust Stock Quantity"
                        onClick={() => {
                          setSelectedProduct(p);
                          setStockAdjustDelta(10);
                          setIsAdjustModalOpen(true);
                        }}
                      >
                        <ArrowUpDown size={13} /> Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dairy Product"
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleAddSubmit}>
              <CheckCircle size={16} /> Save Product
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Masala Paneer Cubes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-control-dairy"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Liquid Milk">Liquid Milk</option>
                <option value="Cultured Dairy">Cultured Dairy (Curd/Dahi)</option>
                <option value="Beverage">Beverage (Chaas/Lassi)</option>
                <option value="Clarified Butter">Clarified Butter (Ghee)</option>
                <option value="Cheese & Paneer">Cheese & Paneer</option>
                <option value="Desserts">Traditional Dairy Sweets</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">SKU Code</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. PAN-MAS-200G"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Unit / Packaging</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. 500g Glass Jar"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Price per Unit (₹) *</label>
              <input
                type="number"
                step="0.5"
                className="form-control-dairy"
                placeholder="95.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-6">
              <label className="form-label">Initial Stock Count</label>
              <input
                type="number"
                className="form-control-dairy"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="col-6 col-md-6">
              <label className="form-label">Low Stock Alert Threshold</label>
              <input
                type="number"
                className="form-control-dairy"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-control-dairy"
                rows={2}
                placeholder="Details on purity, shelf life, or fat composition..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Adjust Stock: ${selectedProduct?.name}`}
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleStockAdjustSubmit}>
              Apply Stock Update
            </button>
          </>
        }
      >
        <form onSubmit={handleStockAdjustSubmit}>
          <div className="form-group">
            <label className="form-label">Current Available Inventory</label>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {selectedProduct?.stock} Units
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Adjustment Quantity (+ to add stock, - to write off)</label>
            <input
              type="number"
              className="form-control-dairy"
              value={stockAdjustDelta}
              onChange={(e) => setStockAdjustDelta(parseInt(e.target.value) || 0)}
              required
            />
            <div className="text-xs text-slate-500 mt-1">
              Resulting Stock will be: <strong>{Math.max(0, (selectedProduct?.stock || 0) + stockAdjustDelta)} Units</strong>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
