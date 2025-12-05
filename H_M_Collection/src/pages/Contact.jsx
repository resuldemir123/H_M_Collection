import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderimi burada yapılacak
    alert('Mesajınız gönderildi!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">İletişim</span>
            <h1 className="hero-title">Bize Ulaşın</h1>
            <p className="hero-subtitle">Sorularınız için buradayız</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">İletişim <span className="text-gradient">Bilgilerimiz</span></h2>
              <p className="lead mb-5">Size en iyi hizmeti verebilmek için buradayız. Soru ve görüşleriniz için bize ulaşabilirsiniz.</p>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle me-4">
                    <i className="fas fa-envelope fa-lg"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">E-posta</h5>
                    <p className="text-muted mb-1">info@hmcollection.com</p>
                    <small className="text-muted">En geç 24 saat içinde dönüş yapıyoruz</small>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle me-4">
                    <i className="fas fa-phone fa-lg"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Telefon</h5>
                    <p className="text-muted mb-1">+90 (555) 123 45 67</p>
                    <small className="text-muted">Çalışma saatleri: 09:00 - 18:00</small>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle me-4">
                    <i className="fas fa-map-marker-alt fa-lg"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2">Adres</h5>
                    <p className="text-muted mb-1">H M Collection Showroom</p>
                    <small className="text-muted">İstanbul, Türkiye</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="border-radius-lg overflow-hidden shadow-soft">
                <div className="card border-0">
                  <div className="card-body p-0">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.67419862065!2d28.979129276478476!3d41.04021577132446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab1d021c7c625%3A0x3caed1ffac56b5ab!2s%C4%B0stanbul%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1699999999999!5m2!1str!2str"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Harita"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">Konum temsili olarak gösterilmiştir</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="section-title">Mesaj Gönderin</h2>
                <p className="text-muted">Size nasıl yardımcı olabileceğimizi bildirin</p>
              </div>

              <div className="card border-0 shadow-soft">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Adınız *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Adınızı giriniz"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">E-posta *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Konu</label>
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Mesaj konusu"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Mesajınız *</label>
                        <textarea
                          className="form-control"
                          rows="5"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Mesajınızı buraya yazınız..."
                          required
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                          <i className="fas fa-paper-plane me-2"></i>Mesajı Gönder
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

