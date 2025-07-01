import React, { useState, useRef } from 'react';
import { Card, Button, Alert, Spinner, Row, Col, Badge, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { barcodeAPI, inventoryAPI } from '../services/api';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [decodedResult, setDecodedResult] = useState(null);
  const [foundItem, setFoundItem] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Reset previous results
      setDecodedResult(null);
      setFoundItem(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: { files } });
    }
  };

  const decodeBarcode = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file first');
      return;
    }

    try {
      setLoading(true);
      const response = await barcodeAPI.decodeBarcodeFromImage(selectedFile);
      
      if (response.data.success) {
        setDecodedResult(response.data);
        
        // If an inventory item was found, set it
        if (response.data.inventoryItem) {
          setFoundItem(response.data.inventoryItem);
          toast.success(`Found item: ${response.data.inventoryItem.name}`);
        } else {
          setFoundItem(null);
          toast.info(`Decoded barcode: ${response.data.decodedText}`);
        }
      } else {
        toast.warning('No barcode found in the image');
        setDecodedResult(null);
        setFoundItem(null);
      }
    } catch (error) {
      console.error('Decode error:', error);
      toast.error('Failed to decode barcode from image');
      setDecodedResult(null);
      setFoundItem(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDecodedResult(null);
    setFoundItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadDecodedImage = () => {
    if (previewUrl) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `barcode-image-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div>
      <h1 className="mb-4">📤 Upload Barcode Image</h1>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Image Upload</h5>
            </Card.Header>
            <Card.Body>
              <div
                className="border-2 border-dashed border-secondary rounded p-4 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed #6c757d',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                      className="mb-3"
                    />
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={decodeBarcode}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Decoding...
                          </>
                        ) : (
                          '🔍 Decode Barcode'
                        )}
                      </Button>
                      <Button variant="outline-secondary" onClick={clearResults}>
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    </div>
                    <h5>Drag & Drop or Click to Upload</h5>
                    <p className="text-muted">
                      Upload an image containing a barcode to decode it
                    </p>
                    <Form.Control
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => fileInputRef.current.click()}
                    >
                      📁 Choose File
                    </Button>
                  </div>
                )}
              </div>

              <Alert variant="info" className="mt-3">
                <strong>Supported formats:</strong> JPG, PNG, GIF, BMP<br />
                <strong>Max file size:</strong> 10MB<br />
                <strong>Instructions:</strong> Upload a clear image of a barcode for best results
              </Alert>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {/* Decoded Results */}
          {decodedResult && (
            <Card>
              <Card.Header>
                <h5>🔍 Decoded Results</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Decoded Text:</strong>
                  <code className="d-block mt-1 p-2 bg-light rounded">
                    {decodedResult.decodedText}
                  </code>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <Button
                    variant="outline-success"
                    onClick={downloadDecodedImage}
                  >
                    📥 Download Image
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => {
                      navigator.clipboard.writeText(decodedResult.decodedText);
                      toast.success('Barcode copied to clipboard');
                    }}
                  >
                    📋 Copy Barcode
                  </Button>
                </div>

                {decodedResult.error && (
                  <Alert variant="warning">
                    <strong>Warning:</strong> {decodedResult.error}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Found Inventory Item */}
          {foundItem && (
            <Card className="mt-3">
              <Card.Header>
                <h5>📦 Found Item</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  {foundItem.image && (
                    <img
                      src={foundItem.image}
                      alt={foundItem.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      className="rounded mb-2"
                    />
                  )}
                  <h6>{foundItem.name}</h6>
                  <Badge bg="secondary" className="mb-2">
                    {foundItem.category}
                  </Badge>
                </div>

                <div className="mb-2">
                  <strong>Quantity:</strong>
                  <span className={`ms-2 fw-bold ${foundItem.lowStock ? 'text-warning' : 'text-success'}`}>
                    {foundItem.quantity}
                  </span>
                </div>

                <div className="mb-2">
                  <strong>Barcode:</strong>
                  <code className="ms-2">{foundItem.barcode}</code>
                </div>

                <div className="mb-3">
                  <strong>Status:</strong>
                  <div className="mt-1">
                    {foundItem.quantity === 0 ? (
                      <Badge bg="danger">Out of Stock</Badge>
                    ) : foundItem.lowStock ? (
                      <Badge bg="warning" text="dark">Low Stock</Badge>
                    ) : (
                      <Badge bg="success">In Stock</Badge>
                    )}
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const newQuantity = prompt(`Enter new quantity for ${foundItem.name}:`, foundItem.quantity);
                      if (newQuantity !== null && !isNaN(newQuantity)) {
                        inventoryAPI.updateItemQuantity(foundItem.id, parseInt(newQuantity))
                          .then(() => {
                            toast.success('Quantity updated successfully');
                            // Refresh the found item data
                            inventoryAPI.getItemById(foundItem.id)
                              .then(response => setFoundItem(response.data))
                              .catch(() => toast.error('Failed to refresh item data'));
                          })
                          .catch(() => toast.error('Failed to update quantity'));
                      }
                    }}
                  >
                    ✏️ Update Quantity
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Upload Instructions */}
          <Card className="mt-3">
            <Card.Header>
              <h5>📋 Instructions</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li>Upload a clear image of a barcode</li>
                <li>Click "Decode Barcode" to process the image</li>
                <li>View the decoded text and any found inventory items</li>
                <li>Update item quantities or copy barcode information</li>
              </ol>
              
              <Alert variant="warning" className="mt-3">
                <strong>Tips for better results:</strong>
                <ul className="mb-0 mt-2">
                  <li>Ensure good lighting in the image</li>
                  <li>Keep the barcode straight and centered</li>
                  <li>Avoid blurry or low-resolution images</li>
                  <li>Make sure the barcode is clearly visible</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageUpload; 