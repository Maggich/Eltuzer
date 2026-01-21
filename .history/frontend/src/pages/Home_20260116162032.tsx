import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, productApi, Product } from '../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 6));
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">EL TUZER</h1>
            <div className="hero-line"></div>
            <p className="hero-subtitle">СТУДИЯ МЕБЕЛИ & САЛОНА</p>
            <p className="hero-description">
              Создаем мебель для вашего комфорта и стиля
            </p>
            <Link to="/products" className="btn-primary">
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="categories">
          <div className="container">
            <h2 className="section-title">Категории</h2>
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="featured">
        <div className="container">
          <h2 className="section-title">Популярные товары</h2>
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.image_url ? (
                      <img
                        src={product.image_url?.startsWith('http') ? product.image_url : `http://localhost:8001/${product.image_url}`}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="no-image-placeholder">Нет изображения</div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="no-image-placeholder">Нет изображения</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">{product.price.toLocaleString()} ₽</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-products">Товары скоро появятся</p>
          )}
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link to="/products" className="btn-primary">
              Все товары
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
