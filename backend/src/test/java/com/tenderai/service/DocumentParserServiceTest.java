package com.tenderai.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class DocumentParserServiceTest {

    private final DocumentParserService parserService = new DocumentParserService();

    @Test
    void testExtractTextFromPdf() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(doc, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("Tender Reference TED-2026-EU: Sovereign Cloud Framework");
                contentStream.endText();
            }
            doc.save(baos);
        }

        String extracted = parserService.extractTextFromPdf(new ByteArrayInputStream(baos.toByteArray()));
        assertNotNull(extracted);
        assertTrue(extracted.contains("Tender Reference TED-2026-EU"));
    }

    @Test
    void testParseUploadedFile_Txt() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "tender.txt",
                "text/plain",
                "European Commission DG DIGIT Framework Agreement 2026".getBytes()
        );

        String result = parserService.parseUploadedFile(file);
        assertEquals("European Commission DG DIGIT Framework Agreement 2026", result);
    }
}
