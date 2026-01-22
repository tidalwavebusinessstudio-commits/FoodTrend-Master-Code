from PIL import Image

def remove_background():
    img_path = "assets/logo_source.png"
    out_path = "assets/logo.png"
    
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    # Heuristic: The logo is White Text and Red Arrow. Everything else is background.
    # We will look for pixels that are NOT clearly white or red.
    
    for item in datas:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        # Check for White (Text) - high brightness
        is_white = r > 200 and g > 200 and b > 200
        
        # Check for Red (Arrow) - high Red, relatively lower G and B
        is_red = r > 150 and (r > g + 50) and (r > b + 50)
        
        if is_white or is_red:
            # Keep original pixel
            new_data.append(item)
        else:
            # Make transparent
            new_data.append((0, 0, 0, 0))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved transparent logo to {out_path}")

if __name__ == "__main__":
    remove_background()
