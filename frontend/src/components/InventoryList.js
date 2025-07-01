import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Badge, 
  Modal, 
  Alert, 
  Spinner,
  Card,
  Row,
  Col,
  Dropdown
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { inventoryAPI } from '../services/api';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAllItems();
      setItems(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to load inventory items');
      console.error('Load items error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadItems();
      return;
    }

    try {
      setLoading(true);
      const response = await inventoryAPI.searchItemsByName(searchTerm);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to search items');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    
    if (!category) {
      loadItems();
      return;
    }

    try {
      setLoading(true);
      const response = await inventoryAPI.getItemsByCategory(category);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to filter by category');
      console.error('Category filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.deleteItem(id);
        toast.success('Item deleted successfully');
        loadItems();
      } catch (error) {
        toast.error('Failed to delete item');
        console.error('Delete error:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await inventoryAPI.updateItem(editingItem.id, editingItem);
      toast.success('Item updated successfully');
      setShowEditModal(false);
      setEditingItem(null);
      loadItems();
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Update error:', error);
    }
  };

  const handleQuantityUpdate = async (id, newQuantity) => {
    try {
      await inventoryAPI.updateItemQuantity(id, newQuantity);
      toast.success('Quantity updated successfully');
      loadItems();
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Quantity update error:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode?.includes(searchTerm) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">📦 Inventory Items</h1>

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by name, barcode, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline-secondary" onClick={handleSearch}>
                  🔍 Search
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={loadItems}>
                🔄 Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Items Table */}
      <Card>
        <Card.Header>
          <h5>Inventory Items ({filteredItems.length})</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Barcode</th>
                  <th>QR Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.image && (
                        <div>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge bg="secondary">{item.category}</Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className={`fw-bold ${item.lowStock ? 'text-warning' : 'text-success'}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="ms-2"
                          onClick={() => {
                            const newQuantity = prompt(`Enter new quantity for ${item.name}:`, item.quantity);
                            if (newQuantity !== null && !isNaN(newQuantity)) {
                              handleQuantityUpdate(item.id, parseInt(newQuantity));
                            }
                          }}
                        >
                          ✏️
                        </Button>
                      </div>
                    </td>
                    <td>
                      <code>{item.barcode}</code>
                    </td>
                    <td>
                      <code>{item.qrCode}</code>
                    </td>
                    <td>
                      {item.quantity === 0 ? (
                        <Badge bg="danger">Out of Stock</Badge>
                      ) : item.lowStock ? (
                        <Badge bg="warning" text="dark">Low Stock</Badge>
                      ) : (
                        <Badge bg="success">In Stock</Badge>
                      )}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEdit(item)}>
                            ✏️ Edit
                          </Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => handleDelete(item.id)}
                            className="text-danger"
                          >
                            🗑️ Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <Alert variant="info" className="text-center">
              No items found. Try adjusting your search criteria or add some items.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Low Stock Threshold</Form.Label>
                <Form.Control
                  type="number"
                  value={editingItem.lowStockThreshold}
                  onChange={(e) => setEditingItem({...editingItem, lowStockThreshold: parseInt(e.target.value)})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryList; 