const axios = require('axios');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');

class Ignotum {
    constructor(apiKey, baseUrl = 'http://ignotum.onrender.com') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async createTicket(ticket) {
        try {
            const response = await axios.post(`${this.baseUrl}/ticket`, ticket, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async updateTicket(ticket_id, ticket) {
        try {
            const response = await axios.put(`${this.baseUrl}/ticket/${ticket_id}`, ticket, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error updating ticket: ${error.message}`);
        }
    }

    async getTicket(ticket_id) {
        try {
            const response = await axios.get(`${this.baseUrl}/ticket/${ticket_id}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error retrieving ticket: ${error.message}`);
        }
    }

    async deleteTicket(ticket_id) {
        try {
            const response = await axios.delete(`${this.baseUrl}/ticket/${ticket_id}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error deleting ticket: ${error.message}`);
        }
    }

    async checkTicket(ticket_id) {
        try {
            const response = await axios.get(`${this.baseUrl}/ticket/check/${ticket_id}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error checking ticket: ${error.message}`);
        }
    }

    async createTicketPDF(ticket_id, outputPath) {
        try {
            const ticket = await this.getTicket(ticket_id);
            
            const doc = new PDFDocument();

            doc.pipe(fs.createWriteStream(outputPath));

            doc.fontSize(20).text('Ticket Details', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Owner: ${ticket.customer_first_name} ${ticket.customer_last_name}`);
            doc.text(`Email: ${ticket.customer_email}`);
            doc.text(`Title: ${ticket.title}`);
            doc.text(`Expiration Date: ${ticket.close_date}`);
            doc.text(`Event Date: ${ticket.event_date}`);
            doc.moveDown();

            const qrCodeDataURL = await QRCode.toDataURL(ticket_id);

            doc.image(qrCodeDataURL, {
                fit: [100, 100],
                align: 'center',
                valign: 'center'
            });

            doc.end();
        } catch (error) {
            throw new Error(`Error creating PDF: ${error.message}`);
        }
    }
}

module.exports = Ignotum;
