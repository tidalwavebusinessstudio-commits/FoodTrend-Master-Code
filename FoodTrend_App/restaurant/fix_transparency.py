from PIL import Image

def remove_background():
    img_path = "assets/logo_black.png"
    out_path = "assets/logo.png"
    
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    
    for item in datas:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        # Check for Black (Background)
        # Being very strict: If it's dark, it's background.
        # But we must be careful not to remove the dark red parts if any.
        # The prompt said "Solid Black", so we can be strict.
        
        if r < 50 and g < 50 and b < 50:
             # Transparent
            new_data.append((0, 0, 0, 0))
        else:
            # Keep original pixel
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved transparent logo to {out_path}")

if __name__ == "__main__":
    remove_background()
