package com.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class InventoryItemDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;

    @NotBlank(message = "Category is required")
    private String category;

    private String image;
    private String barcode;
    private String qrCode;

    @Min(value = 0, message = "Low stock threshold must be non-negative")
    private Integer lowStockThreshold = 10;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean lowStock;

    // Constructors
    public InventoryItemDTO() {}

    public InventoryItemDTO(String name, Integer quantity, String category) {
        this.name = name;
        this.quantity = quantity;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isLowStock() {
        return lowStock;
    }

    public void setLowStock(boolean lowStock) {
        this.lowStock = lowStock;
    }

    @Override
    public String toString() {
        return "InventoryItemDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", category='" + category + '\'' +
                ", barcode='" + barcode + '\'' +
                ", qrCode='" + qrCode + '\'' +
                ", lowStockThreshold=" + lowStockThreshold +
                ", lowStock=" + lowStock +
                '}';
    }
} 