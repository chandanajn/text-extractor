import io
import os
import time

import cv2
import numpy as np
import pytesseract
from PIL import Image

from core.config import settings

# Point pytesseract to the tesseract executable
pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

# Use local tessdata directory if available
local_tessdata = os.path.join(os.path.dirname(__file__), "..", "tessdata")
if os.path.exists(local_tessdata):
    os.environ["TESSDATA_PREFIX"] = local_tessdata


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Apply OpenCV preprocessing to improve OCR accuracy.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # type: ignore

    # Noise removal
    blur = cv2.medianBlur(gray, 3)

    # Thresholding (Otsu's binarization)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return thresh


def process_ocr(
    image_bytes: bytes,
    language: str = "eng",
    mode: str = "auto",
    apply_preprocessing: bool = True,
) -> dict:
    """
    Extracts text from an image represented as bytes using Tesseract OCR.
    """
    start_time = time.time()
    try:
        if apply_preprocessing:
            processed_img_np = preprocess_image(image_bytes)
            image = Image.fromarray(processed_img_np)
        else:
            image = Image.open(io.BytesIO(image_bytes))

        # Configure PSM based on mode
        # 3 = Fully automatic page segmentation (default)
        # 6 = Assume a single uniform block of text.
        custom_config = r"--psm 3"
        if mode == "printed":
            custom_config = r"--psm 3"
        elif mode == "handwritten":
            custom_config = r"--psm 6"

        # Extract data to get confidence
        ocr_data = pytesseract.image_to_data(
            image,
            lang=language,
            config=custom_config,
            output_type=pytesseract.Output.DICT,
        )

        text_lines = []
        confidences = []

        for i in range(len(ocr_data["text"])):
            text = ocr_data["text"][i].strip()
            conf = int(ocr_data["conf"][i])
            if text and conf > 0:
                text_lines.append(text)
                confidences.append(conf)

        extracted_text = " ".join(text_lines)
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        end_time = time.time()

        return {
            "text": extracted_text,
            "confidence": avg_confidence,
            "processing_time": end_time - start_time,
        }
    except Exception as e:
        print(f"Error extracting text: {e}")
        return {
            "text": "",
            "confidence": 0.0,
            "processing_time": time.time() - start_time,
        }
