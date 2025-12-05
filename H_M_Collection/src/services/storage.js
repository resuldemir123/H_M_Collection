// localStorage tabanlı veri depolama servisi

const STORAGE_KEYS = {
  PHOTOS: 'hm_collection_photos',
  COMMENTS: 'hm_collection_comments',
};

let photosCache = null;
let commentsCache = null;

// Fotoğraflar için servis
export const photosStorage = {
  getAll: (isPublic) => {
    if (!photosCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      photosCache = stored ? JSON.parse(stored) : [];
    }
    
    let photos = [...photosCache];
    if (isPublic !== undefined) {
      photos = photos.filter(p => p.isPublic === isPublic);
    }
    return Promise.resolve(photos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
  },

  getById: (id) => {
    if (!photosCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      photosCache = stored ? JSON.parse(stored) : [];
    }
    const photo = photosCache.find(p => p.id === id);
    return Promise.resolve(photo || null);
  },

  create: async (photo) => {
    if (!photosCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      photosCache = stored ? JSON.parse(stored) : [];
    }

    const newPhoto = {
      ...photo,
      id: photosCache.length > 0 ? Math.max(...photosCache.map(p => p.id)) + 1 : 1,
      uploadedAt: new Date().toISOString(),
    };

    photosCache.push(newPhoto);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photosCache));
    return Promise.resolve(newPhoto);
  },

  update: async (id, photo) => {
    if (!photosCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      photosCache = stored ? JSON.parse(stored) : [];
    }

    const index = photosCache.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Fotoğraf bulunamadı'));
    }

    photosCache[index] = { ...photosCache[index], ...photo };
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photosCache));
    return Promise.resolve(photosCache[index]);
  },

  delete: async (id) => {
    if (!photosCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      photosCache = stored ? JSON.parse(stored) : [];
    }

    const index = photosCache.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Fotoğraf bulunamadı'));
    }

    photosCache.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photosCache));
    return Promise.resolve();
  },
};

// Yorumlar için servis
export const commentsStorage = {
  getAll: (isApproved, photoId) => {
    if (!commentsCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      commentsCache = stored ? JSON.parse(stored) : [];
    }

    let comments = [...commentsCache];
    
    if (isApproved !== undefined) {
      comments = comments.filter(c => c.isApproved === isApproved);
    }
    
    if (photoId !== undefined) {
      comments = comments.filter(c => c.photoId === photoId);
    }

    return Promise.resolve(comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  getById: (id) => {
    if (!commentsCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      commentsCache = stored ? JSON.parse(stored) : [];
    }
    const comment = commentsCache.find(c => c.id === id);
    return Promise.resolve(comment || null);
  },

  create: async (comment) => {
    if (!commentsCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      commentsCache = stored ? JSON.parse(stored) : [];
    }

    const newComment = {
      ...comment,
      id: commentsCache.length > 0 ? Math.max(...commentsCache.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };

    commentsCache.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(commentsCache));
    return Promise.resolve(newComment);
  },

  update: async (id, comment) => {
    if (!commentsCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      commentsCache = stored ? JSON.parse(stored) : [];
    }

    const index = commentsCache.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Yorum bulunamadı'));
    }

    commentsCache[index] = { ...commentsCache[index], ...comment };
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(commentsCache));
    return Promise.resolve(commentsCache[index]);
  },

  delete: async (id) => {
    if (!commentsCache) {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      commentsCache = stored ? JSON.parse(stored) : [];
    }

    const index = commentsCache.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Yorum bulunamadı'));
    }

    commentsCache.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(commentsCache));
    return Promise.resolve();
  },
};

// Dosya yükleme için base64 dönüştürme
export const fileStorage = {
  upload: async (file, caption = '', isPublic = false) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64 = e.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        const photo = {
          fileName: fileName,
          caption: caption,
          isPublic: isPublic,
          fileData: base64, // Base64 olarak saklanacak
          fileType: file.type,
          fileSize: file.size,
        };

        try {
          const created = await photosStorage.create(photo);
          resolve(created);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  getFileUrl: (photo) => {
    if (photo.fileData) {
      return photo.fileData; // Base64 data URL
    }
    // Eski format için (wwwroot/uploads'dan)
    return `/uploads/${photo.fileName}`;
  },
};

// Cache'i temizle (geliştirme için)
export const clearCache = () => {
  photosCache = null;
  commentsCache = null;
};


