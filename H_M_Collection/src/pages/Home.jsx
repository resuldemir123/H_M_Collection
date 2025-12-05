import React, { useState, useEffect } from 'react';
import { photosApi, commentsApi, fileStorage } from '../services/api';
import './Home.css';

function Home() {
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [photosRes, commentsRes] = await Promise.all([
        photosApi.getAll(true), // Sadece public fotoğraflar
        commentsApi.getAll(true) // Sadece onaylı yorumlar
      ]);
      setPhotos(photosRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommentsForPhoto = (photoId) => {
    return comments.filter(c => c.photoId === photoId);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(26,35,126,0.65), rgba(40,53,147,0.65)), url('/img/dukkan.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">Premium Koleksiyon</span>
            <h1 className="hero-title">Zarafet ve Kalitenin <br />Buluşma Noktası</h1>
            <p className="hero-subtitle">Özenle seçilmiş koleksiyonumuzla stil sahibi olmanın <br />farkını yaşayın</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a href="#gallery" className="btn btn-light btn-lg px-4">Koleksiyonu Keşfet</a>
              <a href="#comments" className="btn btn-outline-light btn-lg px-4">Deneyimleri Gör</a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section">
        <div className="container">
          <h2 className="section-title">Fotoğraf Galerisi</h2>
          <div className="row g-4">
            {photos.length > 0 ? (
              photos.map(photo => {
                const photoComments = getCommentsForPhoto(photo.id);
                return (
                  <div key={photo.id} className="col-12 col-md-6 col-lg-4">
                    <div className="photo-card">
                      <img src={fileStorage.getFileUrl(photo)} className="card-img-top" alt={photo.caption} />
                      <div className="card-body">
                        {photo.caption && (
                          <p className="text-muted mb-3">{photo.caption}</p>
                        )}
                        {photoComments.length > 0 && (
                          <>
                            <h6 className="fw-semibold mb-3">Müşteri Yorumları</h6>
                            <div className="comments-container">
                              {photoComments.map(comment => (
                                <div key={comment.id} className="comment-card">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <strong className="text-brand">{comment.customerName}</strong>
                                    <small className="text-muted">
                                      {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                    </small>
                                  </div>
                                  <p className="mb-0">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {photoComments.length === 0 && (
                          <div className="text-center text-muted py-3">
                            <i className="fas fa-comment-slash fa-2x mb-2"></i>
                            <p className="mb-0">Henüz yorum yapılmadı</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <div className="py-5">
                  <i className="fas fa-images fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">Henüz fotoğraf yüklenmedi</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Kalite ve Zarafet <span className="text-gradient">Bir Arada</span></h2>
              <p className="lead mb-4">Her biri özenle seçilmiş ürünlerimizle, size en kaliteli ve şık deneyimi sunmayı taahhüt ediyoruz.</p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-brand me-3 fs-5"></i>
                  <span>Premium kalite malzemeler</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-brand me-3 fs-5"></i>
                  <span>Özenle işçilik</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-brand me-3 fs-5"></i>
                  <span>Zamansız tasarımlar</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="border-radius-lg overflow-hidden shadow-soft">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Premium Kalite" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="display-4 fw-bold text-brand mb-2">500+</h3>
                <p className="text-muted">Mutlu Müşteri</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="display-4 fw-bold text-brand mb-2">1000+</h3>
                <p className="text-muted">Ürün Çeşidi</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="display-4 fw-bold text-brand mb-2">5 Yıl</h3>
                <p className="text-muted">Sektör Deneyimi</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4">
                <h3 className="display-4 fw-bold text-brand mb-2">%98</h3>
                <p className="text-muted">Memnuniyet Oranı</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

