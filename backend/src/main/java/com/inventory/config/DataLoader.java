package com.inventory.config;

import com.inventory.entity.InventoryItem;
import com.inventory.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only load data if the repository is empty
        if (inventoryItemRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        List<InventoryItem> sampleItems = Arrays.asList(
            createSampleItem("Laptop", 15, "Electronics", "ITEM000001", "https://via.placeholder.com/150x150?text=Laptop"),
            createSampleItem("Mouse", 50, "Electronics", "ITEM000002", "https://via.placeholder.com/150x150?text=Mouse"),
            createSampleItem("Keyboard", 25, "Electronics", "ITEM000003", "https://via.placeholder.com/150x150?text=Keyboard"),
            createSampleItem("Monitor", 8, "Electronics", "ITEM000004", "https://via.placeholder.com/150x150?text=Monitor"),
            createSampleItem("Desk Chair", 12, "Furniture", "ITEM000005", "https://via.placeholder.com/150x150?text=Chair"),
            createSampleItem("Office Desk", 5, "Furniture", "ITEM000006", "https://via.placeholder.com/150x150?text=Desk"),
            createSampleItem("Printer Paper", 200, "Office Supplies", "ITEM000007", "https://via.placeholder.com/150x150?text=Paper"),
            createSampleItem("Pens", 150, "Office Supplies", "ITEM000008", "https://via.placeholder.com/150x150?text=Pens"),
            createSampleItem("Notebooks", 75, "Office Supplies", "ITEM000009", "https://via.placeholder.com/150x150?text=Notebooks"),
            createSampleItem("Coffee Mug", 30, "Kitchen", "ITEM000010", "https://via.placeholder.com/150x150?text=Mug"),
            createSampleItem("Water Bottle", 45, "Kitchen", "ITEM000011", "https://via.placeholder.com/150x150?text=Bottle"),
            createSampleItem("USB Cable", 100, "Electronics", "ITEM000012", "https://via.placeholder.com/150x150?text=Cable"),
            createSampleItem("Headphones", 20, "Electronics", "ITEM000013", "https://via.placeholder.com/150x150?text=Headphones"),
            createSampleItem("Webcam", 10, "Electronics", "ITEM000014", "https://via.placeholder.com/150x150?text=Webcam"),
            createSampleItem("Stapler", 25, "Office Supplies", "ITEM000015", "https://via.placeholder.com/150x150?text=Stapler")
        );

        inventoryItemRepository.saveAll(sampleItems);
        System.out.println("✅ Sample data loaded successfully!");
    }

    private InventoryItem createSampleItem(String name, int quantity, String category, String barcode, String imageUrl) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setQuantity(quantity);
        item.setCategory(category);
        item.setBarcode(barcode);
        item.setImage(imageUrl);
        item.setLowStockThreshold(10);
        return item;
    }
} 