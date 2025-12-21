from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
import os

def convert_svg_to_png(source, dest, size=(96, 96)):
    if not os.path.exists(source):
        print(f"Source file not found: {source}")
        return

    try:
        drawing = svg2rlg(source)
        
        # Scale to desired size
        scale_factor = size[0] / drawing.width
        drawing.scale(scale_factor, scale_factor)
        drawing.width = size[0]
        drawing.height = size[1]
        
        # Chromakey approach:
        # Render on a distinct color (Green) then remove it.
        # 0x00FF00 is Green.
        bg_color_int = 0x00FF00
        img = renderPM.drawToPIL(drawing, bg=bg_color_int)
        
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # Green in RGB is (0, 255, 0)
        # But wait, reportlab 0x00FF00 might be RRGGBB.
        # Let's verify what PIL gets.
        
        for item in datas:
            # item is (r, g, b, a)
            # Check for green-ish
            if item[0] < 50 and item[1] > 200 and item[2] < 50:
                newData.append((0, 0, 0, 0)) # Transparent
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(dest, 'PNG')
        
        print(f"Success! Created {dest}")
    except Exception as e:
        print(f"Error converting: {e}")

if __name__ == "__main__":
    source = r'c:\Users\Billy1301\Documents\Programming\Programs\habit-tracker\assets\images\bell-icon.svg'
    dest = r'c:\Users\Billy1301\Documents\Programming\Programs\habit-tracker\assets\images\custom-notification-icon.png'
    convert_svg_to_png(source, dest, size=(192, 192))
