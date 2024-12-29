package com.sethu.billingsystem.utils;

import com.lowagie.text.DocumentException;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.sethu.billingsystem.model.Invoice;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.*;

@Service
public class PdfUtil {

    @Autowired
    TemplateEngine templateEngine;

    public ByteArrayOutputStream generatePdf(String templateName, String fileName, Context context, Invoice invoice) throws DocumentException, IOException {
        String htmlContent = templateEngine.process(templateName, context);


        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Generate PDF
        String pdfFileName = invoice.getInvoiceDate() + "_" + "Invoice-" + invoice.getInvoiceNumber();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlContent, new ClassPathResource("/templates/").getURL().toString());
        renderer.layout();
        renderer.createPDF(outputStream, false);
        renderer.finishPDF();
        return outputStream;
    }
}
