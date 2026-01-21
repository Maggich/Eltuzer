import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import './FurnitureSet.css';

interface SetItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

const FurnitureSet: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: 1,
    price: 0,
    image_url: '',
  });
  const [items, setItems] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'category_id' ? parseFloat(value) : value,
    }));
  };

  const handleAddItem = () => {
    setItems([...items, { productId: 0, quantity: 1, name: '', price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Введите название гарнитура');
      return;
    }

    if (items.length === 0) {
      setError('Добавьте хотя бы один товар в гарнитур');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const totalPrice = calculateTotalPrice();
      const description = formData.description + '\n\nСоставные части:\n' + 
        items.map((item, idx) => `${idx + 1}. ${item.name} (x${item.quantity})`).join('\n');

      const response = await productApi.create({
        name: formData.name,
        description: description,
        price: totalPrice,
        category_id: formData.category_id,
        image_url: formData.image_url || null,
      });

      setSuccess('Гарнитур успешно добавлен!');
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при добавлении гарнитура');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="furniture-set">
      <div className="container">
        <div className="set-header">
          <h1 className="page-title">Создать гарнитур</h1>
          <p className="page-subtitle">Создайте новый мебельный набор из имеющихся товаров</p>
        </div>

        <form onSubmit={handleSubmit} className="set-form">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-section">
            <h2 className="section-title">Основная информация</h2>
            
            <div className="form-group">
              <label htmlFor="name">Название гарнитура *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Например: Спальня Люкс"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите особенности гарнитура, стиль, материалы..."
                className="input-field"
              />
            </div>

            <div className="form-row">
              <div className="form-group form-col">
                <label htmlFor="category_id">Категория</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="1">Спальня</option>
                  <option value="2">Гостиная</option>
                  <option value="3">Кухня</option>
                  <option value="4">Кабинет</option>
                  <option value="5">Прихожая</option>
                </select>
              </div>

              <div className="form-group form-col">
                <label htmlFor="image_url">URL изображения</label>
                <input
                  id="image_url"
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2 className="section-title">Товары в гарнитуре</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn-outline"
              >
                + Добавить товар
              </button>
            </div>

            {items.length === 0 ? (
              <div className="no-items">
                <p>Нет товаров. Нажмите кнопку выше, чтобы добавить товар в гарнитур</p>
              </div>
            ) : (
              <div className="items-list">
                {items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-number">{index + 1}</div>
                    <div className="item-form">
                      <div className="item-field">
                        <label>Название товара</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          placeholder="Шкаф, кровать, тумба..."
                          className="input-field"
                        />
                      </div>

                      <div className="item-field">
                        <label>Цена (₽)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                          min="0"
                          step="100"
                          className="input-field"
                        />
                      </div>

                      <div className="item-field">
                        <label>Количество</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="input-field"
                        />
                      </div>

                      <div className="item-total">
                        <span className="label">Сумма:</span>
                        <span className="value">{(item.price * item.quantity).toLocaleString()} ₽</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn-remove"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="set-total">
                <h3>Итоговая стоимость гарнитура:</h3>
                <p className="total-price">{calculateTotalPrice().toLocaleString()} ₽</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Добавление...' : 'Добавить гарнитур'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FurnitureSet;
