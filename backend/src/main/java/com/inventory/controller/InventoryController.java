package com.inventory.controller;

import com.inventory.dto.InventoryItemDTO;
import com.inventory.dto.DashboardStatsDTO;
import com.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> getAllItems() {
        List<InventoryItemDTO> items = inventoryService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> getItemById(@PathVariable Long id) {
        return inventoryService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dashboard/stats")
    public DashboardStatsDTO getDashboardStats() {
        return inventoryService.getDashboardStats();
    }

    @GetMapping("/low-stock")
    public List<InventoryItemDTO> getLowStockItems() {
        return inventoryService.getLowStockItems();
    }
}