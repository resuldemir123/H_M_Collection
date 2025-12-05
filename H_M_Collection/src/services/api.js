// localStorage tabanlı API servisleri (backend yok)
import { photosStorage, commentsStorage, fileStorage } from './storage';

export const photosApi = {
  getAll: (isPublic) => photosStorage.getAll(isPublic),
  getById: (id) => photosStorage.getById(id),
  create: (photo) => photosStorage.create(photo),
  update: (id, photo) => photosStorage.update(id, photo),
  delete: (id) => photosStorage.delete(id),
};

export const commentsApi = {
  getAll: (isApproved, photoId) => commentsStorage.getAll(isApproved, photoId),
  getById: (id) => commentsStorage.getById(id),
  create: (comment) => commentsStorage.create(comment),
  update: (id, comment) => commentsStorage.update(id, comment),
  delete: (id) => commentsStorage.delete(id),
};

export const uploadApi = {
  uploadPhoto: async (formData) => {
    const file = formData.get('file');
    const caption = formData.get('caption') || '';
    const isPublic = formData.get('isPublic') === 'true' || formData.get('isPublic') === true;
    
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    // Dosya tipi ve boyut kontrolü
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxVideoSize = 50 * 1024 * 1024; // 50MB

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      throw new Error('Sadece JPG, PNG, WEBP, MP4 veya WEBM dosyaları kabul edilir');
    }

    if (isImage && file.size > maxImageSize) {
      throw new Error('Görüntü dosyası boyutu 5MB\'ı geçmemelidir');
    }

    if (isVideo && file.size > maxVideoSize) {
      throw new Error('Video dosyası boyutu 50MB\'ı geçmemelidir');
    }

    const photo = await fileStorage.upload(file, caption, isPublic);
    return { data: photo };
  },
};

export { fileStorage };

