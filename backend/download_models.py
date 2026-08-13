import os
import urllib.request

tessdata_dir = os.path.join(os.path.dirname(__file__), "tessdata")
os.makedirs(tessdata_dir, exist_ok=True)

languages = [
    "eng",
    "tel",
    "hin",
    "kan",
    "mal",
    "tam",
    "ben",
    "guj",
    "mar",
    "pan",
    "spa",
    "fra",
    "deu",
    "ita",
    "por",
    "rus",
    "jpn",
    "kor",
    "chi_sim",
    "chi_tra",
    "ara",
]
base_url = "https://github.com/tesseract-ocr/tessdata/raw/main/{}.traineddata"

for lang in languages:
    url = base_url.format(lang)
    dest = os.path.join(tessdata_dir, f"{lang}.traineddata")
    if not os.path.exists(dest):
        print(f"Downloading {lang}.traineddata...")
        try:
            urllib.request.urlretrieve(url, dest)  # nosec B310
            print(f"Successfully downloaded {lang}.traineddata")
        except Exception as e:
            print(f"Failed to download {lang}.traineddata: {e}")
    else:
        print(f"{lang}.traineddata already exists.")

print("Finished downloading language models.")
