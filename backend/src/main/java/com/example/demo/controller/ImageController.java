package com.example.demo.controller; 

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import javax.imageio.ImageIO;

@RestController 
@RequestMapping("/")
@CrossOrigin(origins = "http:// localhost:5173")
public class ImageController {
    @PostMapping("/pixelate")
    public ResponseEntity<byte[]> pixelateImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Read uploaded image
            BufferedImage original = ImageIO.read(imageFile.getInputStream());

            // Pixelate (downscale +upscale)
            int pixelSize = 10; // adjust for more/less pixelation
            int width = original.getWidth();
            int height = original.getHeight();

            // Step 1: Scale down
            Image tmp = original.getScaledInstance(width / pixelSize, height / pixelSize, Image.SCALE_SMOOTH);
            BufferedImage pixelated = new BufferedImage(width / pixelSize, height / pixelSize, BufferedImage.TYPE_INT_RGB);

            Graphics2D g2d = pixelated.createGraphics();
            g2d.drawImage(tmp, 0, 0, null);
            g2d.dispose();

            // Step 2: Scale back up
            Image finalImg = pixelated.getScaledInstance(width, height, Image.SCALE_FAST);
            BufferedImage output = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D gFinal = output.createGraphics();
            gFinal.drawImage(finalImg, 0, 0, null);
            gFinal.dispose();

            // Step 3: Convert to grayscale (black and white)
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    Color c = new Color(output.getRGB(x, y));

                    // Compute average intensity
                    int gray = (int) (0.299 * c.getRed() + 0.587 * c.getGreen() + 0.114 * c.getBlue());

                    // Make it pure black or white (optional threshold)
                    // gray = gray < 128 ? 0 : 255;  // uncomment for strict black & white
                    Color newColor = new Color(gray, gray, gray);
                    output.setRGB(x, y, newColor.getRGB());
                }
            }

            // Step 4: Convert to bytes and send
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(output, "png", baos);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(baos.toByteArray());


        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
