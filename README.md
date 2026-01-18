<p align="center">
  <img src="https://fairarena.blob.core.windows.net/fairarena/fairArenaLogo.png" alt="FairArena Logo" width="140" height="140">
</p>

<h1 align="center">Credential Validator</h1>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen" alt="Node.js Version"></a>
  <a href="https://hub.docker.com/r/sakshamgoel1107/credential-validator"><img src="https://img.shields.io/docker/pulls/sakshamgoel1107/credential-validator" alt="Docker Pulls"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Proprietary-blue" alt="License"></a>
  <a href="https://github.com/FairArena/Credential-Validator"><img src="https://img.shields.io/github/stars/FairArena/Credential-Validator?style=social" alt="GitHub Stars"></a>
</p>

<p align="center">
  A production-ready Node.js API for validating disposable emails and temporary phone numbers. Built with Express.js and enterprise-grade security features using Arcjet, Helmet, and comprehensive middleware protection.
</p>

---

## 🚀 Features

### 📧 Email Validation
- **Format Validation**: RFC-compliant email format verification
- **MX Record Verification**: Real-time DNS lookup to ensure valid mail servers
- **Disposable Domain Detection**: Cross-references against multiple curated blocklists
- **Subdomain Analysis**: Intelligent subdomain chain checking for evasion attempts
- **Continuous Updates**: Automatically refreshes disposable domain lists every 6 hours

### 📱 Phone Number Validation
- **E.164 Format Compliance**: International standard phone number format validation
- **Temporary Number Detection**: Checks against comprehensive temporary phone databases
- **Pattern Recognition**: Advanced structural analysis for suspicious number patterns
- **Normalization**: Automatic conversion to canonical format for accurate validation

### 🔒 Security Features
- **Rate Limiting**: Arcjet-powered intelligent rate limiting to prevent abuse
- **Bot Protection**: Advanced bot detection and prevention mechanisms
- **Security Headers**: Helmet.js implementation for production-grade HTTP headers
- **HPP Protection**: HTTP Parameter Pollution attack prevention
- **CORS Support**: Configurable cross-origin resource sharing
- **Input Sanitization**: Comprehensive validation and sanitization of all inputs
- **Error Handling**: Secure error responses that don't leak internal state

### 🏥 Monitoring & Reliability
- **Health Check Endpoint**: Built-in health monitoring for uptime tracking
- **Graceful Error Handling**: Comprehensive error management without service disruption
- **Logging**: Structured logging for debugging and monitoring

---

## 📦 Installation

### Option 1: Docker (Recommended)

Pull and run the pre-built Docker image:

```bash
# Pull the image
docker pull sakshamgoel1107/credential-validator

# Run the container
docker run -d \
  -p 3000:3000 \
  -e ARCJET_KEY=your_arcjet_key_here \
  --name credential-validator \
  sakshamgoel1107/credential-validator
```

With custom port:
```bash
docker run -d \
  -p 8080:3000 \
  -e PORT=3000 \
  -e ARCJET_KEY=your_arcjet_key_here \
  --name credential-validator \
  sakshamgoel1107/credential-validator
```

### Option 2: Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  credential-validator:
    image: sakshamgoel1107/credential-validator
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - ARCJET_KEY=your_arcjet_key_here
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FairArena/Credential-Validator.git
   cd Credential-Validator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   ARCJET_KEY=your_arcjet_key_here
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000` (or your configured port).

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | No |
| `ARCJET_KEY` | Arcjet API key for security features | - | Yes |

### Getting an Arcjet API Key

1. Visit [Arcjet](https://arcjet.com)
2. Sign up for a free account
3. Create a new project
4. Copy your API key to the `.env` file

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Validate Email Address

Check if an email address is disposable or temporary.

**Endpoint:** `GET /check`

**Query Parameters:**
- `email` (required): Email address to validate

**Example Request:**
```bash
curl "http://localhost:3000/check?email=user@example.com"
```

**Success Response:**
```json
{
  "tempmail": false
}
```

**Response Values:**
- `false`: Email is valid (not disposable)
- `true`: Email is disposable/temporary
- `null`: Error occurred during validation

**Example - Disposable Email:**
```bash
curl "http://localhost:3000/check?email=test@tempmail.com"
```
```json
{
  "tempmail": true
}
```

---

#### 2. Validate Phone Number

Check if a phone number is temporary or disposable.

**Endpoint:** `GET /check-phone`

**Query Parameters:**
- `phone` (required): Phone number in E.164 format (e.g., +1234567890)

**Example Request:**
```bash
curl "http://localhost:3000/check-phone?phone=+1234567890"
```

**Success Response:**
```json
{
  "tempphone": false
}
```

**Response Values:**
- `false`: Phone number is valid (not temporary)
- `true`: Phone number is temporary/disposable
- `"invalid phone number"`: Invalid format
- `null`: Error occurred during validation

---

#### 3. Health Check

Monitor API availability and status.

**Endpoint:** `GET /health`

**Example Request:**
```bash
curl "http://localhost:3000/health"
```

**Success Response:**
```json
{
  "status": "OK",
  "message": "TempMail Validator API is running"
}
```

---

## 🔍 How It Works

### Email Validation Process

1. **Format Validation**: Validates email syntax using RFC-compliant regex patterns
2. **Domain Extraction**: Extracts and normalizes the domain portion
3. **MX Record Lookup**: Performs DNS queries to verify mail server existence
4. **Blocklist Matching**: Cross-references against multiple disposable email databases
5. **Subdomain Analysis**: Checks subdomain chains to detect evasion techniques
6. **Result Aggregation**: Combines all checks to determine final status

### Phone Number Validation Process

1. **Format Validation**: Ensures E.164 international format compliance
2. **Normalization**: Converts to canonical format for consistent matching
3. **Database Lookup**: Checks against known temporary phone number providers
4. **Pattern Analysis**: Applies heuristics to detect suspicious number patterns
5. **Result Determination**: Returns validation status based on all checks

---

## 📊 Data Sources

The validator uses continuously updated data from trusted open-source repositories:

| Source | Type | Update Frequency |
|--------|------|------------------|
| [disposable/disposable-email-domains](https://github.com/disposable/disposable-email-domains) | Disposable Emails | Every 6 hours |
| [martenson/disposable-email-domains](https://github.com/martenson/disposable-email-domains) | Disposable Emails | Every 6 hours |
| [7c/fakefilter](https://github.com/7c/fakefilter) | Disposable Emails | Every 6 hours |
| [iP1SMS/disposable-phone-numbers](https://github.com/iP1SMS/disposable-phone-numbers) | Temporary Phones | Every 6 hours |

Data is automatically fetched and refreshed to ensure up-to-date validation.

---

## 🛡️ Security Considerations

- ✅ **Input Validation**: Strict validation on all endpoints
- ✅ **Rate Limiting**: Prevents abuse and DDoS attacks via Arcjet
- ✅ **Bot Detection**: Blocks automated malicious requests
- ✅ **No Data Storage**: No sensitive information is logged or persisted
- ✅ **Secure Headers**: Helmet.js provides comprehensive HTTP security headers
- ✅ **Error Handling**: Safe error responses that don't expose internal state
- ✅ **HPP Protection**: Guards against HTTP Parameter Pollution attacks
- ✅ **CORS Configuration**: Controlled cross-origin access

---

## 🏗️ Technology Stack

### Core
- **Runtime**: Node.js >= 16.0.0
- **Framework**: Express.js 5.2.1
- **Language**: JavaScript (ES Modules)

### Security & Middleware
- **[@arcjet/node](https://www.npmjs.com/package/@arcjet/node)**: Rate limiting and bot protection
- **[helmet](https://www.npmjs.com/package/helmet)**: Security HTTP headers
- **[hpp](https://www.npmjs.com/package/hpp)**: HTTP Parameter Pollution protection
- **[cors](https://www.npmjs.com/package/cors)**: Cross-Origin Resource Sharing

### Utilities
- **[node-fetch](https://www.npmjs.com/package/node-fetch)**: HTTP client for data fetching
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Environment variable management
- **[dns](https://www.npmjs.com/package/dns)**: DNS lookups for MX record validation

---

## 🚀 Deployment

### Docker Hub

The official Docker image is available on Docker Hub:

```bash
docker pull sakshamgoel1107/credential-validator
```

**Image Details:**
- **Repository**: [sakshamgoel1107/credential-validator](https://hub.docker.com/r/sakshamgoel1107/credential-validator)
- **Base Image**: Node.js Alpine (lightweight)
- **Size**: Optimized for production
- **Updates**: Automatically built on every release

### Production Deployment Options

#### Docker Swarm
```bash
docker service create \
  --name credential-validator \
  --replicas 3 \
  --publish 3000:3000 \
  -e ARCJET_KEY=your_key \
  sakshamgoel1107/credential-validator
```

#### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: credential-validator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: credential-validator
  template:
    metadata:
      labels:
        app: credential-validator
    spec:
      containers:
      - name: credential-validator
        image: sakshamgoel1107/credential-validator
        ports:
        - containerPort: 3000
        env:
        - name: ARCJET_KEY
          valueFrom:
            secretKeyRef:
              name: credential-validator-secrets
              key: arcjet-key
```

#### Cloud Platforms
- **AWS ECS/Fargate**: Use the Docker image directly
- **Google Cloud Run**: Deploy with one command
- **Azure Container Instances**: Quick deployment from Docker Hub
- **Heroku**: Deploy using container registry
- **DigitalOcean App Platform**: Direct Docker Hub integration

---

## 💻 Development

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- Docker (optional)

### Local Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/FairArena/Credential-Validator.git
   cd Credential-Validator
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run in development:**
   ```bash
   npm start
   ```

### Building Docker Image Locally

```bash
docker build -t credential-validator .
docker run -p 3000:3000 -e ARCJET_KEY=your_key credential-validator
```

### Project Structure

```
Credential-Validator/
├── config/
│   ├── arcjet.js           # Arcjet security configuration
│   └── env.js              # Environment variable management
├── middleware/
│   └── arcjet.middleware.js # Arcjet middleware setup
├── utils/
│   ├── emailValidator.js   # Email validation logic
│   └── phoneValidator.js   # Phone validation logic
├── index.js                # Application entry point
├── package.json            # Dependencies and scripts
├── Dockerfile              # Docker image definition
└── README.md               # Documentation
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues
- Use GitHub Issues for bug reports
- Include detailed reproduction steps
- Provide environment details (OS, Node version, etc.)

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Credential-Validator.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm start
   # Test all endpoints manually
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new validation feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Open Pull Request on GitHub
   ```

### Code Style
- Use ES6+ features
- Follow ESLint recommendations
- Write self-documenting code
- Add JSDoc comments for functions

---

## 📝 Use Cases

- **User Registration**: Prevent fake accounts with disposable emails
- **Form Validation**: Ensure legitimate contact information
- **E-commerce**: Reduce fraud with valid email/phone verification
- **Marketing Campaigns**: Maintain clean contact lists
- **SaaS Applications**: Protect against trial abuse
- **Authentication Systems**: Enhance account security
- **Survey Platforms**: Ensure response authenticity
- **Customer Support**: Verify genuine customer contacts

---

## ⚠️ Disclaimer

This tool provides validation based on publicly available data sources and heuristics. While we strive for accuracy:

- **False Positives**: Some legitimate services may be flagged
- **False Negatives**: New disposable services may not be detected immediately
- **Best Effort**: Validation is probabilistic, not deterministic
- **Complementary Use**: Consider using alongside other verification methods

For critical applications, implement additional validation layers such as:
- Email verification codes
- SMS OTP confirmation
- Manual review processes
- Multi-factor authentication

---

## 📈 Performance

- **Response Time**: < 100ms average (excluding MX lookups)
- **MX Lookup**: Adds 100-500ms depending on DNS response
- **Throughput**: Handles thousands of requests per minute
- **Rate Limiting**: Configurable per client IP
- **Resource Usage**: Low memory footprint (~50MB)
- **Scalability**: Horizontally scalable with Docker/K8s

---

## 📄 License

This project is licensed under the **Proprietary License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Saksham Goel**
- GitHub: [@sakshamgoel1107](https://github.com/sakshamgoel1107)
- Docker Hub: [sakshamgoel1107](https://hub.docker.com/u/sakshamgoel1107)

---

## 🙏 Acknowledgments

- [Arcjet](https://arcjet.com) for security and rate limiting infrastructure
- Open-source community for maintaining disposable email/phone databases
- [Express.js](https://expressjs.com) team for the robust web framework
- All contributors to the dependencies used in this project

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/FairArena/Credential-Validator/issues)
- **Email**: fairarena.contact@gmail.com
- **Documentation**: This README and inline code comments
- **Community**: Star the repo and join discussions

---

<p align="center">
  <a href="https://fair.sakshamg.me">🌐 Website</a> •
  <a href="https://github.com/FairArena/Credential-Validator">💻 GitHub</a> •
  <a href="https://hub.docker.com/r/sakshamgoel1107/credential-validator">🐳 Docker Hub</a> •
  <a href="mailto:fairarena.contact@gmail.com">📧 Support</a>
</p>

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/FairArena">FairArena Team</a></sub>
</p>

<p align="center">
  <sub>⭐ Star this repository if you find it useful!</sub>
</p>
