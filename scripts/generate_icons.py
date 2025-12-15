import os
import shutil
from PIL import Image, ImageOps
from collections import Counter

def get_dominant_color(image):
    """
    Finds the most common color in the image.
    Resizes image to small size for faster processing.
    """
    img = image.copy()
    img = img.convert("RGBA")
    img = img.resize((100, 100))
    pixels = list(img.getdata())
    # Filter out transparent pixels if any
    pixels = [p for p in pixels if p[3] > 0]
    if not pixels:
        return (255, 255, 255, 255) # Default white if all transparent
    
    counts = Counter(pixels)
    most_common = counts.most_common(1)[0][0]
    return most_common

def add_padding(image, target_size, padding_ratio, color):
    """
    Adds padding to the image.
    target_size: tuple (width, height)
    padding_ratio: float (0.0 to 1.0), fraction of size to be padding (total)
    color: tuple (r, g, b, a) or (r, g, b)
    """
    img = image.copy()
    # Calculate new content size
    target_w, target_h = target_size
    content_ratio = 1.0 - padding_ratio
    new_w = int(target_w * content_ratio)
    new_h = int(target_h * content_ratio)
    
    # Resize content
    img.thumbnail((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create background
    bg = Image.new("RGBA", target_size, color)
    
    # Paste content in center
    offset_x = (target_w - img.width) // 2
    offset_y = (target_h - img.height) // 2
    bg.paste(img, (offset_x, offset_y), img if img.mode == 'RGBA' else None)
    
    return bg

def generate_icons():
    assets_dir = os.path.join(os.getcwd(), "assets", "images")
    icon_path = os.path.join(assets_dir, "icon.png")
    source_icon_path = os.path.join(assets_dir, "icon_source.png")
    
    # Ensure source icon exists
    if not os.path.exists(source_icon_path):
        if os.path.exists(icon_path):
            print(f"Creating source icon from {icon_path}")
            shutil.copy(icon_path, source_icon_path)
        else:
            print("Error: No icon.png found to use as source.")
            return

    print(f"Reading from {source_icon_path}")
    source_img = Image.open(source_icon_path)
    
    dominant_color = get_dominant_color(source_img)
    print(f"Dominant color: {dominant_color}")
    
    # Generate icon.png (Main Icon) - 1024x1024
    # User asked for "some extra whitespace". Let's give it 20% padding.
    print("Generating icon.png...")
    icon_new = add_padding(source_img, (1024, 1024), 0.25, dominant_color)
    icon_new.save(os.path.join(assets_dir, "icon.png"))
    
    # Generate adaptive-icon.png - 1024x1024
    # Adaptive icons usually need more padding because of the circular crop.
    # Android adaptive icon safe zone is 66/108 = 0.61. 
    # So we need at least 39% padding. Let's do 40%.
    print("Generating adaptive-icon.png...")
    adaptive_new = add_padding(source_img, (1024, 1024), 0.40, dominant_color)
    adaptive_new.save(os.path.join(assets_dir, "adaptive-icon.png"))
    
    # Generate favicon.png - 48x48
    print("Generating favicon.png...")
    # For favicon, maybe less padding is better so it's visible? 
    # Let's use 10% padding for specific favicon
    favicon_new = add_padding(source_img, (48, 48), 0.1, dominant_color)
    favicon_new.save(os.path.join(assets_dir, "favicon.png"))
    
    # Generate splash-icon.png - usually just the logo.
    # We can use the main icon or something larger. 
    # Expo default is often just the icon centered on a splash screen color.
    # But if we want the "icon" itself to be the splash image:
    print("Generating splash-icon.png...")
    splash_new = add_padding(source_img, (1024, 1024), 0.0, dominant_color) # No padding, or maybe consistent padding?
    # Actually, splash screens usually have the logo somewhat small in the center.
    # But Expo's 'splash.image' is placed in the center. If we provide a 1024x1024 image, Expo scales it.
    # Let's match the 'icon.png' style.
    icon_new.save(os.path.join(assets_dir, "splash-icon.png"))
    
    print("Done generating icons.")

if __name__ == "__main__":
    generate_icons()
