import os
import urllib.request

# Create images folder if not exists
os.makedirs('images', exist_ok=True)

# Exact, authentic, real-world photographs from Wikimedia Commons for all 12 temples
WIKIMEDIA_URLS = {
    "kashi-vishwanath": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kashi_Vishwanath_Temple.jpg/640px-Kashi_Vishwanath_Temple.jpg",
    "tirupati-balaji": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tirupati_Temple_Gopuram.jpg/640px-Tirupati_Temple_Gopuram.jpg",
    "vaishno-devi": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Vaishno_Devi_Cave.jpg/640px-Vaishno_Devi_Cave.jpg",
    "kedarnath-temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kedarnath_Temple.jpg/640px-Kedarnath_Temple.jpg",
    "meenakshi-amman": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Meenakshi_Temple_Gopuram.jpg/640px-Meenakshi_Temple_Gopuram.jpg",
    "badrinath-dham": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Badrinath_Temple.jpg/640px-Badrinath_Temple.jpg",
    "somnath-temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Somnath_Temple.jpg/640px-Somnath_Temple.jpg",
    "shirdi-sai-baba": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Shirdi_Sai_Baba_Mandir.jpg/640px-Shirdi_Sai_Baba_Mandir.jpg",
    "jagannath-puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jagannath_Temple_%28day_view%29%2C_Puri.jpg/640px-Jagannath_Temple_%28day_view%29%2C_Puri.jpg",
    "rameshwaram-temple": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ramanathaswamy_Temple_Corridor_Rameswaram_India.jpg",
    "gangotri-dham": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Gangotri_Temple.jpg",
    "dwarkadheesh-temple": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dwarkadhish_Temple_Dwarka.jpg"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print("Downloading exact, authentic temple photos from Wikimedia Commons...")

for name, url in WIKIMEDIA_URLS.items():
    dest_path = f"images/{name}.jpg"
    
    # Overwrite previous incorrect/ai images
    print(f"Downloading authentic image for {name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"--> Succeeded! Saved to {dest_path} ({os.path.getsize(dest_path)} bytes)")
    except Exception as e:
        print(f"--> Failed for {name}: {e}")

print("Authentic downloads completed!")
