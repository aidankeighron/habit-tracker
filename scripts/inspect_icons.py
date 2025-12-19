from PIL import Image
import os

files = [
    'icon.png',
    'adaptive-icon.png',
    'icon_source.png'
]
base_path = 'c:/Users/Billy1301/Documents/Programming/Programs/habit-tracker/assets/images/'

for f in files:
    path = os.path.join(base_path, f)
    if os.path.exists(path):
        try:
            img = Image.open(path).convert("RGBA")
            extrema = img.getextrema()
            alpha_extrema = extrema[3] # (min, max) of alpha
            print(f"{f}: Alpha range {alpha_extrema}")
            
            # Check corners for transparency
            w, h = img.size
            corners = [
                img.getpixel((0, 0)),
                img.getpixel((w-1, 0)),
                img.getpixel((0, h-1)),
                img.getpixel((w-1, h-1))
            ]
            print(f"  Corners: {corners}")
            
        except Exception as e:
            print(f"{f}: Error {e}")
    else:
        print(f"{f}: Not found")
