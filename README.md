# Inventory Tracking Application

A full-stack inventory management system with barcode/QR code scanning capabilities, real-time stock monitoring, and automated low-stock alerts.

## 🚀 Features

### Backend (Spring Boot)
- RESTful API with CRUD operations for inventory items
- Barcode and QR code generation/decoding using ZXing
- Printable QR code label generation
- Low stock threshold monitoring
- Image-to-barcode decoding
- MySQL/H2 database integration

### Frontend (React)
- Real-time barcode scanning with webcam
- User-friendly inventory management interface
- Low stock alerts and notifications
- QR code label download/printing
- Dashboard with category analytics
- Image upload for barcode decoding

## 🏗️ Project Structure

```
inventory-my/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── public/
├── docker-compose.yml      # Database setup
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, ZXing, MySQL/H2
- **Frontend**: React 18, react-webcam, axios, Bootstrap
- **Database**: MySQL (production) / H2 (development)

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6+
- MySQL (optional, H2 is used by default)

## 🚀 Quick Start

### **Prerequisites**
- **Java 17** or higher
- **Node.js 16** or higher  
- **npm** (comes with Node.js)

### **Method 1: Automatic Setup (Recommended)**

#### **For Windows:**
1. Run the setup script:
   ```cmd
   setup.bat
   ```
2. Then start the application:
   ```cmd
   start.bat
   ```

#### **For Linux/Mac:**
1. Make scripts executable and run setup:
   ```bash
   chmod +x setup.sh start.sh
   ./setup.sh
   ```
2. Then start the application:
   ```bash
   ./start.sh
   ```

### **Method 2: Manual Setup**

#### **Step 1: Setup Frontend**
```bash
cd frontend
npm install
```

#### **Step 2: Setup Backend**
```bash
cd backend
# Use Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run    # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

#### **Step 3: Start Frontend**
```bash
cd frontend
npm start
```

### **Method 3: Using Maven Wrapper (No Maven Installation Required)**

#### **Backend:**
```bash
cd backend
./mvnw spring-boot:run    # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

#### **Frontend:**
```bash
cd frontend
npm install
npm start
```

### 4. Database Setup (Optional)

If using MySQL, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 📚 API Endpoints

### Inventory Items
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/low-stock` - Get low stock items

### Barcode/QR Code
- `POST /api/barcode/generate` - Generate barcode
- `POST /api/qr/generate` - Generate QR code
- `POST /api/barcode/decode` - Decode barcode from image
- `GET /api/items/{id}/qr-label` - Get printable QR label

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
DB_URL=jdbc:h2:mem:inventory_db
DB_USERNAME=sa
DB_PASSWORD=
LOW_STOCK_THRESHOLD=10
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_LOW_STOCK_THRESHOLD=10
```

## 📱 Usage

1. **Add Items**: Use the form to add inventory items with details
2. **Scan Barcodes**: Use the webcam to scan existing barcodes
3. **Generate Labels**: Create QR codes for new items
4. **Monitor Stock**: Dashboard shows low stock warnings
5. **Upload Images**: Decode barcodes from uploaded images

## 🐳 Docker Support

```bash
# Start database
docker-compose up -d

# Build and run backend
cd backend
docker build -t inventory-backend .
docker run -p 8080:8080 inventory-backend

# Build and run frontend
cd frontend
docker build -t inventory-frontend .
docker run -p 3000:3000 inventory-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🔧 Troubleshooting

### **Maven Issues**
- **"mvn is not recognized"**: Use the Maven wrapper instead:
  ```bash
  # Windows
  mvnw.cmd spring-boot:run
  
  # Linux/Mac
  ./mvnw spring-boot:run
  ```

### **React Scripts Issues**
- **"react-scripts is not recognized"**: Install dependencies first:
  ```bash
  cd frontend
  npm install
  ```

### **Java Issues**
- **"JAVA_HOME is not defined"**: Set JAVA_HOME environment variable
- **"Java version not supported"**: Install Java 17 or higher

### **Node.js Issues**
- **"node is not recognized"**: Install Node.js 16 or higher
- **"npm is not recognized"**: npm comes with Node.js

### **Port Issues**
- **Port 8080 in use**: Change backend port in `backend/src/main/resources/application.properties`
- **Port 3000 in use**: React will automatically suggest an alternative port

### **Database Issues**
- **H2 Console**: Access at http://localhost:8080/h2-console
- **Connection failed**: Check if backend is running

## 📄 License

This project is licensed under the MIT License. 