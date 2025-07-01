import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { inventoryAPI } from '../services/api';

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);

  // Check camera permission on component mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
    } catch (error) {
      setCameraPermission(false);
      console.error('Camera permission denied:', error);
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScannedItem(null);
    setLastScannedCode('');
    toast.info('Scanner started. Point camera at a barcode.');
  };

  const stopScanning = () => {
    setScanning(false);
    toast.info('Scanner stopped.');
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        processImage(imageSrc);
      }
    }
  }, []);

  const processImage = async (imageSrc) => {
    try {
      setLoading(true);
      
      // Convert base64 to blob for API call
      const base64Data = imageSrc.split(',')[1];
      
      // For demo purposes, we'll simulate barcode detection
      // In a real implementation, you would send the image to the backend
      // const response = await barcodeAPI.decodeBarcodeFromBase64({ image: base64Data });
      
      // Simulate barcode detection (replace with actual API call)
      const mockBarcode = simulateBarcodeDetection();
      
      if (mockBarcode && mockBarcode !== lastScannedCode) {
        setLastScannedCode(mockBarcode);
        await lookupItem(mockBarcode);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process barcode image');
    } finally {
      setLoading(false);
    }
  };

  // Simulate barcode detection (replace with actual implementation)
  const simulateBarcodeDetection = () => {
    // This is a mock implementation
    // In a real app, you would use a barcode detection library
    const mockBarcodes = ['ITEM000001', 'ITEM000002', 'ITEM000003', '123456789'];
    return mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
  };

  const lookupItem = async (barcode) => {
    try {
      const response = await inventoryAPI.getItemByBarcode(barcode);
      setScannedItem(response.data);
      toast.success(`Found item: ${response.data.name}`);
    } catch (error) {
      console.error('Item lookup error:', error);
      toast.warning(`No item found for barcode: ${barcode}`);
      setScannedItem(null);
    }
  };

  const manualBarcodeInput = async (event) => {
    const barcode = event.target.value.trim();
    if (barcode && event.key === 'Enter') {
      await lookupItem(barcode);
      event.target.value = '';
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment" // Use back camera on mobile
  };

  if (cameraPermission === false) {
    return (
      <div>
        <h1 className="mb-4">📷 Barcode Scanner</h1>
        <Alert variant="danger">
          <Alert.Heading>Camera Access Required</Alert.Heading>
          <p>
            This scanner requires camera access to scan barcodes. Please allow camera permissions and refresh the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">📷 Barcode Scanner</h1>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Camera Scanner</h5>
            </Card.Header>
            <Card.Body>
              {scanning ? (
                <div className="text-center">
                  <div className="position-relative">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    {loading && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <Spinner animation="border" variant="light" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Button
                      variant="danger"
                      onClick={stopScanning}
                      className="me-2"
                    >
                      🛑 Stop Scanning
                    </Button>
                    <Button
                      variant="primary"
                      onClick={capture}
                      disabled={loading}
                    >
                      📸 Capture & Scan
                    </Button>
                  </div>
                  
                  <Alert variant="info" className="mt-3">
                    <strong>Instructions:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Point the camera at a barcode</li>
                      <li>Click "Capture & Scan" to process the image</li>
                      <li>Or let the scanner run automatically</li>
                    </ul>
                  </Alert>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-light p-5 rounded">
                    <h4>📷 Camera Ready</h4>
                    <p className="text-muted">
                      Click the button below to start scanning barcodes
                    </p>
                    <Button
                      variant="success"
                      size="lg"
                      onClick={startScanning}
                    >
                      🚀 Start Scanner
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Manual Barcode Input */}
          <Card className="mt-3">
            <Card.Header>
              <h5>Manual Barcode Input</h5>
            </Card.Header>
            <Card.Body>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter barcode manually and press Enter"
                  onKeyPress={manualBarcodeInput}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input.value.trim()) {
                      lookupItem(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Lookup
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Scanned Item Display */}
          {scannedItem && (
            <Card>
              <Card.Header>
                <h5>📦 Scanned Item</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  {scannedItem.image && (
                    <img
                      src={scannedItem.image}
                      alt={scannedItem.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="rounded mb-2"
                    />
                  )}
                  <h6>{scannedItem.name}</h6>
                  <Badge bg="secondary" className="mb-2">
                    {scannedItem.category}
                  </Badge>
                </div>

                <div className="mb-2">
                  <strong>Quantity:</strong>
                  <span className={`ms-2 fw-bold ${scannedItem.lowStock ? 'text-warning' : 'text-success'}`}>
                    {scannedItem.quantity}
                  </span>
                </div>

                <div className="mb-2">
                  <strong>Barcode:</strong>
                  <code className="ms-2">{scannedItem.barcode}</code>
                </div>

                <div className="mb-2">
                  <strong>QR Code:</strong>
                  <code className="ms-2">{scannedItem.qrCode}</code>
                </div>

                <div className="mb-3">
                  <strong>Status:</strong>
                  <div className="mt-1">
                    {scannedItem.quantity === 0 ? (
                      <Badge bg="danger">Out of Stock</Badge>
                    ) : scannedItem.lowStock ? (
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
                      const newQuantity = prompt(`Enter new quantity for ${scannedItem.name}:`, scannedItem.quantity);
                      if (newQuantity !== null && !isNaN(newQuantity)) {
                        inventoryAPI.updateItemQuantity(scannedItem.id, parseInt(newQuantity))
                          .then(() => {
                            toast.success('Quantity updated successfully');
                            lookupItem(scannedItem.barcode); // Refresh item data
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

          {/* Last Scanned Code */}
          {lastScannedCode && (
            <Card className="mt-3">
              <Card.Header>
                <h5>🔍 Last Scanned</h5>
              </Card.Header>
              <Card.Body>
                <code className="d-block text-center">{lastScannedCode}</code>
              </Card.Body>
            </Card>
          )}

          {/* Scanner Status */}
          <Card className="mt-3">
            <Card.Header>
              <h5>📊 Scanner Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <span>Scanner:</span>
                <Badge bg={scanning ? 'success' : 'secondary'}>
                  {scanning ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span>Camera:</span>
                <Badge bg={cameraPermission ? 'success' : 'danger'}>
                  {cameraPermission ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BarcodeScanner; 