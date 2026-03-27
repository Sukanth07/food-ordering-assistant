from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class AddressCreate(BaseModel):
    address: str
    is_default: bool = False


class AddressResponse(BaseModel):
    id: int
    user_id: int
    address: str
    is_default: bool

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    role: str
    content: str


class MessageResponse(BaseModel):
    id: int
    chat_id: int
    role: str
    content: str
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    restaurant: str
    dish: str
    address: str


class OrderResponse(BaseModel):
    id: int
    user_id: int
    restaurant: str
    dish: str
    address: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PreferenceCreate(BaseModel):
    diet_type: str  # veg, non-veg, eggetarian
    non_veg_free_days: str = ""  # comma-separated days
    spice_level: str = "medium"
    flavor_profile: str = "savory"
    allergies: str = ""
    dislikes: str = ""


class PreferenceResponse(BaseModel):
    id: int
    user_id: int
    diet_type: str
    non_veg_free_days: str
    spice_level: str
    flavor_profile: str
    allergies: str
    dislikes: str

    class Config:
        from_attributes = True


class MenuItemResponse(BaseModel):
    id: int
    name: str
    type: str
    ingredients: Optional[str] = None
    spice_level: Optional[str] = None
    restaurant: str
    price: float
    restaurant_id: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    is_available: bool = True

    class Config:
        from_attributes = True


class RestaurantResponse(BaseModel):
    id: int
    name: str
    cuisine_type: str
    image_url: Optional[str] = None
    rating: float
    delivery_time_min: int
    delivery_fee: float
    is_veg_only: bool
    item_count: Optional[int] = None

    class Config:
        from_attributes = True


class RestaurantWithMenuResponse(RestaurantResponse):
    menu_items: List[MenuItemResponse] = []
