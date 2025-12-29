# Credential Validator

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

A robust Node.js API for validating disposable emails and temporary phone numbers. Built with Express.js and enhanced security features using Arcjet, Helmet, and other middleware.

## Features

- **Email Validation**: Checks if an email address uses a disposable/temporary domain
  - Validates email format (RFC-lite)
  - Performs MX record existence check
  - Cross-references against multiple disposable email domain lists
  - Supports subdomain chain checking

- **Phone Validation**: Validates phone numbers against known temporary/disposable number databases
  - E.164 format compliance
  - Checks against curated lists of temporary phone numbers
  - Structural suspicious pattern detection

- **Security Features**:
  - Rate limiting and bot protection via Arcjet
  - Helmet for security headers
  - HPP (HTTP Parameter Pollution) protection
  - CORS support
  - Input sanitization and validation

- **Health Monitoring**: Built-in health check endpoint

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Fairarena/Credential-Validator.git
   cd Credential-Validator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   ARCJET_KEY=your_arcjet_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

The API will be running on `http://localhost:3000` (or the port specified in your `.env`).

## Usage

### Check Email
```http
GET /check?email=user@example.com
```

**Response:**
```json
{
  "tempmail": false
}
```

- `tempmail`: `true` if the email is disposable, `false` otherwise, `null` on error

### Check Phone Number
```http
GET /check-phone?phone=+1234567890
```

**Response:**
```json
{
  "tempphone": false
}
```

- `tempphone`: `true` if the phone number is temporary, `false` otherwise, `"invalid phone number"` for invalid format, `null` on error

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "TempMail Validator API is running"
}
```

## API Details

### Email Validation Process
1. Basic email format validation using regex
2. MX record lookup for domain validity
3. Check against disposable email domain lists from trusted sources
4. Pattern-based detection for known temporary email services

### Phone Validation Process
1. E.164 format validation
2. Normalization to canonical form
3. Check against known temporary phone number databases
4. Structural analysis for suspicious patterns

## Configuration

The application uses the following environment variables:

- `PORT`: Server port (default: 3000)
- `ARCJET_KEY`: Your Arcjet API key for rate limiting and bot protection

## Dependencies

- **@arcjet/node**: Security and rate limiting
- **express**: Web framework
- **helmet**: Security headers
- **hpp**: HTTP Parameter Pollution protection
- **cors**: Cross-Origin Resource Sharing
- **node-fetch**: HTTP requests for data fetching
- **dns**: DNS lookups for MX records

## Data Sources

The validator fetches disposable email domains and temporary phone numbers from:
- [disposable/disposable-email-domains](https://github.com/disposable/disposable-email-domains)
- [martenson/disposable-email-domains](https://github.com/martenson/disposable-email-domains)
- [7c/fakefilter](https://github.com/7c/fakefilter)
- [iP1SMS/disposable-phone-numbers](https://github.com/iP1SMS/disposable-phone-numbers)

Data is refreshed every 6 hours automatically.

## Security Considerations

- All endpoints validate input strictly
- Rate limiting prevents abuse
- Bot detection blocks automated malicious requests
- No sensitive data is logged or stored
- Error responses don't leak internal state

## Development

To run in development mode or add features:

1. Ensure Node.js >= 16.0.0
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run: `npm start`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Propritory License - see the [LICENSE](LICENSE) file for details.

## Author

**Saksham Goel**

## Disclaimer

This tool provides validation based on publicly available data sources. While efforts are made to keep the data current, there may be false positives or negatives. Use at your own discretion and consider additional validation methods for critical applications.</content>
<parameter name="filePath">c:\coding\Credential-Validator\README.md