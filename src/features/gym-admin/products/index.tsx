import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { ShoppingBag, Star, Plus, Edit, Trash2, Eye, TrendingUp, Package } from 'lucide-react';
import { Badge, SearchInput, StatCard, Spinner, EmptyState, Modal, Button, Input, Select, Textarea, ConfirmDialog } from '../../../components/ui';
import { productsApi } from '../../../api/endpoints';
import { Product } from '../../../types';
import { mockProducts } from '../../../api/mockData';
import toast from 'react-hot-toast';

const PROD_CATS = ['Supplements','Pre-Workout','Equipment','Apparel','Accessories','Nutrition','Recovery'];

const defaultForm = {
  name: '', brand: '', category: 'Supplements', description: '',
  price: '', originalPrice: '', stock: '', sku: '',
  isActive: true, isFeatured: false, tags: '',
};

/* ── Form Modal ────────────────────────────────────────────────────────── */
const ProductFormModal: React.FC<{ isOpen: boolean; onClose: () => void; product?: Product | null; onSave: () => void }> = ({ isOpen, onClose, product, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, brand: product.brand, category: product.category,
        description: product.description, price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        stock: String(product.stock), sku: product.sku,
        isActive: product.isActive, isFeatured: product.isFeatured,
        tags: product.tags.join(', '),
      });
    } else { setForm(defaultForm); }
    setErrors({});
  }, [product, isOpen]);

  const clearError = (k: string) => setErrors(prev => {
    const next = { ...prev };
    delete next[k];
    return next;
  });
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: e.target.value }));
  };
  const sv = (k: string) => (value: string) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: value }));
  };
  const sb = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.checked }));

  const handleSave = async () => {
    const nextErrors = {
      name: form.name.trim() ? '' : 'Product name is required.',
      sku: form.sku.trim() ? '' : 'SKU is required.',
      price: form.price.trim() ? '' : 'Price is required.',
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, v]) => v));
    setErrors(activeErrors);
    if (Object.keys(activeErrors).length) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock || '0'),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: [],
        rating: product?.rating ?? 0,
        reviewCount: product?.reviewCount ?? 0,
      };
      if (product) {
        const idx = mockProducts.findIndex(p => p.id === product.id);
        if (idx !== -1) mockProducts[idx] = { ...mockProducts[idx], ...data };
        toast.success('Product updated');
      } else {
        mockProducts.push({ id: String(Date.now()), createdAt: new Date().toISOString(), ...data } as Product);
        toast.success('Product added');
      }
      onSave(); onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} loading={loading}>{product ? 'Update' : 'Add Product'}</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Input label="Product Name *" value={form.name} onChange={s('name')} error={errors.name} placeholder="e.g. Whey Protein Isolate 2kg" /></div>
        <Input label="Brand *" value={form.brand} onChange={s('brand')} placeholder="MuscleBlaze" />
        <Select label="Category" value={form.category} onChange={sv('category')}
          options={PROD_CATS.map(c => ({ value: c, label: c }))} />
        <Input label="SKU *" value={form.sku} onChange={s('sku')} error={errors.sku} placeholder="MB-WPI-2KG" />
        <Input label="Stock Quantity" type="number" value={form.stock} onChange={s('stock')} placeholder="0" />
        <Input label="Price (₹) *" type="number" value={form.price} onChange={s('price')} error={errors.price} placeholder="0.00" />
        <Input label="Original Price (₹) — for discount display" type="number" value={form.originalPrice} onChange={s('originalPrice')} placeholder="0.00" />
        <div className="md:col-span-2">
          <Textarea label="Description" rows={2} value={form.description} onChange={s('description')} placeholder="Product description..." />
        </div>
        <div className="md:col-span-2">
          <Input label="Tags (comma separated)" value={form.tags} onChange={s('tags')} placeholder="protein, isolate, whey" />
        </div>
        <div className="flex items-center gap-4 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.isActive} onChange={sb('isActive')} className="w-4 h-4 rounded accent-[var(--color-brand-500)]" />
            <span className="text-sm text-slate-300">Active (visible to members)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.isFeatured} onChange={sb('isFeatured')} className="w-4 h-4 rounded accent-[var(--color-brand-500)]" />
            <span className="text-sm text-slate-300">Featured product</span>
          </label>
        </div>
      </div>
    </Modal>
  );
};

/* ── Detail Modal ──────────────────────────────────────────────────────── */
const ProductDetailModal: React.FC<{ product: Product | null; onClose: () => void; onEdit: () => void }> = ({ product: p, onClose, onEdit }) => (
  <Modal isOpen={!!p} onClose={onClose} title="Product Details" size="md"
    footer={<><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onEdit}><Edit className="w-4 h-4" />Edit</Button></>}>
    {p && (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-[var(--color-bg-700)] rounded-xl flex items-center justify-center flex-shrink-0 border border-[var(--color-bg-600)]">
            <ShoppingBag className="w-8 h-8 text-[var(--color-bg-400)]" />
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h3 className="font-bold text-white text-lg leading-tight">{p.name}</h3>
              {p.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-1" />}
            </div>
            <p className="text-sm text-slate-400">{p.brand}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
              <span className="text-xs bg-[var(--color-bg-700)] text-slate-400 px-2 py-0.5 rounded-full">{p.category}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'SKU', v: p.sku },
            { l: 'Stock', v: `${p.stock} units` },
            { l: 'Price', v: `₹${p.price.toLocaleString('en-IN')}` },
            { l: 'Original Price', v: p.originalPrice ? `₹${p.originalPrice.toLocaleString('en-IN')}` : '—' },
            { l: 'Rating', v: `${p.rating} ⭐ (${p.reviewCount} reviews)` },
            { l: 'Discount', v: p.originalPrice ? `${Math.round((1 - p.price / p.originalPrice) * 100)}% off` : '—' },
          ].map(({ l, v }) => (
            <div key={l} className="bg-[var(--color-bg-700)] rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">{l}</p>
              <p className="text-sm font-semibold text-white">{v}</p>
            </div>
          ))}
        </div>

        {p.description && (
          <div className="bg-[var(--color-bg-700)] rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-300">{p.description}</p>
          </div>
        )}

        {p.tags.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map(t => <span key={t} className="text-xs bg-[var(--color-bg-700)] text-slate-400 px-2 py-1 rounded-full">{t}</span>)}
            </div>
          </div>
        )}
      </div>
    )}
  </Modal>
);

/* ── Main Page ────────────────────────────────────────────────────────── */
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);

  const load = () => {
    setLoading(true);
    productsApi.getAll({ search: debouncedSearch }).then(r => { setProducts(r.data as Product[]); setLoading(false); });
  };
  useEffect(() => { load(); }, [debouncedSearch, catFilter]);

  const handleDelete = () => {
    const idx = mockProducts.findIndex(p => p.id === deleteId);
    if (idx !== -1) mockProducts.splice(idx, 1);
    toast.success('Product removed');
    setDeleteId(null);
    load();
  };

  const filtered = catFilter ? products.filter(p => p.category === catFilter) : products;
  const featured = products.filter(p => p.isFeatured).length;
  const active = products.filter(p => p.isActive).length;
  const lowStock = products.filter(p => p.stock < 5).length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="page-title">Products</h1><p className="page-subtitle">Gym brand products and merchandise</p></div>
        <button className="btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}><Plus className="w-4 h-4" />Add Product</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={products.length} icon={<ShoppingBag className="w-5 h-5 text-[var(--color-brand-400)]" />} iconBg="bg-[var(--color-brand-500)]/10" />
        <StatCard title="Active" value={active} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Featured" value={featured} icon={<Star className="w-5 h-5 text-yellow-400" />} iconBg="bg-yellow-500/10" />
        <StatCard title="Low Stock" value={lowStock} icon={<Package className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products, brands..." className="flex-1 max-w-sm" />
        <Select
          value={catFilter}
          onChange={setCatFilter}
          className="w-full sm:w-52"
          options={[{ value: '', label: 'All Categories' }, ...PROD_CATS.map(c => ({ value: c, label: c }))]}
        />
      </div>

      {loading ? <Spinner className="py-16" /> : filtered.length === 0 ? (
        <EmptyState icon={<ShoppingBag className="w-12 h-12" />} title="No products found"
          description="Add your first gym product"
          action={<button className="btn-primary" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" />Add Product</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card p-4 flex flex-col gap-3 hover:border-[var(--color-bg-400)] transition-all">
              <div className="w-full h-32 bg-[var(--color-bg-700)] rounded-xl flex items-center justify-center border border-[var(--color-bg-600)]">
                <ShoppingBag className="w-9 h-9 text-[var(--color-bg-400)]" />
              </div>
              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.brand}</p>
                  </div>
                  {p.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />}
                </div>
                <span className="text-xs bg-[var(--color-bg-700)] text-slate-400 px-2 py-0.5 rounded-full mt-1 inline-block">{p.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">₹{p.price.toLocaleString('en-IN')}</p>
                  {p.originalPrice && <p className="text-xs text-slate-500 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</p>}
                </div>
                <Badge color={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Active' : 'Draft'}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{p.rating} ({p.reviewCount})</span>
                <span className={p.stock < 5 ? 'text-red-400 font-semibold' : ''}>{p.stock} in stock</span>
              </div>
              <div className="flex gap-1 pt-1 border-t border-[var(--color-bg-600)]">
                <button onClick={() => setViewProduct(p)} className="flex-1 btn-ghost text-xs py-1.5 justify-center"><Eye className="w-3.5 h-3.5" />View</button>
                <button onClick={() => { setEditProduct(p); setShowForm(true); }} className="flex-1 btn-ghost text-xs py-1.5 justify-center"><Edit className="w-3.5 h-3.5" />Edit</button>
                <button onClick={() => setDeleteId(p.id)} className="flex-1 btn-ghost text-xs py-1.5 justify-center text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" />Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormModal isOpen={showForm} onClose={() => setShowForm(false)} product={editProduct} onSave={load} />
      <ProductDetailModal product={viewProduct} onClose={() => setViewProduct(null)} onEdit={() => { setEditProduct(viewProduct); setViewProduct(null); setShowForm(true); }} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove Product" message="This will permanently remove the product. Are you sure?" />
    </div>
  );
};

export default ProductsPage;
