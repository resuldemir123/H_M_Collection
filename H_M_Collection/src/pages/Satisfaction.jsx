import React, { useState, useEffect } from 'react';
import { photosApi, commentsApi, uploadApi, fileStorage } from '../services/api';
import './Satisfaction.css';

function Satisfaction() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [commentForm, setCommentForm] = useState({
    customerName: '',
    content: '',
    photo: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const res = await photosApi.getAll(false); // Sadece private (kullanıcı) fotoğraflar
      setPhotos(res.data);
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    setUploading(true);
    try {
      await uploadApi.uploadPhoto(formData);
      setMessage('Fotoğraf yüklendi!');
      e.target.reset();
      loadPhotos();
    } catch (error) {
      setMessage('Yükleme başarısız: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoId = null;
      
      if (commentForm.photo) {
        const formData = new FormData();
        formData.append('file', commentForm.photo);
        const uploadRes = await uploadApi.uploadPhoto(formData);
        photoId = uploadRes.data.id;
      }

      await commentsApi.create({
        customerName: commentForm.customerName,
        content: commentForm.content,
        photoId: photoId,
        isApproved: false
      });

      setMessage('Yorumunuz alındı, onay sonrası yayınlanacaktır.');
      setCommentForm({ customerName: '', content: '', photo: null });
    } catch (error) {
      setMessage('Yorum gönderilemedi: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="satisfaction">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">Memnuniyet</span>
            <h1 className="hero-title">Müşteri Memnuniyeti</h1>
            <p className="hero-subtitle">Süreçlerimizi yorumlarınıza göre sürekli iyileştiriyoruz</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-soft">
                <div className="card-body p-4 p-md-5">
                  <h3 className="text-center mb-4">Fotoğraf / Video Paylaşın</h3>
                  {message && (
                    <div className={`alert ${message.includes('başarısız') ? 'alert-danger' : 'alert-success'}`}>
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleFileUpload}>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Dosya Seçin (Fotoğraf veya Video)</label>
                        <input type="file" name="file" className="form-control" accept="image/*,video/*" required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Açıklama</label>
                        <input type="text" name="caption" className="form-control" placeholder="İsteğe bağlı" />
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-primary w-100" type="submit" disabled={uploading}>
                          <i className="fas fa-upload me-1"></i>{uploading ? 'Yükleniyor...' : 'Yükle'}
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

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-soft">
                <div className="card-body p-4 p-md-5">
                  <h3 className="text-center mb-4">Yorum Bırakın</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Adınız *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={commentForm.customerName}
                          onChange={(e) => setCommentForm({ ...commentForm, customerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Yorumunuz *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={commentForm.content}
                          onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                          required
                        ></textarea>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Fotoğraf (isteğe bağlı)</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setCommentForm({ ...commentForm, photo: e.target.files[0] })}
                        />
                        <div className="form-text">Yüklediğiniz fotoğrafın altında yorumunuz yayınlanır. Maksimum 5MB, JPG/PNG/WEBP formatları kabul edilir.</div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-2 justify-content-end">
                      <button className="btn btn-primary" type="submit">
                        <i className="fas fa-paper-plane me-2"></i>Gönder
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title text-center">Paylaşılan Medya</h2>
          {photos.length > 0 ? (
            <div className="row g-4">
              {photos.map(photo => {
                const ext = photo.fileName.split('.').pop()?.toLowerCase();
                const isVideo = ['mp4', 'webm'].includes(ext || '');
                return (
                  <div key={photo.id} className="col-6 col-md-4 col-lg-3">
                    <div className="card border-0 shadow-soft h-100">
                      {isVideo ? (
                        <video controls style={{ width: '100%', height: '250px', objectFit: 'cover' }}>
                          <source src={fileStorage.getFileUrl(photo)} type="video/mp4" />
                          Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                      ) : (
                        <img className="card-img-top" src={fileStorage.getFileUrl(photo)} alt={photo.caption} style={{ height: '250px', objectFit: 'cover' }} />
                      )}
                      {photo.caption && (
                        <div className="card-body">
                          <p className="card-text small mb-0 text-center">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-images fa-3x text-muted mb-3"></i>
              <p className="text-muted">Henüz medya paylaşılmadı</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Satisfaction;

