import React, { useEffect, useMemo, useState } from 'react';
import './Carousel.css';

type CarouselSlide = {
  id?: number;
  title?: string | null;
  subtitle?: string | null;
  link_url?: string | null;
  image_url?: string | null;
  order?: number;
  is_active?: boolean;
};

type Props = {
  slides: CarouselSlide[];
  autoPlayMs?: number;
};

const normalizeImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const base = process.env.REACT_APP_API_URL || 'http://localhost:8001';
  return `${base}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
};

const Carousel: React.FC<Props> = ({ slides, autoPlayMs = 7000 }) => {
  const activeSlides = useMemo(() => slides.filter((s) => s.is_active !== false), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, autoPlayMs);
    return () => window.clearInterval(t);
  }, [activeSlides.length, autoPlayMs]);

  useEffect(() => {
    if (index >= activeSlides.length) setIndex(0);
  }, [index, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const current = activeSlides[index];
  const img = normalizeImageUrl(current.image_url);

  return (
    <section className="carousel">
      <div className="carousel-inner">
        <div className="carousel-slide fade-in" key={String(current.id ?? index)}>
          {img ? (
            <img className="carousel-image" src={img} alt={current.title || 'Слайд'} />
          ) : (
            <div className="carousel-image carousel-image-placeholder">Нет изображения</div>
          )}
          {(current.title || current.subtitle) && (
            <div className="carousel-caption">
              {current.title && <h2 className="carousel-title">{current.title}</h2>}
              {current.subtitle && <p className="carousel-subtitle">{current.subtitle}</p>}
              {current.link_url && (
                <a className="btn-primary carousel-cta" href={current.link_url}>
                  Подробнее
                </a>
              )}
            </div>
          )}
        </div>

        {activeSlides.length > 1 && (
          <>
            <button
              className="carousel-arrow left"
              onClick={() => setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
              aria-label="Предыдущий слайд"
              type="button"
            >
              ‹
            </button>
            <button
              className="carousel-arrow right"
              onClick={() => setIndex((prev) => (prev + 1) % activeSlides.length)}
              aria-label="Следующий слайд"
              type="button"
            >
              ›
            </button>
            <div className="carousel-dots" role="tablist" aria-label="Слайды">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`carousel-dot ${i === index ? 'active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Слайд ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Carousel;