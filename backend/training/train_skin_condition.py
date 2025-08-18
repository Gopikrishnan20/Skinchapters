import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from sklearn.model_selection import train_test_split

# Load labels
df = pd.read_csv(r'd:\SRM\skinchapters\backend\data\skin_condition\skin_condition_labels.csv')


# Ensure labels match backend exactly
labels = ['acne', 'blackheads', 'wrinkles', 'none']

# Split dataset
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_dataframe(
    train_df,
    directory='data/skin_condition/',
    x_col='filename',
    y_col=labels,
    target_size=(128, 128),
    class_mode='raw',
    batch_size=32
)

val_gen = val_datagen.flow_from_dataframe(
    val_df,
    directory='data/skin_condition/',
    x_col='filename',
    y_col=labels,
    target_size=(128, 128),
    class_mode='raw'
)

# Load MobileNetV2 base
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(128, 128, 3))
base_model.trainable = False  # Freeze for transfer learning

# Model
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dropout(0.3),
    Dense(len(labels), activation='sigmoid')  # Multi-label
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=[tf.keras.metrics.BinaryAccuracy(), tf.keras.metrics.AUC()]
)

# Train
callbacks = [
    tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
]

model.fit(train_gen, validation_data=val_gen, epochs=15, callbacks=callbacks)

# Save
model.save('models/skin_condition_model.h5')
