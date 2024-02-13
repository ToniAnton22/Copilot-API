import PDFDocument from 'pdfkit'
import fs from "fs"
import path from 'path'

export default function createPdf(user) {
    const doc = new PDFDocument({
        margin: 50, // Set global margins for the document
    });
    console.log(user.gameStarted[0])
    doc.pipe(fs.createWriteStream(`./views/pdfs/sessions-${user.fullname}-${user.gameStarted.at(-1)}.pdf`));

    // Define bottom margin and page height for easier reference
    const bottomMargin = 50; // or whatever margin you prefer
    const pageHeight = doc.page.height;

    // Function to check page overflow and add a new page if necessary
    function checkAndAddNewPage(currentY, contentHeight) {
        if (currentY + contentHeight > pageHeight - bottomMargin) {
            doc.addPage();
        }
    }

    // Document Title
    doc.fontSize(25)
       .font('Helvetica-Bold')
       .text(`Test Summary for ${user.fullname}`, {
           align: 'center',
       })
       .moveDown(2); // Add some space after the title

    let sessions = user.sessions;
    console.log(sessions.length);
    
    sessions.forEach((session, index) => {
        // Estimate the height needed for the session text
        let contentHeight = 20; // This should be dynamically calculated based on your content

        // Check if we need to add a new page before adding new content
        checkAndAddNewPage(doc.y, contentHeight);

        // Session Header
        doc.fontSize(20)
           .font('Helvetica')
           .text(`Session Details`, {
               underline: true,
           })
           .moveDown(0.5);

        // Session Timeframe
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text(`Session started at ${session.timeStarted}.\n Session ended at ${session.timeEnded}.`, {
               align: 'left',
           })
           .moveDown(0.5);

        // Student Name and Grade
        doc.fontSize(14)
           .font('Helvetica')
           .text(`${session.studentName} : ${session.grade}`, {
               align: 'left',
           })
           .moveDown(1);

        session.mistakes.forEach((mistake, mistakeIndex) => {
            // Mistakes Section
            if (!mistake) {
                doc.fontSize(12)
                   .font('Helvetica-Oblique')
                   .text("No mistakes! Congrats!", {
                       align: 'left',
                   });
            } else {
                doc.fontSize(12)
                   .font('Helvetica')
                   .text(`Mistake ${mistakeIndex + 1}:`, {
                       align: 'left',
                       underline: true,
                   })
                   .fontSize(11)
                   .font('Helvetica')
                   .text(`Mistake done at ${mistake.time} on ${mistake.map}`, {
                       indent: 20,
                   })
                   .text(`Received a ${mistake.penalty} penalty for ${mistake.mistakeType}`, {
                       indent: 20,
                   })
                   .moveDown(1);
            }
        });

        // Check if we should add a page break
        if (index < sessions.length - 1) {
            doc.addPage();
        }
    });
    // Finalize the PDF and end the stream
    doc.end();

}