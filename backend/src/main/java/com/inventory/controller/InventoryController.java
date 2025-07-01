package com.inventory.controller;

import com.inventory.dto.InventoryItemDTO;
import com.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * Get all inventory items
     */
    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> getAllItems() {
        List<InventoryItemDTO> items = inventoryService.getAllItems();
        return ResponseEntity.ok(items);
    }

    /**
     * Get inventory item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> getItemById(@PathVariable Long id) {
        Optional<InventoryItemDTO> item = inventoryService.getItemById(id);
        return item.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get inventory item by barcode
     */
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<InventoryItemDTO> getItemByBarcode(@PathVariable String barcode) {
        Optional<InventoryItemDTO> item = inventoryService.getItemByBarcode(barcode);
        return item.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get inventory item by QR code
     */
    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<InventoryItemDTO> getItemByQRCode(@PathVariable String qrCode) {
        Optional<InventoryItemDTO> item = inventoryService.getItemByQRCode(qrCode);
        return item.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new inventory item
     */
    @PostMapping
    public ResponseEntity<InventoryItemDTO> createItem(@Valid @RequestBody InventoryItemDTO itemDTO) {
        try {
            InventoryItemDTO createdItem = inventoryService.createItem(itemDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update inventory item
     */
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> updateItem(@PathVariable Long id, 
                                                      @Valid @RequestBody InventoryItemDTO itemDTO) {
        try {
            Optional<InventoryItemDTO> updatedItem = inventoryService.updateItem(id, itemDTO);
            return updatedItem.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete inventory item
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        boolean deleted = inventoryService.deleteItem(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /**
     * Get low stock items
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemDTO>> getLowStockItems() {
        List<InventoryItemDTO> lowStockItems = inventoryService.getLowStockItems();
        return ResponseEntity.ok(lowStockItems);
    }

    /**
     * Get low stock items by threshold
     */
    @GetMapping("/low-stock/{threshold}")
    public ResponseEntity<List<InventoryItemDTO>> getLowStockItemsByThreshold(@PathVariable Integer threshold) {
        List<InventoryItemDTO> lowStockItems = inventoryService.getLowStockItemsByThreshold(threshold);
        return ResponseEntity.ok(lowStockItems);
    }

    /**
     * Search items by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<InventoryItemDTO>> searchItemsByName(@RequestParam String name) {
        List<InventoryItemDTO> items = inventoryService.searchItemsByName(name);
        return ResponseEntity.ok(items);
    }

    /**
     * Get items by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItemDTO>> getItemsByCategory(@PathVariable String category) {
        List<InventoryItemDTO> items = inventoryService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<InventoryService.DashboardStats> getDashboardStats() {
        InventoryService.DashboardStats stats = inventoryService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Update item quantity
     */
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryItemDTO> updateItemQuantity(@PathVariable Long id, 
                                                              @RequestParam Integer quantity) {
        Optional<InventoryItemDTO> updatedItem = inventoryService.updateItemQuantity(id, quantity);
        return updatedItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 