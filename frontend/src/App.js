import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import AddItem from './components/AddItem';
import BarcodeScanner from './components/BarcodeScanner';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">📦 Inventory Tracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
                <Nav.Link as={Link} to="/add">Add Item</Nav.Link>
                <Nav.Link as={Link} to="/scan">Scan Barcode</Nav.Link>
                <Nav.Link as={Link} to="/upload">Upload Image</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/scan" element={<BarcodeScanner />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Routes>
        </Container>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;