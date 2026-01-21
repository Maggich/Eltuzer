import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// ⚙️ НАСТРОЙКА: Укажите ваш номер WhatsApp (только цифры, без + и пробелов)
// Пример: '79991234567' для номера +7 (999) 123-45-67
const WHATSAPP_NUMBER = '77025078724'; // ЗАМЕНИТЕ НА ВАШ НОМЕР!

const Landing: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [submitted, setSubmitted] = useState(false);

  // Таймер акции (можно настроить)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    const name = formData.name.trim();
    const phone = formData.phone.trim().replace(/\D/g, ''); // Только цифры
    
    if (!name) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    
    if (!phone || phone.length < 10) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      // Формируем сообщение для WhatsApp
      const message = `Здравствуйте! Меня зовут ${name}. Мой телефон: ${formData.phone}. Хочу узнать больше о вашей мебели.`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      // Открываем WhatsApp
      const whatsappWindow = window.open(whatsappUrl, '_blank');
      
      if (!whatsappWindow) {
        // Если всплывающее окно заблокировано, пробуем открыть в текущем окне
        window.location.href = whatsappUrl;
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="landing-page">

      <div className="landing-container">
        {/* Заголовок с акцией */}
        <div className="landing-header">
          <div className="landing-badge">🔥 СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</div>
          <h1 className="landing-title">
            Создайте мебель<br />
            <span className="landing-title-accent">вашей мечты</span>
          </h1>
          <p className="landing-subtitle">
            Индивидуальный дизайн • Премиум качество • Быстрые сроки
          </p>
        </div>

        {/* Таймер акции */}
        <div className="landing-timer">
          <p className="timer-label">До конца акции осталось:</p>
          <div className="timer-display">
            <div className="timer-item">
              <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="timer-label-small">часов</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-item">
              <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="timer-label-small">минут</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-item">
              <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="timer-label-small">секунд</span>
            </div>
          </div>
        </div>

        {/* Форма */}
        {!submitted ? (
          <div className="landing-form-container">
            <div className="landing-form-header">
              <h2>Оставьте заявку прямо сейчас</h2>
              <p>И получите консультацию от нашего дизайнера бесплатно!</p>
            </div>
            
            <form className="landing-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ваше имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Номер телефона</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              <button type="submit" className="landing-submit-btn">
                <span>Отправить в WhatsApp</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                </svg>
              </button>
            </form>

            <div className="landing-trust">
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Бесплатная консультация</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Ответ в течение 5 минут</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Без навязывания услуг</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="landing-success">
            <div className="success-icon">✓</div>
            <h2>Спасибо за заявку!</h2>
            <p>Мы свяжемся с вами в WhatsApp в ближайшее время</p>
            <Link to="/" className="landing-go-to-site-btn">
              Перейти на основной сайт
            </Link>
          </div>
        )}

        {/* Социальные доказательства */}
        <div className="landing-social-proof">
          <div className="proof-item">
            <div className="proof-number">500+</div>
            <div className="proof-label">Довольных клиентов</div>
          </div>
          <div className="proof-item">
            <div className="proof-number">10+</div>
            <div className="proof-label">Лет опыта</div>
          </div>
          <div className="proof-item">
            <div className="proof-number">100%</div>
            <div className="proof-label">Гарантия качества</div>
          </div>
        </div>

        {/* Кнопка перехода на сайт (всегда видна) */}
        <div className="landing-footer-cta">
          <Link to="/" className="landing-link-to-site">
            Посмотреть каталог товаров →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
