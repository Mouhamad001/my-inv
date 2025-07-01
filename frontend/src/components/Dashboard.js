import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { toast } from 'react-toastify';
import { inventoryAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, lowStockResponse] = await Promise.all([
        inventoryAPI.getDashboardStats(),
        inventoryAPI.getLowStockItems()
      ]);

      setStats(statsResponse.data);
      setLowStockItems(lowStockResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryChartData = () => {
    if (!stats?.categoryCounts) return null;

    const labels = stats.categoryCounts.map(item => item[0]);
    const data = stats.categoryCounts.map(item => item[1]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  const getLowStockChartData = () => {
    if (!lowStockItems.length) return null;

    const labels = lowStockItems.map(item => item.name);
    const quantities = lowStockItems.map(item => item.quantity);
    const thresholds = lowStockItems.map(item => item.lowStockThreshold);

    return {
      labels,
      datasets: [
        {
          label: 'Current Quantity',
          data: quantities,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Low Stock Threshold',
          data: thresholds,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  };

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
      <h1 className="mb-4">📊 Dashboard</h1>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Items</Card.Title>
              <h2 className="text-primary">{stats?.totalItems || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Quantity</Card.Title>
              <h2 className="text-success">{stats?.totalQuantity || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Low Stock Items</Card.Title>
              <h2 className="text-warning">{stats?.lowStockItems || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Categories</Card.Title>
              <h2 className="text-info">{stats?.categoryCounts?.length || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>⚠️ Low Stock Alerts</Alert.Heading>
          <p>You have {lowStockItems.length} items that are running low on stock:</p>
          <div className="d-flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <Badge key={item.id} bg="warning" text="dark">
                {item.name} ({item.quantity}/{item.lowStockThreshold})
              </Badge>
            ))}
          </div>
        </Alert>
      )}

      {/* Charts */}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Items by Category</h5>
            </Card.Header>
            <Card.Body>
              {getCategoryChartData() ? (
                <Pie 
                  data={getCategoryChartData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-muted text-center">No category data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Low Stock Items</h5>
            </Card.Header>
            <Card.Body>
              {getLowStockChartData() ? (
                <Bar 
                  data={getLowStockChartData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-muted text-center">No low stock items</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card>
          <Card.Header>
            <h5>Low Stock Items Details</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Current Quantity</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <Badge bg="secondary">{item.category}</Badge>
                      </td>
                      <td>
                        <span className={`fw-bold ${item.quantity === 0 ? 'text-danger' : 'text-warning'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td>{item.lowStockThreshold}</td>
                      <td>
                        {item.quantity === 0 ? (
                          <Badge bg="danger">Out of Stock</Badge>
                        ) : (
                          <Badge bg="warning" text="dark">Low Stock</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Dashboard; 