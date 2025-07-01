package com.inventory.controller;

import com.inventory.service.BarcodeService;
import com.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/barcode")
@CrossOrigin(origins = "http://localhost:3000")
public class BarcodeController {

    @Autowired
    private BarcodeService barcodeService;

    @Autowired
    private InventoryService inventoryService;

    /**
     * Generate barcode
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateBarcode(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String barcodeImage = barcodeService.generateBarcode(text);
            Map<String, String> response = new HashMap<>();
            response.put("barcode", barcodeImage);
            response.put("text", text);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Generate QR code
     */
    @PostMapping("/qr/generate")
    public ResponseEntity<Map<String, String>> generateQRCode(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String qrCodeImage = barcodeService.generateQRCode(text);
            Map<String, String> response = new HashMap<>();
            response.put("qrCode", qrCodeImage);
            response.put("text", text);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Decode barcode from uploaded image
     */
    @PostMapping(value = "/decode", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> decodeBarcodeFromImage(@RequestParam("image") MultipartFile image) {
        try {
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Convert MultipartFile to base64
            String base64Image = java.util.Base64.getEncoder().encodeToString(image.getBytes());
            String decodedText = barcodeService.decodeBarcodeFromBase64(base64Image);

            Map<String, Object> response = new HashMap<>();
            response.put("decodedText", decodedText);
            response.put("success", true);

            // Try to find inventory item by decoded barcode
            inventoryService.getItemByBarcode(decodedText).ifPresent(item -> {
                response.put("inventoryItem", item);
            });

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to decode barcode: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Decode barcode from base64 image
     */
    @PostMapping("/decode/base64")
    public ResponseEntity<Map<String, Object>> decodeBarcodeFromBase64(@RequestBody Map<String, String> request) {
        try {
            String base64Image = request.get("image");
            if (base64Image == null || base64Image.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String decodedText = barcodeService.decodeBarcodeFromBase64(base64Image);

            Map<String, Object> response = new HashMap<>();
            response.put("decodedText", decodedText);
            response.put("success", true);

            // Try to find inventory item by decoded barcode
            inventoryService.getItemByBarcode(decodedText).ifPresent(item -> {
                response.put("inventoryItem", item);
            });

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to decode barcode: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Get printable QR code label for inventory item
     */
    @GetMapping("/items/{id}/qr-label")
    public ResponseEntity<Map<String, String>> getPrintableQRLabel(@PathVariable Long id) {
        try {
            var item = inventoryService.getItemById(id);
            if (item.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            var inventoryItem = item.get();
            String qrCodeData = barcodeService.generateQRCodeData(inventoryItem.getId(), inventoryItem.getName());
            String qrCodeImage = barcodeService.generatePrintableQRLabel(
                inventoryItem.getId(), 
                inventoryItem.getName(), 
                qrCodeData
            );

            Map<String, String> response = new HashMap<>();
            response.put("qrCode", qrCodeImage);
            response.put("itemName", inventoryItem.getName());
            response.put("itemId", inventoryItem.getId().toString());
            response.put("barcode", inventoryItem.getBarcode());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Validate barcode format
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateBarcode(@RequestBody Map<String, String> request) {
        String barcode = request.get("barcode");
        boolean isValid = barcodeService.isValidBarcode(barcode);

        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("barcode", barcode);

        if (isValid) {
            // Check if barcode already exists
            var existingItem = inventoryService.getItemByBarcode(barcode);
            response.put("exists", existingItem.isPresent());
            if (existingItem.isPresent()) {
                response.put("existingItem", existingItem.get());
            }
        }

        return ResponseEntity.ok(response);
    }
} 