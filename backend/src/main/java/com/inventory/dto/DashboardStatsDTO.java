package com.inventory.dto;

import java.util.List;

public class DashboardStatsDTO {
    private long totalItems;
    private long totalQuantity;
    private long lowStockItems;
    private List<Object[]> categoryCounts;

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public long getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(long totalQuantity) { this.totalQuantity = totalQuantity; }

    public long getLowStockItems() { return lowStockItems; }
    public void setLowStockItems(long lowStockItems) { this.lowStockItems = lowStockItems; }

    public List<Object[]> getCategoryCounts() { return categoryCounts; }
    public void setCategoryCounts(List<Object[]> categoryCounts) { this.categoryCounts = categoryCounts; }
} 