package com.tenderai.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class DocumentParserService {

    private static final Logger log = LoggerFactory.getLogger(DocumentParserService.class);

    public String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            if (document.isEncrypted()) {
                throw new IOException("Cannot parse encrypted PDF without password");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String extracted = stripper.getText(document);
            return cleanExtractedText(extracted);
        }
    }

    public String parseUploadedFile(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("File name cannot be null");
        }

        String lowerName = filename.toLowerCase();
        if (lowerName.endsWith(".pdf")) {
            return extractTextFromPdf(file.getInputStream());
        } else if (lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
            return cleanExtractedText(new String(file.getBytes(), StandardCharsets.UTF_8));
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload a PDF or TXT document.");
        }
    }

    private String cleanExtractedText(String text) {
        if (text == null) {
            return "";
        }
        // Normalize multiple linebreaks and non-printable characters
        return text.replaceAll("\r\n", "\n")
                   .replaceAll("\r", "\n")
                   .replaceAll("[\\t ]+", " ")
                   .replaceAll("\n{3,}", "\n\n")
                   .trim();
    }
}
