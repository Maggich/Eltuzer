import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, productApi, slideApi, Product } from '../services/api';
import Carousel from '../components/Carousel';
import './Home.css';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, slidesRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
          slideApi.getAll(true),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 6));
        setCategories(categoriesRes.data);
        setSlides(slidesRes.data);
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
      <div className="container">
        <Carousel slides={slides} />
      </div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <img
              src="/logo-eltuzer.png"
              alt="EL TUZER — студия мебели и салона"
              className="hero-logo-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.insertAdjacentHTML(
                    'afterbegin',
                    '<div class="hero-logo-fallback"><div class="logo-text">EL TUZER</div><div class="logo-subtitle">СТУДИЯ МЕБЕЛИ & САЛОНА</div></div>'
                  );
                }
              }}
            />
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
            <h2 className="section-title glow-text">Категории</h2>
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card glow-border"
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
          <h2 className="section-title glow-text">Популярные товары</h2>
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card glow-border"
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
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
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

