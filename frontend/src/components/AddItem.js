import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { inventoryAPI, barcodeAPI } from '../services/api';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    category: '',
    image: '',
    barcode: '',
    lowStockThreshold: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [generatedBarcode, setGeneratedBarcode] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'lowStockThreshold' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await inventoryAPI.createItem(formData);
      toast.success('Item added successfully!');
      
      // Generate QR code for the new item
      if (response.data.qrCode) {
        try {
          const qrResponse = await barcodeAPI.generateQRCode(response.data.qrCode);
          setGeneratedQR(qrResponse.data.qrCode);
        } catch (error) {
          console.error('Failed to generate QR code:', error);
        }
      }
      
      // Reset form
      setFormData({
        name: '',
        quantity: 0,
        category: '',
        image: '',
        barcode: '',
        lowStockThreshold: 10
      });
      
      setShowPreview(true);
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Add item error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBarcode = async () => {
    if (!formData.barcode) {
      toast.error('Please enter a barcode value first');
      return;
    }

    try {
      const response = await barcodeAPI.generateBarcode(formData.barcode);
      setGeneratedBarcode(response.data.barcode);
      toast.success('Barcode generated successfully!');
    } catch (error) {
      toast.error('Failed to generate barcode');
      console.error('Barcode generation error:', error);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!formData.name) {
      toast.error('Please enter an item name first');
      return;
    }

    try {
      const qrData = `INV:${Date.now()}:${formData.name}`;
      const response = await barcodeAPI.generateQRCode(qrData);
      setGeneratedQR(response.data.qrCode);
      setFormData(prev => ({ ...prev, qrCode: qrData }));
      toast.success('QR code generated successfully!');
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error('QR code generation error:', error);
    }
  };

  const handlePrintQR = () => {
    if (generatedQR) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code Label</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 20px; }
              .qr-image { max-width: 300px; }
              .item-info { margin: 10px 0; font-size: 16px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h3>Inventory Item QR Code</h3>
              <div class="item-info">
                <strong>Name:</strong> ${formData.name}<br>
                <strong>Category:</strong> ${formData.category}<br>
                <strong>Barcode:</strong> ${formData.barcode || 'Auto-generated'}
              </div>
              <img src="data:image/png;base64,${generatedQR}" class="qr-image" alt="QR Code" />
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadQR = () => {
    if (generatedQR) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedQR}`;
      link.download = `qr-code-${formData.name}.png`;
      link.click();
    }
  };

  return (
    <div>
      <h1 className="mb-4">➕ Add New Item</h1>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Item Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter item name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Enter category"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Enter quantity"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Low Stock Threshold</Form.Label>
                      <Form.Control
                        type="number"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Enter threshold"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Barcode</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          name="barcode"
                          value={formData.barcode}
                          onChange={handleInputChange}
                          placeholder="Enter barcode (optional)"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={handleGenerateBarcode}
                          className="ms-2"
                        >
                          Generate
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="Enter image URL (optional)"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Adding...
                      </>
                    ) : (
                      'Add Item'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline-info"
                    onClick={handleGenerateQRCode}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* QR Code Preview */}
          {generatedQR && (
            <Card>
              <Card.Header>
                <h5>QR Code</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <img
                  src={`data:image/png;base64,${generatedQR}`}
                  alt="QR Code"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  className="mb-3"
                />
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={handlePrintQR}>
                    🖨️ Print Label
                  </Button>
                  <Button variant="outline-success" onClick={downloadQR}>
                    📥 Download QR
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Barcode Preview */}
          {generatedBarcode && (
            <Card className="mt-3">
              <Card.Header>
                <h5>Barcode</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <img
                  src={`data:image/png;base64,${generatedBarcode}`}
                  alt="Barcode"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Card.Body>
            </Card>
          )}

          {/* Success Message */}
          {showPreview && (
            <Alert variant="success" className="mt-3">
              <Alert.Heading>✅ Item Added Successfully!</Alert.Heading>
              <p>
                Your item has been added to the inventory. You can now:
              </p>
              <ul>
                <li>Print the QR code label</li>
                <li>Download the QR code image</li>
                <li>View the item in the inventory list</li>
              </ul>
              <Button
                variant="outline-success"
                onClick={() => setShowPreview(false)}
              >
                Add Another Item
              </Button>
            </Alert>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AddItem; 