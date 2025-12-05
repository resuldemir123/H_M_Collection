import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">Hikayemiz</span>
            <h1 className="hero-title">Kaliteye Olan <br />Tutkumuz</h1>
            <p className="hero-subtitle">2018'den beri zarafet ve kaliteyi <br />bir araya getiriyoruz</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Hikayemiz ve <span className="text-gradient">Değerlerimiz</span></h2>
              <p className="lead mb-4">
                HM Collection olarak, 2018 yılından bu yana müşterilerimize en kaliteli ve şık ürünleri
                sunmak için çalışıyoruz. Her bir ürün, uzman ekibimiz tarafından özenle seçilmekte ve
                siz değerli müşterilerimize ulaştırılmaktadır.
              </p>
              <p className="mb-4">
                Misyonumuz, sadece ürün satmak değil, aynı zamanda unutulmaz bir alışveriş deneyimi
                yaşatmaktır. Kalite, güven ve müşteri memnuniyeti bizim için her zaman öncelikli
                değerler olmuştur.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <div className="text-center">
                  <div className="fs-2 fw-bold text-brand">6+</div>
                  <div className="text-muted">Yıllık Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="fs-2 fw-bold text-brand">500+</div>
                  <div className="text-muted">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="fs-2 fw-bold text-brand">%99</div>
                  <div className="text-muted">Memnuniyet</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="border-radius-lg overflow-hidden shadow-soft">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="HM Collection Showroom" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Değerlerimiz</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle mx-auto mb-3">
                  <i className="fas fa-gem fa-2x"></i>
                </div>
                <h5 className="fw-semibold mb-3">Kalite</h5>
                <p className="text-muted mb-0">
                  Her ürünümüz en yüksek kalite standartlarında, özenle seçilmiş ve test edilmiştir.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle mx-auto mb-3">
                  <i className="fas fa-handshake fa-2x"></i>
                </div>
                <h5 className="fw-semibold mb-3">Güven</h5>
                <p className="text-muted mb-0">
                  Müşterilerimizin güveni bizim için her şeyden önemlidir. Şeffaf ve güvenilir ilişkiler kuruyoruz.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="icon-wrapper bg-brand-extra-light text-brand rounded-circle mx-auto mb-3">
                  <i className="fas fa-heart fa-2x"></i>
                </div>
                <h5 className="fw-semibold mb-3">Memnuniyet</h5>
                <p className="text-muted mb-0">
                  Müşteri memnuniyeti odaklı çalışıyor, her detayı düşünerek hizmet veriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

