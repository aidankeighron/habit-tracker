from PIL import Image
import os
import math

def create_notification_icon():
    source_path = 'c:/Users/Billy1301/Documents/Programming/Programs/habit-tracker/assets/images/adaptive-icon.png'
    output_path = 'c:/Users/Billy1301/Documents/Programming/Programs/habit-tracker/assets/images/notification-icon.png'
    
    # Background color to remove: #F7F3EE -> (247, 243, 238)
    bg_color = (247, 243, 238)
    tolerance = 20 # Allow some variance

    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        return

    try:
        img = Image.open(source_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        
        for item in datas:
            # item is (r, g, b, a)
            
            # Calculate distance to background color
            dist = math.sqrt(
                (item[0] - bg_color[0])**2 + 
                (item[1] - bg_color[1])**2 + 
                (item[2] - bg_color[2])**2
            )

            if dist < tolerance:
                # It is background -> make transparent
                newData.append((255, 255, 255, 0))
            else:
                # It is foreground -> make pure white
                newData.append((255, 255, 255, 255))

        img.putdata(newData)
        img.save(output_path)
        
        # Check alpha range of result
        extrema = img.getextrema()
        print(f"Successfully created {output_path}")
        print(f"Alpha range: {extrema[3]}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    create_notification_icon()
