import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, XCircle, CheckCircle, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge, SearchInput, StatCard, Spinner, EmptyState, Modal, Button, Input, Select, ConfirmDialog } from '../../components/ui';
import { inventoryApi } from '../../api/services';
import { InventoryItem, StockStatus } from '../../types';
import { mockInventory } from '../../api/mockData';
import toast from 'react-hot-toast';

const stockColor = (s: StockStatus) => s === 'InStock' ? 'green' : s === 'LowStock' ? 'yellow' : 'red';
const CATEGORIES = ['Equipment','Supplements','Accessories','Facilities','Apparel','Other'];

const defaultForm = {
  name: '', sku: '', category: 'Equipment', description: '',
  quantity: '', minQuantity: '5', unit: 'units',
  purchasePrice: '', sellingPrice: '', supplier: '', location: '',
};

/* ── Form Modal ────────────────────────────────────────────────────────── */
const ItemFormModal: React.FC<{
  isOpen: boolean; onClose: () => void; item?: InventoryItem | null; onSave: () => void;
}> = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name, sku: item.sku, category: item.category,
        description: item.description, quantity: String(item.quantity),
        minQuantity: String(item.minQuantity), unit: item.unit,
        purchasePrice: String(item.purchasePrice), sellingPrice: String(item.sellingPrice),
        supplier: item.supplier, location: item.location,
      });
    } else { setForm(defaultForm); }
  }, [item, isOpen]);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.sku || !form.quantity) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const qty = parseInt(form.quantity);
      const min = parseInt(form.minQuantity);
      const status: StockStatus = qty === 0 ? 'OutOfStock' : qty <= min ? 'LowStock' : 'InStock';
      if (item) {
        const idx = mockInventory.findIndex(i => i.id === item.id);
        if (idx !== -1) mockInventory[idx] = { ...mockInventory[idx], ...form, quantity: qty, minQuantity: min,
          purchasePrice: parseFloat(form.purchasePrice), sellingPrice: parseFloat(form.sellingPrice||'0'), status };
        toast.success('Item updated');
      } else {
        const newItem: InventoryItem = {
          id: String(Date.now()), ...form,
          quantity: qty, minQuantity: min,
          purchasePrice: parseFloat(form.purchasePrice), sellingPrice: parseFloat(form.sellingPrice||'0'),
          status, createdAt: new Date().toISOString(),
        };
        mockInventory.push(newItem);
        toast.success('Item added');
      }
      onSave(); onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Item' : 'Add Inventory Item'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} loading={loading}>{item ? 'Update' : 'Add Item'}</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Item Name *" value={form.name} onChange={s('name')} placeholder="e.g. Rubber Dumbbell Set" /></div>
        <Input label="SKU *" value={form.sku} onChange={s('sku')} placeholder="EQ-DUMB-001" />
        <div>
          <label className="label">Category</label>
          <select className="input-field" value={form.category} onChange={s('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Quantity *" type="number" value={form.quantity} onChange={s('quantity')} placeholder="0" />
        <Input label="Min Quantity (alert)" type="number" value={form.minQuantity} onChange={s('minQuantity')} placeholder="5" />
        <Input label="Unit" value={form.unit} onChange={s('unit')} placeholder="units / pairs / kg" />
        <Input label="Purchase Price (₹)" type="number" value={form.purchasePrice} onChange={s('purchasePrice')} placeholder="0" />
        <div className="col-span-2"><Input label="Selling Price (₹) — leave 0 if not for sale" type="number" value={form.sellingPrice} onChange={s('sellingPrice')} placeholder="0" /></div>
        <Input label="Supplier" value={form.supplier} onChange={s('supplier')} placeholder="FitGear India" />
        <Input label="Storage Location" value={form.location} onChange={s('location')} placeholder="Weights Area / Store Room" />
        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea className="input-field" rows={2} value={form.description} onChange={s('description')} placeholder="Brief description..." />
        </div>
      </div>
    </Modal>
  );
};

/* ── Detail Modal ──────────────────────────────────────────────────────── */
const ItemDetailModal: React.FC<{ item: InventoryItem | null; onClose: () => void; onEdit: () => void }> = ({ item, onClose, onEdit }) => (
  <Modal isOpen={!!item} onClose={onClose} title="Item Details" size="sm"
    footer={<><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onEdit}><Edit className="w-4 h-4" />Edit</Button></>}>
    {item && (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{item.name}</h3>
            <p className="font-mono text-sm text-[var(--color-brand-400)]">{item.sku}</p>
          </div>
          <Badge color={stockColor(item.status)} dot>{item.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: 'Category', v: item.category },
            { l: 'Location', v: item.location },
            { l: 'Quantity', v: `${item.quantity} ${item.unit}` },
            { l: 'Min Qty', v: `${item.minQuantity} ${item.unit}` },
            { l: 'Purchase Price', v: `₹${item.purchasePrice.toLocaleString('en-IN')}` },
            { l: 'Selling Price', v: item.sellingPrice > 0 ? `₹${item.sellingPrice.toLocaleString('en-IN')}` : 'Not for sale' },
            { l: 'Supplier', v: item.supplier },
            { l: 'Last Restocked', v: item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : '—' },
          ].map(({ l, v }) => (
            <div key={l} className="bg-[var(--color-bg-700)] rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">{l}</p>
              <p className="text-sm font-medium text-white">{v}</p>
            </div>
          ))}
        </div>
        {item.description && (
          <div className="bg-[var(--color-bg-700)] rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-300">{item.description}</p>
          </div>
        )}
        {/* Stock bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Stock level</span><span>{item.quantity} / {item.minQuantity} min</span>
          </div>
          <div className="h-2 bg-[var(--color-bg-600)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.status === 'InStock' ? 'bg-emerald-500' : item.status === 'LowStock' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (item.quantity / Math.max(item.minQuantity * 2, 1)) * 100)}%` }} />
          </div>
        </div>
      </div>
    )}
  </Modal>
);

/* ── Main Page ────────────────────────────────────────────────────────── */
const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    inventoryApi.getAll({ search, category: catFilter || undefined }).then(r => { setItems(r.data as InventoryItem[]); setLoading(false); });
  };
  useEffect(() => { load(); }, [search, catFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const idx = mockInventory.findIndex(i => i.id === deleteId);
    if (idx !== -1) mockInventory.splice(idx, 1);
    toast.success('Item removed');
    setDeleteId(null);
    load();
  };

  const inStock = items.filter(i => i.status === 'InStock').length;
  const lowStock = items.filter(i => i.status === 'LowStock').length;
  const outOfStock = items.filter(i => i.status === 'OutOfStock').length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="page-title">Inventory</h1><p className="page-subtitle">Track gym equipment, supplements and supplies</p></div>
        <button className="btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="w-4 h-4" />Add Item</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={items.length} icon={<Package className="w-5 h-5 text-[var(--color-brand-400)]" />} iconBg="bg-[var(--color-brand-500)]/10" />
        <StatCard title="In Stock" value={inStock} icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Low Stock" value={lowStock} icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />} iconBg="bg-yellow-500/10" />
        <StatCard title="Out of Stock" value={outOfStock} icon={<XCircle className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" />
      </div>

      <div className="flex gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items, SKU..." className="flex-1 max-w-sm" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        {loading ? <Spinner className="py-16" /> : items.length === 0 ? (
          <EmptyState icon={<Package className="w-12 h-12" />} title="No inventory items"
            description="Add equipment, supplements and supplies to track"
            action={<button className="btn-primary" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" />Add Item</button>} />
        ) : (
          <table className="data-table">
            <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Qty</th><th>Purchase</th><th>Selling</th><th>Status</th><th>Supplier</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <p className="font-semibold text-white text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.location}</p>
                  </td>
                  <td><span className="font-mono text-xs text-[var(--color-brand-400)]">{item.sku}</span></td>
                  <td><span className="text-xs bg-[var(--color-bg-700)] text-slate-400 px-2 py-1 rounded-full">{item.category}</span></td>
                  <td>
                    <span className={`font-bold text-sm ${item.quantity === 0 ? 'text-red-400' : item.quantity <= item.minQuantity ? 'text-yellow-400' : 'text-white'}`}>
                      {item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                    </span>
                  </td>
                  <td><span className="text-sm">₹{item.purchasePrice.toLocaleString('en-IN')}</span></td>
                  <td><span className="text-sm text-emerald-400">{item.sellingPrice > 0 ? `₹${item.sellingPrice.toLocaleString('en-IN')}` : '—'}</span></td>
                  <td><Badge color={stockColor(item.status)} dot>{item.status}</Badge></td>
                  <td><span className="text-xs text-slate-500">{item.supplier}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewItem(item)} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-blue-400 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-[var(--color-brand-400)] transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ItemFormModal isOpen={showForm} onClose={() => setShowForm(false)} item={editItem} onSave={load} />
      <ItemDetailModal item={viewItem} onClose={() => setViewItem(null)} onEdit={() => { setEditItem(viewItem); setViewItem(null); setShowForm(true); }} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Item" message="This will permanently remove the inventory item. Are you sure?" />
    </div>
  );
};

export default InventoryPage;
