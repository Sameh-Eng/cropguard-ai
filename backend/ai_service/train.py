import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import os

# Dataset paths
dataset_path = r"C:\Users\smakr\Downloads\web_project\Plant Village Dataset"
train_dir = os.path.join(dataset_path, "Train")
val_dir = os.path.join(dataset_path, "Val")

img_height = 224
img_width = 224
batch_size = 32

print("Setting up data generators...")
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical'
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical'
)

# Save class indices for inference
import json
class_indices = {v: k for k, v in train_generator.class_indices.items()}
with open('class_indices.json', 'w') as f:
    json.dump(class_indices, f)
print("Saved class_indices.json")

num_classes = len(train_generator.class_indices)
print(f"Found {num_classes} classes.")

print("Building model...")
# Use MobileNetV2 for fast and accurate transfer learning
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))

# Freeze the base model
for layer in base_model.layers:
    layer.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

print("Starting training (this may take a while depending on your hardware)...")
epochs = 5 # Start with a small number of epochs for quick feedback

history = model.fit(
    train_generator,
    epochs=epochs,
    validation_data=val_generator
)

print("Training completed. Saving model...")
model.save('crop_disease_model.h5')
print("Model saved as crop_disease_model.h5")
