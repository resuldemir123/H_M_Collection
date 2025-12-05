import React, { useState, useEffect } from 'react';
import { photosApi, commentsApi, fileStorage } from '../services/api';
import './Admin.css';

function Admin() {
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [photosRes, allCommentsRes] = await Promise.all([
        photosApi.getAll(),
        commentsApi.getAll()
      ]);
      setPhotos(photosRes.data);
      const allComments = allCommentsRes.data;
      setComments(allComments.filter(c => c.isApproved));
      setPendingComments(allComments.filter(c => !c.isApproved));
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (id) => {
    try {
      const comment = pendingComments.find(c => c.id === id);
      if (comment) {
        await commentsApi.update(id, { ...comment, isApproved: true });
        loadData();
      }
    } catch (error) {
      console.error('Yorum onaylanırken hata:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;
    
    try {
      await commentsApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Yorum silinirken hata:', error);
    }
  };

  const handleTogglePhotoPublic = async (photo) => {
    try {
      await photosApi.update(photo.id, { ...photo, isPublic: !photo.isPublic });
      loadData();
    } catch (error) {
      console.error('Fotoğraf güncellenirken hata:', error);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await photosApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Fotoğraf silinirken hata:', error);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="admin">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">Admin Panel</span>
            <h1 className="hero-title">Yönetim Paneli</h1>
            <p className="hero-subtitle">Yorumları ve fotoğrafları yönetin</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Onay Bekleyen Yorumlar ({pendingComments.length})</h2>
          {pendingComments.length > 0 ? (
            <div className="row g-3">
              {pendingComments.map(comment => (
                <div key={comment.id} className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{comment.customerName}</strong>
                          <small className="text-muted ms-2">
                            {new Date(comment.createdAt).toLocaleString('tr-TR')}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApproveComment(comment.id)}
                          >
                            Onayla
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Onay bekleyen yorum yok.</p>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Tüm Fotoğraflar ({photos.length})</h2>
          <div className="row g-4">
            {photos.map(photo => (
              <div key={photo.id} className="col-md-4">
                <div className="card">
                  <img src={fileStorage.getFileUrl(photo)} className="card-img-top" alt={photo.caption} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    {photo.caption && <p className="card-text">{photo.caption}</p>}
                    <div className="d-flex gap-2">
                      <button
                        className={`btn btn-sm ${photo.isPublic ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleTogglePhotoPublic(photo)}
                      >
                        {photo.isPublic ? 'Gizle' : 'Yayınla'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Admin;

