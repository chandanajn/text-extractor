import io

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Image as RLImage
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from models.ocr import OCRRecord


def generate_ocr_pdf(record: OCRRecord) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    Story = []

    # Title
    Story.append(Paragraph("OCR Extraction Report", styles["Title"]))
    Story.append(Spacer(1, 12))

    # Metadata
    Story.append(Paragraph(f"<b>Filename:</b> {record.filename}", styles["Normal"]))
    Story.append(Paragraph(f"<b>Language:</b> {record.language}", styles["Normal"]))
    Story.append(
        Paragraph(f"<b>Confidence:</b> {record.confidence:.2f}%", styles["Normal"])
    )
    Story.append(
        Paragraph(
            f"<b>Processing Time:</b> {record.processing_time:.2f}s", styles["Normal"]
        )
    )
    Story.append(
        Paragraph(
            f"<b>Date:</b> {record.created_at.strftime('%Y-%m-%d %H:%M:%S')}",
            styles["Normal"],
        )
    )
    Story.append(Spacer(1, 12))

    # Original Image (if exists)
    try:
        img = RLImage(record.image_path)
        img.drawHeight = 200
        img.drawWidth = 200
        Story.append(img)
        Story.append(Spacer(1, 12))
    except Exception:
        Story.append(Paragraph("<i>Image could not be loaded</i>", styles["Normal"]))
        Story.append(Spacer(1, 12))

    # Extracted Text
    Story.append(Paragraph("<b>Extracted Text:</b>", styles["Heading2"]))
    Story.append(Spacer(1, 6))

    # Split text by newlines and add paragraphs
    for line in record.text.split("\n"):
        if line.strip():
            Story.append(Paragraph(line, styles["Normal"]))
        else:
            Story.append(Spacer(1, 6))

    doc.build(Story)
    buffer.seek(0)
    return buffer
