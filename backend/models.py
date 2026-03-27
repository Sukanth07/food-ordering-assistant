from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    addresses = relationship("Address", back_populates="user")
    chats = relationship("Chat", back_populates="user")
    orders = relationship("Order", back_populates="user")
    preferences = relationship("UserPreference", back_populates="user", uselist=False)


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address = Column(Text, nullable=False)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", order_by="Message.timestamp")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    chat = relationship("Chat", back_populates="messages")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=True)
    restaurant = Column(String, nullable=False)
    dish = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="orders")
    chat = relationship("Chat")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    cuisine_type = Column(String, nullable=False)
    image_url = Column(String)
    rating = Column(Float, default=4.0)
    delivery_time_min = Column(Integer, default=30)
    delivery_fee = Column(Float, default=30.0)
    is_veg_only = Column(Boolean, default=False)

    menu_items = relationship("MenuItem", back_populates="restaurant_rel")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    diet_type = Column(String, nullable=False, default="veg")  # veg, non-veg, eggetarian
    non_veg_free_days = Column(Text, default="")  # comma-separated: monday,tuesday,...
    spice_level = Column(String, default="medium")  # mild, medium, spicy, extra-spicy
    flavor_profile = Column(String, default="savory")  # sweet, savory, sour, balanced
    allergies = Column(Text, default="")  # comma-separated: dairy,nuts,gluten,...
    dislikes = Column(Text, default="")  # free text: specific dislikes
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="preferences")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    ingredients = Column(Text)
    spice_level = Column(String)
    restaurant = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    image_url = Column(String)
    description = Column(Text)
    category = Column(String)
    is_available = Column(Boolean, default=True)

    restaurant_rel = relationship("Restaurant", back_populates="menu_items")
