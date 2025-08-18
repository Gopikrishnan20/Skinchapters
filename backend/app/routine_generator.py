def generate_routine(skin_type, conditions):
    routine = {
        "morning": [],
        "night": []
    }

    if skin_type == "dry":
        routine["morning"] = [
            "Gentle hydrating cleanser",
            "Hydrating toner",
            "Hyaluronic acid serum",
            "Moisturizer with ceramides",
            "Broad-spectrum SPF 30+ sunscreen"
        ]
        routine["night"] = [
            "Gentle cleanser",
            "Moisturizing toner",
            "Rich night cream",
            "Facial oil with squalane"
        ]

    elif skin_type == "oily":
        routine["morning"] = [
            "Foaming or gel cleanser",
            "Balancing toner",
            "Niacinamide serum",
            "Oil-free moisturizer",
            "Mattifying sunscreen"
        ]
        routine["night"] = [
            "Salicylic acid cleanser",
            "Exfoliating toner",
            "Light gel moisturizer",
            "Retinol serum (2-3x/week)"
        ]

    elif skin_type == "combination":
        routine["morning"] = [
            "Gentle gel cleanser",
            "Balancing toner",
            "Hydrating serum",
            "Light moisturizer",
            "Broad-spectrum SPF 30+ sunscreen"
        ]
        routine["night"] = [
            "Mild cleanser",
            "Hydrating mist",
            "Gel-cream hybrid moisturizer",
            "Niacinamide or BHA serum"
        ]

    # Adjust for conditions
    if "acne" in conditions:
        routine["night"].insert(1, "Acne treatment (benzoyl peroxide or salicylic acid)")
    if "blackheads" in conditions:
        routine["night"].insert(1, "Clay mask or BHA treatment (2x/week)")
    if "wrinkles" in conditions:
        routine["night"].append("Anti-aging serum with peptides or retinol")

    return routine