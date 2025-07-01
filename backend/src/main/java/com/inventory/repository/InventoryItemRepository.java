package com.inventory.repository;

import com.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    // Find items by category
    List<InventoryItem> findByCategory(String category);

    // Find items with low stock
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.lowStockThreshold")
    List<InventoryItem> findLowStockItems();

    // Find items with low stock by threshold
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= :threshold")
    List<InventoryItem> findLowStockItemsByThreshold(@Param("threshold") Integer threshold);

    // Find item by barcode
    Optional<InventoryItem> findByBarcode(String barcode);

    // Find item by QR code
    Optional<InventoryItem> findByQrCode(String qrCode);

    // Find items by name containing (case-insensitive)
    List<InventoryItem> findByNameContainingIgnoreCase(String name);

    // Get count by category
    @Query("SELECT i.category, COUNT(i) FROM InventoryItem i GROUP BY i.category")
    List<Object[]> getCountByCategory();

    // Get total item count
    @Query("SELECT COUNT(i) FROM InventoryItem i")
    Long getTotalItemCount();

    // Get total quantity
    @Query("SELECT SUM(i.quantity) FROM InventoryItem i")
    Long getTotalQuantity();

    // Check if barcode exists
    boolean existsByBarcode(String barcode);

    // Check if QR code exists
    boolean existsByQrCode(String qrCode);
} 