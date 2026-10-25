package com.tenderai.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tenderai.domain.Proposal;
import com.tenderai.dto.ProposalContentDto;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ExportService {

    private static final Logger log = LoggerFactory.getLogger(ExportService.class);

    private static final Color PRIMARY_COLOR = new Color(30, 41, 59); // Slate 800
    private static final Color ACCENT_COLOR = new Color(79, 70, 229); // Deep Indigo
    private static final Color MUTED_TEXT = new Color(100, 116, 139); // Slate 500

    public byte[] generatePdf(Proposal proposal, ProposalContentDto content) throws DocumentException, IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 45, 45, 54, 54);
        PdfWriter writer = PdfWriter.getInstance(document, out);

        document.open();

        // Title Header
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, PRIMARY_COLOR);
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, MUTED_TEXT);
        Font headingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, ACCENT_COLOR);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(51, 65, 85));

        Paragraph title = new Paragraph("COMMERCIAL & TECHNICAL PROPOSAL", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, ACCENT_COLOR));
        title.setSpacingAfter(4);
        document.add(title);

        Paragraph tenderName = new Paragraph(proposal.getTenderTitle(), titleFont);
        tenderName.setSpacingAfter(8);
        document.add(tenderName);

        Paragraph meta = new Paragraph(String.format("Contracting Authority: %s  |  Jurisdiction: %s  |  Date: %s",
                proposal.getClientName(),
                proposal.getCountry() != null ? proposal.getCountry() : "European Union",
                proposal.getCreatedAt().toLocalDate()), subtitleFont);
        meta.setSpacingAfter(20);
        document.add(meta);

        // Divider
        PdfPTable divider = new PdfPTable(1);
        divider.setWidthPercentage(100);
        PdfPCell dividerCell = new PdfPCell();
        dividerCell.setBorder(Rectangle.BOTTOM);
        dividerCell.setBorderColor(new Color(226, 232, 240));
        dividerCell.setBorderWidth(1.5f);
        dividerCell.setFixedHeight(2);
        divider.addCell(dividerCell);
        divider.setSpacingAfter(18);
        document.add(divider);

        // Sections
        if (content != null) {
            addPdfSection(document, "1. Executive Summary", content.getExecutiveSummary(), headingFont, bodyFont);
            addPdfSection(document, "2. Proposed Methodology & Work Packages", content.getProposedMethodology(), headingFont, bodyFont);
            addPdfSection(document, "3. Team Qualifications & Key Personnel", content.getTeamQualifications(), headingFont, bodyFont);
            addPdfSection(document, "4. Implementation Timeline & Milestones", content.getTimeline(), headingFont, bodyFont);
            addPdfSection(document, "5. Commercial Offer & Pricing Structure", content.getPricingStructure(), headingFont, bodyFont);
            addPdfSection(document, "6. European Standards & Regulatory Compliance", content.getComplianceAndStandards(), headingFont, bodyFont);
        }

        document.close();
        return out.toByteArray();
    }

    private void addPdfSection(Document doc, String titleText, String bodyText, Font headingFont, Font bodyFont) throws DocumentException {
        if (bodyText == null || bodyText.isBlank()) return;

        Paragraph heading = new Paragraph(titleText, headingFont);
        heading.setSpacingBefore(12);
        heading.setSpacingAfter(6);
        doc.add(heading);

        Paragraph body = new Paragraph(bodyText, bodyFont);
        body.setLeading(14);
        body.setSpacingAfter(10);
        doc.add(body);
    }

    public byte[] generateDocx(Proposal proposal, ProposalContentDto content) throws IOException {
        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Header metadata
            XWPFParagraph header = doc.createParagraph();
            header.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun bannerRun = header.createRun();
            bannerRun.setText("TENDER RESPONSE & COMMERCIAL PROPOSAL");
            bannerRun.setBold(true);
            bannerRun.setColor("4F46E5");
            bannerRun.setFontSize(10);

            // Title
            XWPFParagraph titlePara = doc.createParagraph();
            XWPFRun titleRun = titlePara.createRun();
            titleRun.setText(proposal.getTenderTitle());
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titleRun.setColor("1E293B");

            // Subtitle
            XWPFParagraph subPara = doc.createParagraph();
            XWPFRun subRun = subPara.createRun();
            subRun.setText(String.format("Prepared for: %s | Jurisdiction: %s | Status: %s",
                    proposal.getClientName(),
                    proposal.getCountry() != null ? proposal.getCountry() : "European Union",
                    proposal.getStatus()));
            subRun.setItalic(true);
            subRun.setColor("64748B");
            subRun.setFontSize(11);

            if (content != null) {
                addDocxSection(doc, "1. Executive Summary", content.getExecutiveSummary());
                addDocxSection(doc, "2. Proposed Methodology & Work Packages", content.getProposedMethodology());
                addDocxSection(doc, "3. Team Qualifications & Key Personnel", content.getTeamQualifications());
                addDocxSection(doc, "4. Implementation Timeline & Milestones", content.getTimeline());
                addDocxSection(doc, "5. Commercial Offer & Pricing Structure", content.getPricingStructure());
                addDocxSection(doc, "6. European Standards & Regulatory Compliance", content.getComplianceAndStandards());
            }

            doc.write(out);
            return out.toByteArray();
        }
    }

    private void addDocxSection(XWPFDocument doc, String title, String body) {
        if (body == null || body.isBlank()) return;

        XWPFParagraph heading = doc.createParagraph();
        heading.setSpacingBefore(300);
        heading.setSpacingAfter(100);
        XWPFRun headingRun = heading.createRun();
        headingRun.setText(title);
        headingRun.setBold(true);
        headingRun.setColor("4F46E5");
        headingRun.setFontSize(13);

        String[] lines = body.split("\n");
        for (String line : lines) {
            XWPFParagraph para = doc.createParagraph();
            para.setSpacingAfter(80);
            XWPFRun run = para.createRun();
            run.setText(line);
            run.setFontSize(10.5);
            run.setColor("334155");
        }
    }
}
