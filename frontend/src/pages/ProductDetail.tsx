import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, Product } from '../services/api';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
            <p className="product-detail-price">
              {product.price.toLocaleString()} ₽
            </p>
            <button className="btn-primary btn-contact">
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

