from backend.database import SessionLocal, engine, Base
from backend.models import MenuItem, Restaurant


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Restaurant).count() > 0:
        print("Data already seeded.")
        db.close()
        return

    restaurants = [
        Restaurant(name="Spice Route", cuisine_type="North Indian", image_url="https://placehold.co/400x250/D4451A/white?text=Spice+Route", rating=4.3, delivery_time_min=30, delivery_fee=25.0, is_veg_only=False),
        Restaurant(name="Biryani House", cuisine_type="Hyderabadi", image_url="https://placehold.co/400x250/E8A317/white?text=Biryani+House", rating=4.5, delivery_time_min=35, delivery_fee=30.0, is_veg_only=False),
        Restaurant(name="Wok This Way", cuisine_type="Chinese", image_url="https://placehold.co/400x250/C62828/white?text=Wok+This+Way", rating=4.1, delivery_time_min=25, delivery_fee=20.0, is_veg_only=False),
        Restaurant(name="Burger King", cuisine_type="Burgers", image_url="https://placehold.co/400x250/FF8C00/white?text=Burger+King", rating=3.9, delivery_time_min=20, delivery_fee=15.0, is_veg_only=False),
        Restaurant(name="Domino's", cuisine_type="Pizza", image_url="https://placehold.co/400x250/0066CC/white?text=Dominos", rating=4.0, delivery_time_min=30, delivery_fee=0.0, is_veg_only=False),
        Restaurant(name="Dosa Plaza", cuisine_type="South Indian", image_url="https://placehold.co/400x250/2E7D32/white?text=Dosa+Plaza", rating=4.4, delivery_time_min=20, delivery_fee=15.0, is_veg_only=True),
        Restaurant(name="Tandoori Nights", cuisine_type="Mughlai", image_url="https://placehold.co/400x250/8B0000/white?text=Tandoori+Nights", rating=4.2, delivery_time_min=35, delivery_fee=30.0, is_veg_only=False),
        Restaurant(name="Chai & Chaat", cuisine_type="Street Food", image_url="https://placehold.co/400x250/FF6F00/white?text=Chai+%26+Chaat", rating=4.6, delivery_time_min=15, delivery_fee=10.0, is_veg_only=True),
        Restaurant(name="The Green Bowl", cuisine_type="Healthy", image_url="https://placehold.co/400x250/388E3C/white?text=The+Green+Bowl", rating=4.3, delivery_time_min=25, delivery_fee=20.0, is_veg_only=True),
        Restaurant(name="Sweet Bengal", cuisine_type="Desserts", image_url="https://placehold.co/400x250/6A1B9A/white?text=Sweet+Bengal", rating=4.7, delivery_time_min=20, delivery_fee=15.0, is_veg_only=True),
    ]

    db.add_all(restaurants)
    db.flush()

    r = {rest.name: rest.id for rest in restaurants}

    items = [
        # Spice Route (North Indian)
        MenuItem(name="Paneer Butter Masala", type="veg", ingredients="paneer, butter, tomato, cream, cashew", spice_level="medium", restaurant="Spice Route", price=220.0, restaurant_id=r["Spice Route"], image_url="https://placehold.co/300x200/FF5A5F/white?text=Paneer+Butter+Masala", description="Rich and creamy paneer in a buttery tomato gravy", category="Main Course"),
        MenuItem(name="Chicken Tikka Masala", type="non-veg", ingredients="chicken, yogurt, tomato, cream, spices", spice_level="high", restaurant="Spice Route", price=250.0, restaurant_id=r["Spice Route"], image_url="https://placehold.co/300x200/FF5A5F/white?text=Chicken+Tikka+Masala", description="Smoky grilled chicken in a spiced tomato cream sauce", category="Main Course"),
        MenuItem(name="Dal Makhani", type="veg", ingredients="black lentils, butter, cream, tomato", spice_level="low", restaurant="Spice Route", price=180.0, restaurant_id=r["Spice Route"], image_url="https://placehold.co/300x200/FF5A5F/white?text=Dal+Makhani", description="Slow-cooked black lentils in a rich buttery gravy", category="Main Course"),

        # Biryani House
        MenuItem(name="Mutton Biryani", type="non-veg", ingredients="mutton, basmati rice, saffron, spices, onion", spice_level="high", restaurant="Biryani House", price=350.0, restaurant_id=r["Biryani House"], image_url="https://placehold.co/300x200/E8A317/white?text=Mutton+Biryani", description="Fragrant Hyderabadi dum biryani with tender mutton", category="Main Course"),
        MenuItem(name="Chicken Biryani", type="non-veg", ingredients="chicken, basmati rice, saffron, mint, spices", spice_level="medium", restaurant="Biryani House", price=280.0, restaurant_id=r["Biryani House"], image_url="https://placehold.co/300x200/E8A317/white?text=Chicken+Biryani", description="Classic dum biryani with juicy chicken pieces", category="Main Course"),
        MenuItem(name="Veg Biryani", type="veg", ingredients="mixed vegetables, basmati rice, saffron, spices", spice_level="medium", restaurant="Biryani House", price=200.0, restaurant_id=r["Biryani House"], image_url="https://placehold.co/300x200/E8A317/white?text=Veg+Biryani", description="Aromatic vegetable biryani with garden-fresh veggies", category="Main Course"),

        # Wok This Way (Chinese)
        MenuItem(name="Veg Fried Rice", type="veg", ingredients="rice, mixed vegetables, soy sauce, garlic", spice_level="medium", restaurant="Wok This Way", price=120.0, restaurant_id=r["Wok This Way"], image_url="https://placehold.co/300x200/C62828/white?text=Veg+Fried+Rice", description="Wok-tossed rice with crunchy vegetables", category="Main Course"),
        MenuItem(name="Chicken Manchurian", type="non-veg", ingredients="chicken, soy sauce, chili, garlic, ginger", spice_level="high", restaurant="Wok This Way", price=200.0, restaurant_id=r["Wok This Way"], image_url="https://placehold.co/300x200/C62828/white?text=Chicken+Manchurian", description="Crispy chicken balls in a tangy manchurian sauce", category="Starters"),
        MenuItem(name="Veg Hakka Noodles", type="veg", ingredients="noodles, vegetables, soy sauce, vinegar", spice_level="medium", restaurant="Wok This Way", price=140.0, restaurant_id=r["Wok This Way"], image_url="https://placehold.co/300x200/C62828/white?text=Hakka+Noodles", description="Stir-fried noodles with fresh vegetables", category="Main Course"),

        # Burger King
        MenuItem(name="Veg Burger", type="veg", ingredients="potato patty, lettuce, tomato, cheese, bun", spice_level="low", restaurant="Burger King", price=80.0, restaurant_id=r["Burger King"], image_url="https://placehold.co/300x200/FF8C00/white?text=Veg+Burger", description="Crispy veg patty with fresh veggies", category="Burgers"),
        MenuItem(name="Chicken Whopper", type="non-veg", ingredients="chicken patty, lettuce, tomato, mayo, bun", spice_level="low", restaurant="Burger King", price=180.0, restaurant_id=r["Burger King"], image_url="https://placehold.co/300x200/FF8C00/white?text=Chicken+Whopper", description="Flame-grilled chicken patty with fresh toppings", category="Burgers"),
        MenuItem(name="French Fries", type="veg", ingredients="potatoes, salt", spice_level="low", restaurant="Burger King", price=90.0, restaurant_id=r["Burger King"], image_url="https://placehold.co/300x200/FF8C00/white?text=French+Fries", description="Crispy golden fries, perfectly salted", category="Sides"),

        # Domino's
        MenuItem(name="Pepperoni Pizza", type="non-veg", ingredients="pepperoni, mozzarella, tomato sauce, pizza dough", spice_level="medium", restaurant="Domino's", price=450.0, restaurant_id=r["Domino's"], image_url="https://placehold.co/300x200/0066CC/white?text=Pepperoni+Pizza", description="Classic pepperoni with stretchy mozzarella", category="Pizza"),
        MenuItem(name="Margherita Pizza", type="veg", ingredients="mozzarella, tomato sauce, basil, pizza dough", spice_level="low", restaurant="Domino's", price=300.0, restaurant_id=r["Domino's"], image_url="https://placehold.co/300x200/0066CC/white?text=Margherita+Pizza", description="Simple and classic with fresh mozzarella and basil", category="Pizza"),
        MenuItem(name="Garlic Breadsticks", type="veg", ingredients="bread, garlic butter, herbs", spice_level="low", restaurant="Domino's", price=120.0, restaurant_id=r["Domino's"], image_url="https://placehold.co/300x200/0066CC/white?text=Garlic+Bread", description="Warm garlic breadsticks with herb butter", category="Sides"),

        # Dosa Plaza (South Indian, veg only)
        MenuItem(name="Masala Dosa", type="veg", ingredients="rice batter, potato filling, chutney, sambar", spice_level="medium", restaurant="Dosa Plaza", price=100.0, restaurant_id=r["Dosa Plaza"], image_url="https://placehold.co/300x200/2E7D32/white?text=Masala+Dosa", description="Crispy dosa stuffed with spiced potato filling", category="Main Course"),
        MenuItem(name="Idli Sambar", type="veg", ingredients="rice cakes, lentil sambar, coconut chutney", spice_level="low", restaurant="Dosa Plaza", price=70.0, restaurant_id=r["Dosa Plaza"], image_url="https://placehold.co/300x200/2E7D32/white?text=Idli+Sambar", description="Fluffy steamed idlis with piping hot sambar", category="Main Course"),
        MenuItem(name="Rava Uttapam", type="veg", ingredients="semolina batter, onion, tomato, green chili", spice_level="medium", restaurant="Dosa Plaza", price=110.0, restaurant_id=r["Dosa Plaza"], image_url="https://placehold.co/300x200/2E7D32/white?text=Rava+Uttapam", description="Thick semolina pancake topped with vegetables", category="Main Course"),

        # Tandoori Nights (Mughlai)
        MenuItem(name="Seekh Kebab", type="non-veg", ingredients="minced lamb, onion, spices, herbs", spice_level="medium", restaurant="Tandoori Nights", price=280.0, restaurant_id=r["Tandoori Nights"], image_url="https://placehold.co/300x200/8B0000/white?text=Seekh+Kebab", description="Succulent minced lamb kebabs from the tandoor", category="Starters"),
        MenuItem(name="Butter Naan", type="veg", ingredients="flour, butter, yogurt", spice_level="low", restaurant="Tandoori Nights", price=50.0, restaurant_id=r["Tandoori Nights"], image_url="https://placehold.co/300x200/8B0000/white?text=Butter+Naan", description="Soft tandoor-baked naan brushed with butter", category="Breads"),
        MenuItem(name="Chicken Malai Tikka", type="non-veg", ingredients="chicken, cream, cheese, cardamom", spice_level="low", restaurant="Tandoori Nights", price=300.0, restaurant_id=r["Tandoori Nights"], image_url="https://placehold.co/300x200/8B0000/white?text=Malai+Tikka", description="Creamy marinated chicken grilled to perfection", category="Starters"),

        # Chai & Chaat (Street Food, veg only)
        MenuItem(name="Pani Puri", type="veg", ingredients="semolina puri, potato, chickpeas, tamarind water", spice_level="high", restaurant="Chai & Chaat", price=60.0, restaurant_id=r["Chai & Chaat"], image_url="https://placehold.co/300x200/FF6F00/white?text=Pani+Puri", description="Crispy puris filled with spicy tangy water", category="Starters"),
        MenuItem(name="Aloo Tikki", type="veg", ingredients="potato, spices, chutney, yogurt", spice_level="medium", restaurant="Chai & Chaat", price=80.0, restaurant_id=r["Chai & Chaat"], image_url="https://placehold.co/300x200/FF6F00/white?text=Aloo+Tikki", description="Crispy spiced potato patties with chutneys", category="Starters"),
        MenuItem(name="Masala Chai", type="veg", ingredients="tea, milk, ginger, cardamom, cinnamon", spice_level="low", restaurant="Chai & Chaat", price=30.0, restaurant_id=r["Chai & Chaat"], image_url="https://placehold.co/300x200/FF6F00/white?text=Masala+Chai", description="Authentic Indian spiced tea, freshly brewed", category="Beverages"),

        # The Green Bowl (Healthy, veg only)
        MenuItem(name="Quinoa Salad Bowl", type="veg", ingredients="quinoa, avocado, cherry tomato, cucumber, lemon dressing", spice_level="low", restaurant="The Green Bowl", price=250.0, restaurant_id=r["The Green Bowl"], image_url="https://placehold.co/300x200/388E3C/white?text=Quinoa+Bowl", description="Nutritious quinoa bowl with fresh greens", category="Main Course"),
        MenuItem(name="Smoothie Bowl", type="veg", ingredients="mixed berries, banana, granola, honey", spice_level="low", restaurant="The Green Bowl", price=200.0, restaurant_id=r["The Green Bowl"], image_url="https://placehold.co/300x200/388E3C/white?text=Smoothie+Bowl", description="Thick berry smoothie topped with crunchy granola", category="Beverages"),

        # Sweet Bengal (Desserts, veg only)
        MenuItem(name="Rasgulla", type="veg", ingredients="cottage cheese, sugar syrup, rose water", spice_level="low", restaurant="Sweet Bengal", price=120.0, restaurant_id=r["Sweet Bengal"], image_url="https://placehold.co/300x200/6A1B9A/white?text=Rasgulla", description="Soft spongy cottage cheese balls in sugar syrup", category="Desserts"),
        MenuItem(name="Gulab Jamun", type="veg", ingredients="milk solids, sugar syrup, cardamom, saffron", spice_level="low", restaurant="Sweet Bengal", price=100.0, restaurant_id=r["Sweet Bengal"], image_url="https://placehold.co/300x200/6A1B9A/white?text=Gulab+Jamun", description="Golden fried milk dumplings soaked in sweet syrup", category="Desserts"),
        MenuItem(name="Mishti Doi", type="veg", ingredients="sweetened yogurt, caramelized sugar, saffron", spice_level="low", restaurant="Sweet Bengal", price=80.0, restaurant_id=r["Sweet Bengal"], image_url="https://placehold.co/300x200/6A1B9A/white?text=Mishti+Doi", description="Traditional Bengali sweetened yogurt", category="Desserts"),
    ]

    db.add_all(items)
    db.commit()
    print(f"Seeded {len(restaurants)} restaurants and {len(items)} menu items successfully.")
    db.close()


if __name__ == "__main__":
    seed()
