package com.inventory.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.oned.Code128Writer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class BarcodeService {

    @Value("${app.qr-code.width:300}")
    private int qrCodeWidth;

    @Value("${app.qr-code.height:300}")
    private int qrCodeHeight;

    @Value("${app.barcode.width:300}")
    private int barcodeWidth;

    @Value("${app.barcode.height:100}")
    private int barcodeHeight;

    /**
     * Generate QR code as base64 string
     */
    public String generateQRCode(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, qrCodeWidth, qrCodeHeight);
        
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        return convertImageToBase64(qrImage, "PNG");
    }

    /**
     * Generate barcode as base64 string
     */
    public String generateBarcode(String text) throws Exception {
        Code128Writer barcodeWriter = new Code128Writer();
        BitMatrix bitMatrix = barcodeWriter.encode(text, BarcodeFormat.CODE_128, barcodeWidth, barcodeHeight);
        
        BufferedImage barcodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        return convertImageToBase64(barcodeImage, "PNG");
    }

    /**
     * Decode barcode from base64 image
     */
    public String decodeBarcodeFromBase64(String base64Image) throws Exception {
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        
        return decodeBarcodeFromImage(image);
    }

    /**
     * Decode barcode from BufferedImage
     */
    public String decodeBarcodeFromImage(BufferedImage image) throws Exception {
        BinaryBitmap binaryBitmap = new BinaryBitmap(
            new HybridBinarizer(new BufferedImageLuminanceSource(image))
        );

        Map<DecodeHintType, Object> hints = new HashMap<>();
        hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
        hints.put(DecodeHintType.PURE_BARCODE, Boolean.TRUE);

        Result result = new MultiFormatReader().decode(binaryBitmap, hints);
        return result.getText();
    }

    /**
     * Generate printable QR code label with item information
     */
    public String generatePrintableQRLabel(Long itemId, String itemName, String qrCodeData) throws Exception {
        // Create a larger QR code for printing
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeData, BarcodeFormat.QR_CODE, 400, 400);
        
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        return convertImageToBase64(qrImage, "PNG");
    }

    /**
     * Convert BufferedImage to base64 string
     */
    private String convertImageToBase64(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, format, baos);
        byte[] imageBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Validate if a string is a valid barcode format
     */
    public boolean isValidBarcode(String barcode) {
        if (barcode == null || barcode.trim().isEmpty()) {
            return false;
        }
        
        // Check if it's numeric (for most barcode formats)
        return barcode.matches("^\\d+$");
    }

    /**
     * Generate a unique barcode for an item
     */
    public String generateUniqueBarcode(Long itemId) {
        // Simple implementation - in production, you might want a more sophisticated approach
        return String.format("ITEM%06d", itemId);
    }

    /**
     * Generate QR code data for an item
     */
    public String generateQRCodeData(Long itemId, String itemName) {
        return String.format("INV:%d:%s", itemId, itemName);
    }
} 