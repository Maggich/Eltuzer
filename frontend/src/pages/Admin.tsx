import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, categoryApi, Product, Category } from '../services/api';
import './Admin.css';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await productApi.delete(id);
      fetchData();
    } catch (error) {
      alert('Ошибка при удалении товара');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    try {
      await categoryApi.delete(id);
      fetchData();
    } catch (error) {
      alert('Ошибка при удалении категории');
    }
  };

  if (loading) {
    return (
      <div className="admin">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="container">
        <h1 className="admin-title glow-text">Панель управления</h1>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Товары
          </button>
          <button
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Категории
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление товарами</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                + Добавить товар
              </button>
            </div>
            {showProductForm && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onClose={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                onSuccess={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  fetchData();
                }}
              />
            )}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Категория</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.price.toLocaleString()} ₽</td>
                      <td>{product.category.name}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление категориями</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryForm(true);
                }}
              >
                + Добавить категорию
              </button>
            </div>
            {showCategoryForm && (
              <CategoryForm
                category={editingCategory}
                onClose={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(null);
                }}
                onSuccess={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(null);
                  fetchData();
                }}
              />
            )}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{category.description || '-'}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm: React.FC<{
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
  onCreateCategory?: () => void;
}> = ({ product, categories, onClose, onSuccess, onCreateCategory }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [categoryId, setCategoryId] = useState(product?.category_id?.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name,
        description: description || null,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
      };

      let savedProduct;
      if (product) {
        savedProduct = await productApi.update(product.id, productData);
      } else {
        savedProduct = await productApi.create(productData);
      }

      if (imageFile && savedProduct.data) {
        await productApi.uploadImage(savedProduct.data.id, imageFile);
      }

      onSuccess();
    } catch (error) {
      alert('Ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glow-border" onClick={(e) => e.stopPropagation()}>
        <h2>{product ? 'Редактировать товар' : 'Добавить товар'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Цена</label>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Категория</label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Изображение</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Form Component
const CategoryForm: React.FC<{
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name,
        description: description || null,
      };

      if (category) {
        await categoryApi.update(category.id, categoryData);
      } else {
        await categoryApi.create(categoryData);
      }

      onSuccess();
    } catch (error) {
      alert('Ошибка при сохранении категории');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glow-border" onClick={(e) => e.stopPropagation()}>
        <h2>{category ? 'Редактировать категорию' : 'Добавить категорию'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

