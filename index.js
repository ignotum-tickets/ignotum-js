/*
* This software is licensed under the MIT License.
* See the LICENSE file for more information.
*/


const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');

class Ignotum {
    constructor(baseURL, apiKey) {
        this.api = axios.create({
            baseURL: baseURL,
            headers: { 'x-api-key': apiKey }
        });
    }

    async createTicket(ticket) {
        try {
            const response = await this.api.post('/ticket', ticket);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTicket(ticketId) {
        try {
            const response = await this.api.get(`/ticket/${ticketId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateTicket(ticketId, ticket) {
        try {
            const response = await this.api.put(`/ticket/${ticketId}`, ticket);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteTicket(ticketId) {
        try {
            const response = await this.api.delete(`/ticket/${ticketId}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async createTicketPDF(ticketId, watermark = true) {
        try {
            const ticket = await this.getTicket(ticketId);
            const doc = new PDFDocument({ margin: 50 });

            const filePath = `ticket_${ticket.event_name}_${ticket.holder_name}.pdf`.replace(/\s+/g, '').toLowerCase();
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            const qrCodeData = `ticket_${ticketId}`;
            const qrCodeImage = await QRCode.toDataURL(qrCodeData);

            doc.fontSize(20).text(`Ticket for ${ticket.event_name}`);

            doc.image(qrCodeImage, { fit: [150, 150] });
            doc.moveDown(7);

            doc.fontSize(16).text(`Event Name: ${ticket.event_name}`);
            doc.moveDown(0.5);
            doc.text(`Event Location: ${ticket.event_location}`);
            doc.moveDown(0.5);
            doc.text(`Event Date: ${ticket.event_date}`);
            doc.moveDown(1);

            doc.text(`Holder Name: ${ticket.holder_name}`);
            doc.moveDown(0.5);
            doc.text(`Holder Email: ${ticket.holder_email}`);
            doc.moveDown(1);

            doc.text(`Notes: ${ticket.notes}`);
            doc.moveDown(1);

            doc.text(`Terms and Conditions: ${ticket.terms_and_conditions}`);
            doc.moveDown(3);

            if (watermark) {
                doc.fontSize(12).text('Powered by Ignotum TicketAPI', {
                    baseline: 'bottom',
                    margin: 20
                });
            }




            doc.end();

            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    resolve(filePath);
                });

                writeStream.on('error', (error) => {
                    reject(error);
                });
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${error.response.data.error}`);
            console.error(`Message: ${error.response.data.message}`);
            console.error(`Suggestion: ${error.response.data.suggestion}`);
        } else if (error.request) {
            console.error('Error: No response received from the server.');
        } else {
            console.error(`Error: ${error.message}`);
        }
        throw error;
    }
}

module.exports = Ignotum;
