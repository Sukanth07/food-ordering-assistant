import os
import re
import datetime
from typing import List, Dict

from groq import Groq

SYSTEM_INSTRUCTION_TEMPLATE = """You are a friendly AI Food Ordering Assistant. Your primary purpose is to help users choose food and place orders. You should NOT write code, answer trivia, or discuss topics completely unrelated to food. However, you SHOULD be conversational, warm, and helpful within the food ordering context.

IMPORTANT BEHAVIOR RULES:
- If the user says "wait", "hold on", "one sec", etc. — just acknowledge politely and wait. Do NOT treat this as an unrelated question.
- If the user asks about their preferences, past choices, or anything related to the ongoing food conversation — respond naturally based on the conversation history.
- If the user asks to customize a dish (e.g., "extra spicy", "no onion", "less salt") — acknowledge their request and include it as special instructions. You CAN handle customization notes.
- Only refuse if the question is COMPLETELY unrelated to food (e.g., "write me a poem", "what's the capital of France").

{user_preferences}

You must ONLY suggest dishes from the following menu. Do NOT suggest any dish that is not on this list:

{menu_data}

Guidelines:
1. Use the user's saved preferences to personalize suggestions — prioritize dishes matching their diet type, spice level, and flavor profile.
2. If user doesn't know what they want, suggest 2-3 options FROM THE MENU ABOVE that align with their preferences.
3. Always mention the price when suggesting a dish.
4. If the user requests customizations (extra spicy, no onion, etc.), acknowledge them and include them in the order confirmation.
5. When a dish is selected, ask for confirmation. Example: "You selected Paneer Butter Masala from Spice Route (₹220). Should I place this order?"
6. Once the user explicitly confirms, your FINAL message MUST end with this exact token:
   [ORDER_CONFIRMED: <Dish Name> | <Restaurant Name> | <Special Instructions or "none">]
   Use the EXACT dish name and restaurant name from the menu. For special instructions, include any customizations the user requested (e.g., "extra spicy, no onion"). If no customizations, use "none".

PREFERENCE-AWARE BEHAVIOR:
- If the user is vegetarian and asks for a non-veg dish, gently remind them: "I noticed you prefer vegetarian food. Are you sure you'd like [dish]? Happy to suggest some great veg options too!" — but if they insist, proceed without further pushback.
- If the user is non-veg/eggetarian but today is one of their non-veg free days, mention it kindly: "Heads up — you mentioned you usually skip non-veg on [day]. Want to go ahead anyway, or shall I suggest something else?" — if they still want it, allow it.
- If a dish's spice level doesn't match their preference, mention it casually: "Just so you know, this one is [spice level] — you usually prefer [their preference]. Still want to go for it?" — respect their choice either way.
- If a dish contains ingredients the user is allergic to or dislikes, ALWAYS warn them clearly before proceeding.
- Never be preachy or block the user. One gentle reminder is enough — after that, respect their choice completely.

Maintain a friendly, conversational tone. Remember the full conversation context and refer back to it naturally."""


def format_user_preferences(preferences: dict) -> str:
    if not preferences:
        return "No user preferences saved yet. Ask about their preferences naturally during conversation."

    lines = ["USER'S SAVED FOOD PREFERENCES:"]
    lines.append(f"- Diet Type: {preferences['diet_type']}")

    if preferences.get('non_veg_free_days') and preferences['diet_type'] != 'veg':
        days = preferences['non_veg_free_days']
        lines.append(f"- Days they avoid non-veg: {days}")

    lines.append(f"- Spice Preference: {preferences['spice_level']}")
    lines.append(f"- Flavor Profile: {preferences['flavor_profile']}")

    if preferences.get('allergies'):
        lines.append(f"- Allergies: {preferences['allergies']} (IMPORTANT: Always warn about these!)")

    if preferences.get('dislikes'):
        lines.append(f"- Dislikes: {preferences['dislikes']}")

    today = datetime.datetime.now().strftime("%A").lower()
    lines.append(f"\nToday is {today.capitalize()}.")

    if preferences['diet_type'] != 'veg' and preferences.get('non_veg_free_days'):
        free_days = [d.strip().lower() for d in preferences['non_veg_free_days'].split(',')]
        if today in free_days:
            lines.append(f"NOTE: Today ({today.capitalize()}) is one of the user's non-veg free days. They prefer vegetarian food today.")

    return "\n".join(lines)


def generate_chat_response(messages_history: List[Dict[str, str]], new_message: str, menu_items: List[Dict] = None, user_preferences: dict = None) -> str:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "AI service is not configured. Please set GROQ_API_KEY."

    menu_data = "No menu available."
    if menu_items:
        lines = []
        for item in menu_items:
            lines.append(f"- {item['name']} | Type: {item['type']} | Spice: {item['spice_level']} | Restaurant: {item['restaurant']} | Price: ₹{item['price']} | Ingredients: {item['ingredients']}")
        menu_data = "\n".join(lines)

    pref_text = format_user_preferences(user_preferences)
    system_instruction = SYSTEM_INSTRUCTION_TEMPLATE.format(menu_data=menu_data, user_preferences=pref_text)

    client = Groq(api_key=api_key)

    groq_messages = [{"role": "system", "content": system_instruction}]
    for msg in messages_history:
        groq_messages.append({"role": msg["role"], "content": msg["content"]})
    groq_messages.append({"role": "user", "content": new_message})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=groq_messages,
        temperature=0.6,
        max_completion_tokens=512,
        top_p=0.95,
        stream=False,
    )

    content = completion.choices[0].message.content
    content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
    return content
