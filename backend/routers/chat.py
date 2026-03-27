from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import User, Chat, Message, MenuItem, UserPreference
from backend.schemas import MessageCreate, MessageResponse, ChatResponse
from backend.auth import get_current_user
from backend.ai_service import generate_chat_response

router = APIRouter(prefix="/chat")


@router.post("/create", response_model=ChatResponse)
def create_chat(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = Chat(user_id=current_user.id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


@router.post("/message", response_model=MessageResponse)
def send_message(
    chat_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    user_msg = Message(chat_id=chat_id, role="user", content=message.content)
    db.add(user_msg)
    db.commit()

    history = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.timestamp).all()
    messages_history = [{"role": m.role, "content": m.content} for m in history[:-1]]

    menu_items_db = db.query(MenuItem).all()
    menu_items = [
        {
            "name": item.name,
            "type": item.type,
            "spice_level": item.spice_level,
            "restaurant": item.restaurant,
            "price": item.price,
            "ingredients": item.ingredients,
        }
        for item in menu_items_db
    ]

    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    user_preferences = None
    if pref:
        user_preferences = {
            "diet_type": pref.diet_type,
            "non_veg_free_days": pref.non_veg_free_days,
            "spice_level": pref.spice_level,
            "flavor_profile": pref.flavor_profile,
            "allergies": pref.allergies,
            "dislikes": pref.dislikes,
        }

    ai_response = generate_chat_response(messages_history, message.content, menu_items, user_preferences)

    ai_msg = Message(chat_id=chat_id, role="assistant", content=ai_response)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    return ai_msg


@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.created_at.desc()).all()
    return chats


@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat
