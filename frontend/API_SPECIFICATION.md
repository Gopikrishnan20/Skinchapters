
# Skin Chapters AI API Specification

This document outlines the API specification for the Skin Chapters backend AI system.

## Base URL

Production: `https://api.skinchapters.com/v1`
Development: `http://localhost:8000`

## Authentication

All API requests should include an API key in the header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### 1. Analyze Skin

Analyzes a user's skin from an uploaded selfie/photo.

**URL**: `/analyze_skin`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| image | File | Yes | The user's facial image for analysis |
| userId | String | No | Optional user ID for tracking history |

#### Response Format

```json
{
  "skin_type": "combination",
  "conditions": ["acne", "dryness", "t-zone oiliness"],
  "skin_score": 68,
  "recommended_chapter": 6,
  "analysis_id": "a1b2c3d4-e5f6",
  "created_at": "2025-04-12T10:30:00Z"
}
```

#### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| skin_type | String | The primary skin type detected (oily, dry, combination, sensitive, normal, wrinkly) |
| conditions | Array | List of skin conditions detected |
| skin_score | Integer | Score from 0-100 representing overall skin health |
| recommended_chapter | Integer | Recommended chapter number (1-7) based on analysis |
| analysis_id | String | Unique ID for this analysis |
| created_at | String | ISO timestamp of when the analysis was performed |

#### Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | INVALID_IMAGE | Image is missing or invalid |
| 400 | NO_FACE_DETECTED | No face was detected in the image |
| 400 | MULTIPLE_FACES | Multiple faces were detected in the image |
| 500 | ANALYSIS_FAILED | The skin analysis process failed |

## Backend Implementation Guidelines

### AI Models

Two deep learning models are required:

1. **Skin Type Classifier** (`skin_type_model.h5`)
   - Single-label classification
   - Classes: oily, dry, normal, combination, wrinkly, sensitive
   - Architecture: CNN-based with transfer learning from EfficientNetB0 or MobileNetV2

2. **Skin Condition Detector** (`skin_condition_model.h5`)
   - Multi-label classification using sigmoid activation
   - Conditions: acne, blackheads, dullness, wrinkles, redness, etc.
   - Uses binary cross-entropy loss

### Image Preprocessing

1. Face detection using MTCNN, dlib, or MediaPipe
2. Face alignment if needed
3. Resize to model input dimensions (e.g., 224x224)
4. Normalization according to model requirements
5. Data augmentation during training (not for inference)

### Skin Score Calculation

Skin score starts at 100 and deducts points based on:
- Severity of conditions (e.g., severe acne: -20, mild acne: -10)
- Number of conditions detected
- Skin evenness and texture issues

### Chapter Recommendation Logic

| Primary Issue | Recommended Chapter |
|---------------|---------------------|
| Dehydration | Chapter 1: Hydration |
| Lines/Wrinkles | Chapter 2: Repair |
| Environmental damage | Chapter 3: Protection |
| General maintenance | Chapter 4: Maintenance |
| Dullness/Uneven tone | Chapter 5: Brightening & Glow |
| Acne/Irritation | Chapter 6: Repair & Recovery |
| Prevention focus | Chapter 7: Maintenance & Prevention |

## Deployment Recommendations

### Infrastructure

- FastAPI or Flask for the API framework
- TensorFlow Serving or ONNX Runtime for model serving
- PostgreSQL for storing user data and analysis history
- Redis for caching frequent operations
- S3-compatible storage for temporary image storage
- Docker containers for easy deployment
- Kubernetes or AWS ECS for orchestration (optional)

### Performance Considerations

- Implement model quantization for faster inference
- Use batch processing when possible
- Implement proper caching strategies
- Consider GPU acceleration for production
- Implement proper request throttling and rate limits

### Security Recommendations

- Store images temporarily and securely
- Implement proper authentication and authorization
- Sanitize all user inputs
- Use HTTPS for all communications
- Implement proper CORS policies
- Follow GDPR/CCPA guidelines for user data

## Testing

For testing the API without a real backend, use the mock service provided in the frontend codebase (`src/services/skinAnalysisService.ts`).
