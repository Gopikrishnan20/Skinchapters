
# Skin Chapters Backend Design

This document provides a detailed design specification for the Skin Chapters backend system.

## System Architecture

The backend consists of the following components:

1. **API Layer**: FastAPI web service that handles HTTP requests
2. **ML Layer**: TensorFlow/Keras models for skin analysis
3. **Storage Layer**: PostgreSQL database and S3 storage
4. **Caching Layer**: Redis for performance optimization

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Web Clients  │────▶│  API Gateway  │────▶│  API Service  │
└───────────────┘     └───────────────┘     └───────────────┘
                                                    │
                                                    ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Database    │◀───▶│ ML Inference  │◀───▶│  File Storage │
└───────────────┘     └───────────────┘     └───────────────┘
```

## FastAPI Backend Implementation

### Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py        # API routes
│   │   └── endpoints/       # API endpoint modules
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py      # Authentication & authorization
│   │   └── errors.py        # Error handling
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py       # Database session management
│   │   └── models.py        # SQLAlchemy ORM models
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── models.py        # ML model loading and inference
│   │   ├── preprocessing.py # Image preprocessing functions
│   │   └── utils.py         # ML utility functions
│   └── services/
│       ├── __init__.py
│       ├── analysis.py      # Skin analysis service
│       └── storage.py       # File storage service
├── models/                  # Saved ML models
│   ├── skin_type_model.h5
│   └── skin_condition_model.h5
├── migrations/              # Alembic database migrations
├── tests/                   # Test suite
├── .env                     # Environment variables
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
└── requirements.txt         # Python dependencies
```

### Core Components

#### 1. FastAPI Application (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Skin Chapters API",
    description="API for skin analysis and personalized skincare recommendations",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/v1")
```

#### 2. API Router (`app/api/router.py`)

```python
from fastapi import APIRouter

from app.api.endpoints import analysis

api_router = APIRouter()
api_router.include_router(analysis.router, prefix="/analyze", tags=["analysis"])
```

#### 3. Analysis Endpoint (`app/api/endpoints/analysis.py`)

```python
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.security import APIKeyHeader

from app.core.security import validate_api_key
from app.services.analysis import analyze_skin_image

router = APIRouter()
api_key_header = APIKeyHeader(name="Authorization")

@router.post("/skin")
async def analyze_skin(
    image: UploadFile = File(...),
    api_key: str = Depends(validate_api_key),
    user_id: str = None
):
    """
    Analyze skin from uploaded facial image.
    """
    # Validate image format
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, detail="Invalid image format")
    
    # Process the image and get analysis
    try:
        result = await analyze_skin_image(image, user_id)
        return result
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    except Exception as e:
        raise HTTPException(500, detail="Analysis failed")
```

#### 4. Analysis Service (`app/services/analysis.py`)

```python
import io
import numpy as np
from datetime import datetime
import uuid
from PIL import Image

from app.ml.models import get_skin_type_model, get_skin_condition_model
from app.ml.preprocessing import preprocess_image, detect_face
from app.db.models import SkinAnalysis
from app.db.session import get_db

async def analyze_skin_image(image_file, user_id=None):
    """
    Process an uploaded image and run skin analysis.
    """
    # Read the image file
    contents = await image_file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Detect face in the image
    face_image = detect_face(image)
    if face_image is None:
        raise ValueError("No face detected in the image")
    
    # Preprocess the image for the models
    processed_image = preprocess_image(face_image)
    
    # Get predictions from models
    skin_type_model = get_skin_type_model()
    skin_condition_model = get_skin_condition_model()
    
    skin_type_pred = skin_type_model.predict(np.expand_dims(processed_image, axis=0))
    skin_condition_pred = skin_condition_model.predict(np.expand_dims(processed_image, axis=0))
    
    # Map predictions to labels
    skin_types = ["oily", "dry", "normal", "combination", "wrinkly", "sensitive"]
    skin_type = skin_types[np.argmax(skin_type_pred)]
    
    condition_labels = ["acne", "blackheads", "wrinkles", "dullness", "redness", 
                         "dehydration", "hyperpigmentation", "uneven_texture"]
    threshold = 0.5
    conditions = [condition_labels[i] for i, prob in enumerate(skin_condition_pred[0]) if prob > threshold]
    
    # Calculate skin score
    skin_score = calculate_skin_score(skin_condition_pred[0], condition_labels)
    
    # Determine recommended chapter
    chapter = determine_recommended_chapter(skin_type, conditions, skin_score)
    
    # Create analysis record
    analysis_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()
    
    # Save to database if user_id is provided
    if user_id:
        with get_db() as db:
            analysis = SkinAnalysis(
                id=analysis_id,
                user_id=user_id,
                skin_type=skin_type,
                conditions=conditions,
                skin_score=skin_score,
                recommended_chapter=chapter,
                created_at=timestamp
            )
            db.add(analysis)
            db.commit()
    
    # Return analysis results
    return {
        "skin_type": skin_type,
        "conditions": conditions,
        "skin_score": skin_score,
        "recommended_chapter": chapter,
        "analysis_id": analysis_id,
        "created_at": timestamp
    }

def calculate_skin_score(condition_probs, condition_labels):
    """
    Calculate a skin score (0-100) based on detected conditions.
    """
    # Start with a perfect score
    score = 100
    
    # Deduct points based on condition probabilities
    deductions = {
        "acne": 20,
        "blackheads": 10,
        "wrinkles": 15,
        "dullness": 5,
        "redness": 10,
        "dehydration": 15,
        "hyperpigmentation": 10,
        "uneven_texture": 15
    }
    
    for i, label in enumerate(condition_labels):
        if label in deductions:
            # Scale deduction by probability
            score -= deductions[label] * condition_probs[i]
    
    # Ensure score is between 0 and 100
    return max(0, min(100, int(score)))

def determine_recommended_chapter(skin_type, conditions, skin_score):
    """
    Determine the recommended chapter based on analysis.
    """
    # Default to Chapter 4 (Maintenance)
    chapter = 4
    
    # Logic for chapter recommendation
    if "dehydration" in conditions or skin_type == "dry":
        chapter = 1  # Hydration
    elif "wrinkles" in conditions or skin_type == "wrinkly":
        chapter = 2  # Repair
    elif skin_type == "sensitive" or "redness" in conditions:
        chapter = 3  # Protection
    elif "dullness" in conditions or "hyperpigmentation" in conditions:
        chapter = 5  # Brightening & Glow
    elif "acne" in conditions or "blackheads" in conditions:
        chapter = 6  # Repair & Recovery
    elif skin_score > 85:
        chapter = 7  # Maintenance & Prevention
    
    return chapter
```

#### 5. ML Models (`app/ml/models.py`)

```python
import os
import tensorflow as tf
from app.core.config import settings

# Cache for loaded models
_skin_type_model = None
_skin_condition_model = None

def get_skin_type_model():
    """
    Load and return the skin type classification model.
    """
    global _skin_type_model
    if _skin_type_model is None:
        model_path = os.path.join(settings.MODEL_DIR, "skin_type_model.h5")
        _skin_type_model = tf.keras.models.load_model(model_path)
    return _skin_type_model

def get_skin_condition_model():
    """
    Load and return the skin condition detection model.
    """
    global _skin_condition_model
    if _skin_condition_model is None:
        model_path = os.path.join(settings.MODEL_DIR, "skin_condition_model.h5")
        _skin_condition_model = tf.keras.models.load_model(model_path)
    return _skin_condition_model
```

#### 6. Image Preprocessing (`app/ml/preprocessing.py`)

```python
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf

def detect_face(image):
    """
    Detect and extract face from image.
    Uses OpenCV's Haar Cascade for simplicity, but MTCNN or MediaPipe
    would be more accurate for production.
    """
    # Convert PIL Image to OpenCV format
    img = np.array(image.convert('RGB'))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    
    # Load face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Detect faces
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return None
    
    # Extract largest face
    x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])
    face_img = img[y:y+h, x:x+w]
    
    # Convert back to PIL Image
    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
    return Image.fromarray(face_img)

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocess image for model input.
    """
    # Resize image
    image = image.resize(target_size)
    
    # Convert to array and normalize
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = img_array / 255.0  # Normalize to [0,1]
    
    return img_array
```

## Database Schema

### SQLAlchemy Models (`app/db/models.py`)

```python
from sqlalchemy import Column, String, Integer, ARRAY, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime)

class SkinAnalysis(Base):
    __tablename__ = "skin_analyses"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    skin_type = Column(String, nullable=False)
    conditions = Column(ARRAY(String), nullable=False)
    skin_score = Column(Integer, nullable=False)
    recommended_chapter = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)
```

## ML Model Training

While not part of the API service, here's a brief overview of the model training process:

```python
# Example of skin type model training with transfer learning

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Create base model with pre-trained weights
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Add custom classification layer
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(6, activation='softmax')(x)  # 6 skin types

# Create the final model
model = Model(inputs=base_model.input, outputs=predictions)

# Freeze base model layers
for layer in base_model.layers:
    layer.trainable = False

# Compile the model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train with data augmentation
train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Load training data
train_generator = train_datagen.flow_from_directory(
    'dataset/skin_type/',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)

# Train the model
model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    epochs=20
)

# Fine-tune the model (unfreeze some layers)
for layer in base_model.layers[-10:]:
    layer.trainable = True

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),  # Low learning rate for fine-tuning
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Continue training
model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    epochs=10
)

# Save the model
model.save('models/skin_type_model.h5')
```

## Deployment

### Docker Configuration (`Dockerfile`)

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./backend /app/

# Copy ML models
COPY ./models /app/models/

# Set environment variables
ENV PYTHONPATH=/app

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/skinchapters
      - REDIS_URL=redis://redis:6379/0
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=minioadmin
      - S3_SECRET_KEY=minioadmin
      - S3_BUCKET=skinchapters
      - API_KEY=your_secret_api_key
    volumes:
      - ./models:/app/models
    depends_on:
      - db
      - redis
      - minio

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_USER=postgres
      - POSTGRES_DB=skinchapters
    ports:
      - "5432:5432"

  redis:
    image: redis:6
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    volumes:
      - minio_data:/data
    environment:
      - MINIO_ACCESS_KEY=minioadmin
      - MINIO_SECRET_KEY=minioadmin
    command: server /data
    ports:
      - "9000:9000"

volumes:
  postgres_data:
  minio_data:
```

## Scaling Considerations

1. **Horizontal Scaling**: Use Kubernetes to manage multiple API containers
2. **Model Optimization**: Quantize models for faster inference
3. **Caching**: Use Redis to cache frequent analysis results
4. **Database Sharding**: For high user volume, implement database sharding
5. **CDN**: Use a CDN for serving static assets
6. **Load Balancing**: Implement load balancing with Nginx or cloud provider tools
7. **GPU Acceleration**: For high-throughput environments, use GPU-enabled instances

## Monitoring and Logging

1. **Application Monitoring**: Use Prometheus for metrics collection
2. **Logging**: ELK stack (Elasticsearch, Logstash, Kibana) for log aggregation
3. **Error Tracking**: Sentry for error monitoring
4. **API Analytics**: Track API usage patterns
5. **Model Performance**: Monitor model accuracy and drift over time

## Security Considerations

1. **API Authentication**: JWT or API key authentication
2. **Rate Limiting**: Prevent abuse with rate limiting
3. **Input Validation**: Validate all user inputs
4. **HTTPS**: Use HTTPS for all communications
5. **Data Privacy**: Follow GDPR/CCPA guidelines
6. **Vulnerability Scanning**: Regular security scans
7. **Storage Security**: Encrypt sensitive user data
