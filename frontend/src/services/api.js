import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory Items API
export const inventoryAPI = {
  // Get all items
  getAllItems: () => api.get('/items'),
  
  // Get item by ID
  getItemById: (id) => api.get(`/items/${id}`),
  
  // Get item by barcode
  getItemByBarcode: (barcode) => api.get(`/items/barcode/${barcode}`),
  
  // Get item by QR code
  getItemByQRCode: (qrCode) => api.get(`/items/qr/${qrCode}`),
  
  // Create new item
  createItem: (itemData) => api.post('/items', itemData),
  
  // Update item
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  
  // Delete item
  deleteItem: (id) => api.delete(`/items/${id}`),
  
  // Get low stock items
  getLowStockItems: () => api.get('/items/low-stock'),
  
  // Get low stock items by threshold
  getLowStockItemsByThreshold: (threshold) => api.get(`/items/low-stock/${threshold}`),
  
  // Search items by name
  searchItemsByName: (name) => api.get(`/items/search?name=${encodeURIComponent(name)}`),
  
  // Get items by category
  getItemsByCategory: (category) => api.get(`/items/category/${encodeURIComponent(category)}`),
  
  // Get dashboard statistics
  getDashboardStats: () => api.get('/items/dashboard/stats'),
  
  // Update item quantity
  updateItemQuantity: (id, quantity) => api.patch(`/items/${id}/quantity?quantity=${quantity}`),
};

// Barcode/QR Code API
export const barcodeAPI = {
  // Generate barcode
  generateBarcode: (text) => api.post('/barcode/generate', { text }),
  
  // Generate QR code
  generateQRCode: (text) => api.post('/barcode/qr/generate', { text }),
  
  // Decode barcode from image file
  decodeBarcodeFromImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/barcode/decode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Decode barcode from base64 image
  decodeBarcodeFromBase64: (base64Image) => api.post('/barcode/decode/base64', { image: base64Image }),
  
  // Get printable QR code label
  getPrintableQRLabel: (id) => api.get(`/barcode/items/${id}/qr-label`),
  
  // Validate barcode
  validateBarcode: (barcode) => api.post('/barcode/validate', { barcode }),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received');
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 