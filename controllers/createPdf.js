import PDFDocument from 'pdfkit'
import fs from "fs"
import path from 'path'
import checkMistake from '../lib/checkMistakeType.js'
import countMistake from '../lib/countMistakes.js'

export function createPdf(user,sessionsReq) 
{

    return new Promise(function(resolve,reject){
        try{
            const doc = new PDFDocument({
                margin: 50, // Set global margins for the document
            });
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
            
            let sessions
            if(!sessionsReq){
                sessions = user.session
            }else{
                sessions = sessionsReq.sessions
            }
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
                switch(true){
                    case session?.grade <30:
                        doc.fontSize(14)
                        .font('Helvetica')
                        .text(`${session.studentName} you've achieved ${session.grade}/100! Everybody can make mistakes, so lets just go over the summary and see what we can improve on!`, {
                            align: 'left',
                        })
                        .moveDown(1);
                        break;        
                    case 30<= session?.grade <60:
                        doc.fontSize(14)
                            .font('Helvetica')
                            .text(`You are on the right track ${session.studentName}! You've achieved ${session.grade}/100! Lets see the summary to make the next grade even better.`,{
                                align:'left'
                            })
                            .moveDown(1);
                        break;
                    case 60<= session?.grade <= 89:
                        doc.fontSize(14)
                            .font('Helvetica')
                            .text(`Congratultions, you are almost very good at what you are doing ${session?.studentName}. You've got ${session.grade}! There are a few mistakes here and there but keep it up!`,{
                                align:'left'
                            })
                            .moveDown(1);
                        break;
                    case 90<= session?.grade <= 98:
                        doc.fontSize(14)
                            .font('Helvetica')
                            .text(`Congratultions, you are almost impeccable ${session?.studentName}. You've got ${session.grade}! There are a few mistakes here and there but keep it up!`,{
                                align:'left'
                            })
                            .moveDown(1);
                        break;
                    case 98< session?.grade <= 100:
                        doc.fontSize(14)
                            .font('Helvetica')
                            .text(`Congratulations ${session?.studentName}! You've achieved a perfect ${session.grade}, like a real driver!`,{
                                align:'left'
                            })
                            .moveDown(1);
                        break;
                    default:
                        doc.fontSize(14)
                        .font('Helvetica')
                        .text(`Congratulations ${session.studentName} on achieving ${session.grade}!`, {
                            align: 'left',
                        })
                        .moveDown(1);
                        break
                }
                if(session?.mistakes){
                    let feedSession = new Map()
                    let counted = new Map()
                
                    session.mistakes.forEach((mistake, mistakeIndex) => {
                        // Mistakes Section
                        if (!mistake) {
                            doc.fontSize(12)
                               .font('Helvetica-Oblique')
                               .text("No mistakes! Congrats!", {
                                   align: 'left',
                               });
                        } else {
                            feedSession = checkMistake(mistake?.mistakeType,feedSession)
                            counted = countMistake(mistake?.mistakeType, counted)
                        }
                    })
                    console.log(feedSession.size)
                    if(feedSession.size > 0){
                        for (const [key, feedback] of feedSession){

                            doc.fontSize(12)
                                .font('Helvetica')
                                .text(`${feedback} x${counted.get(key)} (Amount of times done)`,{
                                    align:'left',
                                    indent: 20
                                })
                                .moveDown(1)
                        }
                    }
                    
                }
               
        
                // Check if we should add a page break
                if (index < sessions.length - 1) {
                    doc.addPage();
                }
            });
            // Finalize the PDF and end the stream
            doc.end();
            return resolve(doc)
        }catch(e){
            reject(e)
        }
    })
    

}


export function createSessionPdf(session){
    return new Promise(function(resolve,reject){
        try{
            const doc = new PDFDocument({
                margin: 50, // Set global margins for the document
            });
            doc.pipe(fs.createWriteStream(`./views/pdfs/sessions-${session.studentName}-${session.timeStarted}-${session.timeEnded}.pdf`));
        
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
               .text(`Session Summary for ${session.studentName}`, {
                   align: 'center',
               })
               .moveDown(2); // Add some space after the title
        
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
            switch(true){
                case session?.grade <30:
                    doc.fontSize(14)
                    .font('Helvetica')
                    .text(`${session.studentName} you've achieved ${session.grade}/100! Everybody can make mistakes, so lets just go overthe summary and see what we can improve on!`, {
                        align: 'left',
                    })
                    .moveDown(1);
                    break;        
                case 30<= session?.grade <60:
                    doc.fontSize(14)
                        .font('Helvetica')
                        .text(`You are on the right track ${session.studentName}! You've achieved ${session.grade}/100! Lets see the summary to make the next grade even better.`,{
                            align:'left'
                        })
                        .moveDown(1);
                    break;
                case 60<= session?.grade <= 89:
                    doc.fontSize(14)
                        .font('Helvetica')
                        .text(`Congratultions, you are almost very good at what you are doing ${session?.studentName}. You've got ${session.grade}! There are a few mistakes here and there but keep it up!`,{
                            align:'left'
                        })
                        .moveDown(1);
                    break;
                case 90<= session?.grade <= 98:
                    doc.fontSize(14)
                        .font('Helvetica')
                        .text(`Congratultions, you are almost impeccable ${session?.studentName}. You've got ${session.grade}! There are a few mistakes here and there but keep it up!`,{
                            align:'left'
                        })
                        .moveDown(1);
                    break;
                case 98< session?.grade <= 100:
                    doc.fontSize(14)
                        .font('Helvetica')
                        .text(`Congratulations ${session?.studentName}! You've achieved a perfect ${session.grade}, like a real driver!`,{
                            align:'left'
                        })
                        .moveDown(1);
                    break;
                default:
                    doc.fontSize(14)
                    .font('Helvetica')
                    .text(`Congratulations ${session.studentName} on achieving ${session.grade}!`, {
                        align: 'left',
                    })
                    .moveDown(1);
                    break
            }
                
            if(session.mistakes){
                let feedSession = new Map();
                let counted = new Map();
                session.mistakes.forEach((mistake, index) => {

                    // Estimate the height needed for the session text
                    let contentHeight = 20; // This should be dynamically calculated based on your content
    
                    // Check if we need to add a new page before adding new content
                    checkAndAddNewPage(doc.y, contentHeight);
                    if (!mistake) {
                        doc.fontSize(12)
                            .font('Helvetica-Oblique')
                            .text("No mistakes! Congratulations again!", {
                                align: 'left',
                            });
                    } else {
                        feedSession = checkMistake(mistake?.mistakeType,feedSession)
                        counted = countMistake(mistake?.mistakeType, counted)
                    }
                });
                if(feedSession.size > 0){
                    for (const [key, feedback] of feedSession){

                        doc.fontSize(12)
                            .font('Helvetica')
                            .text(`${feedback} x${counted.get(key)} (Amount of times done)`,{
                                align:'left',
                                indent: 20
                            })
                            .moveDown(1)
                    }
                }
            }
            
            // Finalize the PDF and end the stream
            doc.end();
            return resolve(doc)
        }catch(e){
            reject(e)
        }
    })
}