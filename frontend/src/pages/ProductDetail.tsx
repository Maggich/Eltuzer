import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, Product } from '../services/api';
import './ProductDetail.css';

// ⚙️ НАСТРОЙКА: Укажите ваш номер WhatsApp (только цифры, без + и пробелов)
const WHATSAPP_NUMBER = '77025078724'; // Номер компании EL TUZER

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productApi.getById(parseInt(id));
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPhone = (value: string) => {
    // Убираем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Форматируем как +7 (XXX) XXX-XX-XX
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name.trim();
    const phone = formData.phone.trim().replace(/\D/g, '');
    const message = formData.message.trim();
    
    if (!name) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    
    if (!phone || phone.length < 10) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      const productName = product ? product.name : 'товар';
      const whatsappMessage = `Здравствуйте! Меня интересует ${productName}.

Мои данные:
Имя: ${name}
Телефон: ${formData.phone}
${message ? `Сообщение: ${message}` : ''}

Прошу связаться со мной для обсуждения деталей.`;
      
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
      
      const whatsappWindow = window.open(whatsappUrl, '_blank');
      
      if (!whatsappWindow) {
        window.location.href = whatsappUrl;
      }
      
      setShowContactForm(false);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <p className="error">Товар не найден</p>
          <Link to="/products" className="btn-primary">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="back-link">
          ← Назад к каталогу
        </Link>
        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.image_url ? (
              <img
                src={product.image_url?.startsWith('http') ? product.image_url : `http://localhost:8001/${product.image_url}`}
                alt={product.name}
              />
            ) : (
              <div className="no-image">Нет изображения</div>
            )}
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-title glow-text">{product.name}</h1>
            <div className="product-detail-line"></div>
            <p className="product-detail-category">
              Категория: {product.category.name}
            </p>
            {product.description && (
              <p className="product-detail-description">{product.description}</p>
            )}
            <button 
              className="btn-primary btn-contact"
              onClick={() => setShowContactForm(true)}
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
      
      {/* Модальное окно с формой связи */}
      {showContactForm && (
        <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Связаться с нами</h2>
              <button 
                className="modal-close"
                onClick={() => setShowContactForm(false)}
              >
                ×
              </button>
            </div>
            <p className="modal-subtitle">
              Заполните форму, и мы свяжемся с вами в WhatsApp
            </p>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Ваше имя *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone">Номер телефона *</label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  className="input-field"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (702) 219-99-66"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Сообщение (необязательно)</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input-field"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Опишите ваши пожелания или вопросы..."
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowContactForm(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  Отправить в WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

