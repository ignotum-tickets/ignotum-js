# Ignotum-JS
The official Ignotum JavaScript Library.

## Early access
This is not a stable version, so breaking changes may be made.

## Installation
```bash
npm install @ignotum-tickets/ignotum
```

## Overview

The `Ignotum` class provides an interface for managing event tickets with Ignotum TicketAPI. This includes creating, retrieving, updating, deleting tickets, and generating ticket PDFs with QR codes.

## Usage

### Initialization

Create an instance of the `Ignotum` class with the base URL of the API and your API key:

```javascript
const Ignotum = require('@ignotum-tickets/ignotum');

const baseURL = 'https://ignotum.onrender.com/beta/1/';
const apiKey = 'your-api-key';

const ignotum = new Ignotum(baseURL, apiKey);

```

Note: The base URL must always start with https://ignotum.onrender.com/beta, then you can choose which beta to use.

### Methods

#### `createTicket(ticket)`

Creates a new ticket.

- **Parameters**:
  - `ticket` (Object): The ticket details.
- **Returns**: The created ticket data.

```javascript
const newTicket = {
    event_name: 'Event Name',
    event_location: 'Event Location',
    event_date: 'Event Date',
    holder_name: 'Holder Name',
    holder_email: 'Holder Email',
    notes: 'Some notes',
    terms_and_conditions: 'Terms and conditions text'
};

ignotum.createTicket(newTicket)
    .then(ticket => console.log(ticket))
    .catch(error => console.error(error));
```

#### `getTicket(ticketId)`

Retrieves a ticket by its ID.

- **Parameters**:
  - `ticketId` (String): The ID of the ticket.
- **Returns**: The ticket data.

```javascript
const ticketId = '12345';

ignotum.getTicket(ticketId)
    .then(ticket => console.log(ticket))
    .catch(error => console.error(error));
```

#### `updateTicket(ticketId, ticket)`

Updates an existing ticket.

- **Parameters**:
  - `ticketId` (String): The ID of the ticket.
  - `ticket` (Object): The updated ticket details.
- **Returns**: The updated ticket data.

```javascript
const updatedTicket = {
    event_name: 'Updated Event Name',
    // other fields to update
};

ignotum.updateTicket(ticketId, updatedTicket)
    .then(ticket => console.log(ticket))
    .catch(error => console.error(error));
```

#### `deleteTicket(ticketId)`

Deletes a ticket by its ID.

- **Parameters**:
  - `ticketId` (String): The ID of the ticket.
- **Returns**: The response data.

```javascript
ignotum.deleteTicket(ticketId)
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

#### `createTicketPDF(ticketId, watermark = true)`

Generates a PDF for a ticket with a QR code.

- **Parameters**:
  - `ticketId` (String): The ID of the ticket.
  - `watermark` (Boolean): Whether to include a watermark. Default is `true`.
- **Returns**: A promise that resolves to the file path of the generated PDF.

```javascript
const ticketId = '12345';

ignotum.createTicketPDF(ticketId)
    .then(filePath => console.log(`PDF created at: ${filePath}`))
    .catch(error => console.error(error));
```

### Error Handling

Errors are handled using the `handleError` method. It logs detailed error information to the console.

```javascript
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
```

## License

This software is licensed under the MIT License. See the LICENSE file for more information.
