package com.inventory.service;

import com.inventory.dto.InventoryItemDTO;
import com.inventory.entity.InventoryItem;
import com.inventory.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private BarcodeService barcodeService;

    @Value("${app.low-stock-threshold:10}")
    private Integer defaultLowStockThreshold;

    /**
     * Get all inventory items
     */
    public List<InventoryItemDTO> getAllItems() {
        return inventoryItemRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get inventory item by ID
     */
    public Optional<InventoryItemDTO> getItemById(Long id) {
        return inventoryItemRepository.findById(id)
                .map(this::convertToDTO);
    }

    /**
     * Get inventory item by barcode
     */
    public Optional<InventoryItemDTO> getItemByBarcode(String barcode) {
        return inventoryItemRepository.findByBarcode(barcode)
                .map(this::convertToDTO);
    }

    /**
     * Get inventory item by QR code
     */
    public Optional<InventoryItemDTO> getItemByQRCode(String qrCode) {
        return inventoryItemRepository.findByQrCode(qrCode)
                .map(this::convertToDTO);
    }

    /**
     * Create new inventory item
     */
    public InventoryItemDTO createItem(InventoryItemDTO itemDTO) throws Exception {
        InventoryItem item = convertToEntity(itemDTO);
        
        // Generate barcode if not provided
        if (item.getBarcode() == null || item.getBarcode().trim().isEmpty()) {
            item.setBarcode(barcodeService.generateUniqueBarcode(item.getId() != null ? item.getId() : 1L));
        }
        
        // Generate QR code data
        String qrCodeData = barcodeService.generateQRCodeData(item.getId() != null ? item.getId() : 1L, item.getName());
        item.setQrCode(qrCodeData);
        
        // Set default low stock threshold if not provided
        if (item.getLowStockThreshold() == null) {
            item.setLowStockThreshold(defaultLowStockThreshold);
        }
        
        InventoryItem savedItem = inventoryItemRepository.save(item);
        
        // Update barcode and QR code with actual ID
        if (savedItem.getBarcode().startsWith("ITEM")) {
            savedItem.setBarcode(barcodeService.generateUniqueBarcode(savedItem.getId()));
            savedItem.setQrCode(barcodeService.generateQRCodeData(savedItem.getId(), savedItem.getName()));
            savedItem = inventoryItemRepository.save(savedItem);
        }
        
        return convertToDTO(savedItem);
    }

    /**
     * Update inventory item
     */
    public Optional<InventoryItemDTO> updateItem(Long id, InventoryItemDTO itemDTO) throws Exception {
        Optional<InventoryItem> existingItem = inventoryItemRepository.findById(id);
        
        if (existingItem.isPresent()) {
            InventoryItem item = existingItem.get();
            
            // Update fields
            item.setName(itemDTO.getName());
            item.setQuantity(itemDTO.getQuantity());
            item.setCategory(itemDTO.getCategory());
            item.setImage(itemDTO.getImage());
            item.setLowStockThreshold(itemDTO.getLowStockThreshold());
            
            // Update QR code if name changed
            if (!item.getName().equals(itemDTO.getName())) {
                item.setQrCode(barcodeService.generateQRCodeData(item.getId(), item.getName()));
            }
            
            InventoryItem updatedItem = inventoryItemRepository.save(item);
            return Optional.of(convertToDTO(updatedItem));
        }
        
        return Optional.empty();
    }

    /**
     * Delete inventory item
     */
    public boolean deleteItem(Long id) {
        if (inventoryItemRepository.existsById(id)) {
            inventoryItemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Get low stock items
     */
    public List<InventoryItemDTO> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get low stock items by threshold
     */
    public List<InventoryItemDTO> getLowStockItemsByThreshold(Integer threshold) {
        return inventoryItemRepository.findLowStockItemsByThreshold(threshold)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search items by name
     */
    public List<InventoryItemDTO> searchItemsByName(String name) {
        return inventoryItemRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get items by category
     */
    public List<InventoryItemDTO> getItemsByCategory(String category) {
        return inventoryItemRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get dashboard statistics
     */
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalItems(inventoryItemRepository.getTotalItemCount());
        stats.setTotalQuantity(inventoryItemRepository.getTotalQuantity());
        stats.setLowStockItems(inventoryItemRepository.findLowStockItems().size());
        stats.setCategoryCounts(inventoryItemRepository.getCountByCategory());
        return stats;
    }

    /**
     * Update item quantity
     */
    public Optional<InventoryItemDTO> updateItemQuantity(Long id, Integer newQuantity) {
        Optional<InventoryItem> item = inventoryItemRepository.findById(id);
        
        if (item.isPresent()) {
            InventoryItem inventoryItem = item.get();
            inventoryItem.setQuantity(newQuantity);
            InventoryItem updatedItem = inventoryItemRepository.save(inventoryItem);
            return Optional.of(convertToDTO(updatedItem));
        }
        
        return Optional.empty();
    }

    // Helper methods
    private InventoryItemDTO convertToDTO(InventoryItem item) {
        InventoryItemDTO dto = new InventoryItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setQuantity(item.getQuantity());
        dto.setCategory(item.getCategory());
        dto.setImage(item.getImage());
        dto.setBarcode(item.getBarcode());
        dto.setQrCode(item.getQrCode());
        dto.setLowStockThreshold(item.getLowStockThreshold());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        dto.setLowStock(item.isLowStock());
        return dto;
    }

    private InventoryItem convertToEntity(InventoryItemDTO dto) {
        InventoryItem item = new InventoryItem();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setQuantity(dto.getQuantity());
        item.setCategory(dto.getCategory());
        item.setImage(dto.getImage());
        item.setBarcode(dto.getBarcode());
        item.setQrCode(dto.getQrCode());
        item.setLowStockThreshold(dto.getLowStockThreshold());
        return item;
    }

    // Dashboard statistics class
    public static class DashboardStats {
        private Long totalItems;
        private Long totalQuantity;
        private int lowStockItems;
        private List<Object[]> categoryCounts;

        // Getters and setters
        public Long getTotalItems() { return totalItems; }
        public void setTotalItems(Long totalItems) { this.totalItems = totalItems; }
        
        public Long getTotalQuantity() { return totalQuantity; }
        public void setTotalQuantity(Long totalQuantity) { this.totalQuantity = totalQuantity; }
        
        public int getLowStockItems() { return lowStockItems; }
        public void setLowStockItems(int lowStockItems) { this.lowStockItems = lowStockItems; }
        
        public List<Object[]> getCategoryCounts() { return categoryCounts; }
        public void setCategoryCounts(List<Object[]> categoryCounts) { this.categoryCounts = categoryCounts; }
    }
} 