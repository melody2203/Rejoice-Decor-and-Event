#!/bin/bash

# Define source and destination
SRC="Images/inventory_tools"
DEST="frontend/public/images/rentals"

# Helper function to copy and rename
copy_asset() {
    local src_file="$1"
    local dest_subfolder="$2"
    local dest_filename="$3"
    
    if [ -f "$SRC/$src_file" ]; then
        cp "$SRC/$src_file" "$DEST/$dest_subfolder/$dest_filename"
        echo "Copied $src_file to $dest_subfolder/$dest_filename"
    else
        echo "Warning: $src_file not found"
    fi
}

# Mapping
copy_asset "Double Gold Throne.jpg" "chairs" "gold_throne_double.jpg"
copy_asset "Chair.jpg" "chairs" "chair_gold_simple.jpg"
copy_asset "Chair_2.jpg" "chairs" "chair_white_simple.jpg"
copy_asset "Chic Outdoor Wedding Ceremony Seating with Elegant White Chairs.jpg" "chairs" "white_garden_chic.jpg"
copy_asset "Wooden Ceremony Chairs.jpg" "chairs" "wooden_rustic_chairs.jpg"
copy_asset "bride and groom chairs.jpg" "chairs" "bride_groom_chair_1.jpg"

copy_asset "Backdrop.jpg" "curtains" "backdrop_1.jpg"
copy_asset "curtain.jpg" "curtains" "curtain_red.jpg"
copy_asset "Curtain_2.jpg" "curtains" "curtain_gold.jpg"
copy_asset "Curtain_3.jpg" "curtains" "curtain_white.jpg"
copy_asset "ethiopian cultural curtain.jpg" "curtains" "cultural_curtain.jpg"

copy_asset "12 Pcs Tall Gold Trumpet Vases For Centerpieces & Wedding Tables - 21_65_ Tal.jpg" "floral" "gold_trumpet_vases.jpg"
copy_asset "455_4US $ 31_ OFF_New Wedding Arch Outdoor Wedding Decoration Climbing Pergola European Geometry Flower Door Shaped Truss Door Props - Wedding Arches - AliExpress.jpg" "floral" "geometric_arch.jpg"
copy_asset "Curtain Top Decorative Flowers, Handmade Flower Arrangement, Long Table Flower Row Runner, Wedding Aisle Flowers, Home Decor Ground Flower.jpg" "floral" "flower_runner.jpg"
copy_asset "Event Co_ _ Wedding Backdrops & Arches _ Chuppas & Mandaps.jpg" "floral" "luxury_chuppah.jpg"
copy_asset "L High Quality Silk Faux Rose Flowers Runners Fake Floral Aisle Row Decoration Artificial Wedding Background Table Flower Runner - Buy Arch Flower floral Runner flower Runner Product on Alibaba_com.jpg" "floral" "silk_rose_aisle.jpg"
copy_asset "Metal Wedding Arch Flower Arch Horn Door Ivory Door Lawn Wedding Welcome Backdrop Claw Door Outdoor Climbing Rack.jpg" "floral" "metal_welcome_arch.jpg"
copy_asset "New wedding props iron large-scale pentagonal frame outdoor forest arch stage background alien arch frame - AliExpress 15.jpg" "floral" "pentagonal_frame.jpg"
copy_asset "Outdoor Wedding Party Double Circle Metal Iron Arch Stand Backdrop Props - Buy Metal Circle Backdrop,Arch Backdrop,Backdrop Arch Wedding Product on Alibaba_com.jpg" "floral" "double_circle_arch.jpg"
copy_asset "Semi circle wedding alter.jpg" "others" "semi_circle_altar.jpg"

copy_asset "Carpet.jpg" "rugs" "carpet_royal.jpg"
copy_asset "mat.jpg" "rugs" "traditional_grass_mat.jpg"
copy_asset "New Wedding Carpet Festival Film Event Party Decoration Wedding Aisle Runner Non-slip Indoor Outdoor.jpg" "rugs" "event_aisle_runner.jpg"
copy_asset "Stage mat.jpg" "rugs" "stage_flooring.jpg"

copy_asset "1pc Decorative Curtain String Light.jpg" "lighting" "curtain_string_light.jpg"
copy_asset "culturallampshade.jpg" "lighting" "cultural_lampshade.jpg"
copy_asset "Light bulb.jpg" "lighting" "edison_bulbs.jpg"
copy_asset "lighting tools.jpg" "lighting" "stage_spotlights.jpg"
copy_asset "Starrymine Wine Bottle Cork Lights Battery Operated Led Cork Shape Silver Copper Wire Colorful Fairy Mini String Lights For Diy Christmas Halloween We.jpg" "lighting" "wine_bottle_lights.jpg"

copy_asset "cultural .jpg" "cultural" "cultural_wall_decor.jpg"
copy_asset "cultular backgroud decor.jpg" "cultural" "cultural_backdrop.jpg"
copy_asset "Cultural basketss.jpg" "cultural" "cultural_baskets_1.jpg"
copy_asset "Traditional Ethiopian Basket Round Backdrop Cover - Aperturee.jpg" "cultural" "mesob_backdrop.jpg"
copy_asset "✨🌙 Amazing Ramadan gift ✨🌙.jpg" "cultural" "ramadan_lantern.jpg"

copy_asset "CBD757.jpg" "others" "modern_vase.jpg"
copy_asset "IronLab Event.jpg" "others" "iron_stand.jpg"
copy_asset "others tool(welcome).jpg" "others" "welcome_sign.jpg"
copy_asset "portable stage.jpg" "others" "portable_stage.jpg"
copy_asset "Vase_1.jpg" "others" "classic_vase.jpg"

# Copy Gallery Images
cp Images/Wedding_images/*.jpg frontend/public/images/gallery/wedding/
cp Images/Birthday_images/*.jpg frontend/public/images/gallery/birthday/
cp Images/Corporate_images/*.jpg frontend/public/images/gallery/corporate/
cp Images/Graduation_images/*.jpg frontend/public/images/gallery/graduation/
cp Images/Engagement_images/*.jpg frontend/public/images/gallery/engagement/
