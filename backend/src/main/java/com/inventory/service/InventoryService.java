package com.inventory.service;

import com.inventory.dto.InventoryItemDTO;
import com.inventory.entity.InventoryItem;
import com.inventory.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import com.inventory.dto.DashboardStatsDTO;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private BarcodeService barcodeService;

    @Value("${app.low-stock-threshold:10}")
    private Integer defaultLowStockThreshold;

    public InventoryItemDTO createItem(InventoryItemDTO itemDTO) throws Exception {
        InventoryItem item = new InventoryItem();
        item.setName(itemDTO.getName());
        // The following fields are not present in InventoryItemDTO, so we skip setting them:
        // item.setDescription(itemDTO.getDescription());
        // item.setLocation(itemDTO.getLocation());
        item.setQuantity(itemDTO.getQuantity());
        item.setLowStockThreshold(
            itemDTO.getLowStockThreshold() != null
                ? itemDTO.getLowStockThreshold()
                : defaultLowStockThreshold
        );
        
        // First, save the item to generate its unique ID
        InventoryItem savedItem = inventoryItemRepository.save(item);
        
        // Now that we have an ID, generate the barcode and QR code
        if (savedItem.getBarcode() == null || savedItem.getBarcode().trim().isEmpty()) {
            savedItem.setBarcode(barcodeService.generateUniqueBarcode(savedItem.getId()));
        }
        savedItem.setQrCode(barcodeService.generateQRCodeData(savedItem.getId(), savedItem.getName()));
        
        // Save the item again to persist the new codes
        InventoryItem finalItem = inventoryItemRepository.save(savedItem);

        // Manually convert InventoryItem to InventoryItemDTO since convertToDTO is undefined
        InventoryItemDTO resultDTO = new InventoryItemDTO();
        resultDTO.setId(finalItem.getId());
        resultDTO.setName(finalItem.getName());
        resultDTO.setQuantity(finalItem.getQuantity());
        resultDTO.setLowStockThreshold(finalItem.getLowStockThreshold());
        resultDTO.setBarcode(finalItem.getBarcode());
        resultDTO.setQrCode(finalItem.getQrCode());
        // Add other fields as needed

        return resultDTO;
    }

    public List<InventoryItemDTO> getAllItems() {
        List<InventoryItem> items = inventoryItemRepository.findAll();
        List<InventoryItemDTO> dtos = new java.util.ArrayList<>();
        for (InventoryItem item : items) {
            InventoryItemDTO dto = new InventoryItemDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setQuantity(item.getQuantity());
            dto.setLowStockThreshold(item.getLowStockThreshold());
            dto.setBarcode(item.getBarcode());
            dto.setQrCode(item.getQrCode());
            // Add other fields as needed
            dtos.add(dto);
        }
        return dtos;
    }

    public java.util.Optional<InventoryItemDTO> getItemById(Long id) {
        return inventoryItemRepository.findById(id).map(item -> {
            InventoryItemDTO dto = new InventoryItemDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setQuantity(item.getQuantity());
            dto.setLowStockThreshold(item.getLowStockThreshold());
            dto.setBarcode(item.getBarcode());
            dto.setQrCode(item.getQrCode());
            // Add other fields as needed
            return dto;
        });
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalItems(inventoryItemRepository.getTotalItemCount());
        stats.setTotalQuantity(inventoryItemRepository.getTotalQuantity());
        stats.setLowStockItems(inventoryItemRepository.findLowStockItems().size());
        stats.setCategoryCounts(inventoryItemRepository.getCountByCategory());
        return stats;
    }

    public List<InventoryItemDTO> getLowStockItems() {
        List<InventoryItem> items = inventoryItemRepository.findLowStockItems();
        List<InventoryItemDTO> dtos = new java.util.ArrayList<>();
        for (InventoryItem item : items) {
            InventoryItemDTO dto = new InventoryItemDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setQuantity(item.getQuantity());
            dto.setLowStockThreshold(item.getLowStockThreshold());
            dto.setBarcode(item.getBarcode());
            dto.setQrCode(item.getQrCode());
            // Add other fields as needed
            dtos.add(dto);
        }
        return dtos;
    }
}