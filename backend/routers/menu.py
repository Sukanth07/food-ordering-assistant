from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import get_db
from backend.models import MenuItem, Restaurant
from backend.schemas import MenuItemResponse, RestaurantResponse

router = APIRouter(prefix="/menu")


@router.get("/items", response_model=List[MenuItemResponse])
def get_menu_items(
    type: Optional[str] = Query(None),
    spice_level: Optional[str] = Query(None),
    restaurant_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(MenuItem).filter(MenuItem.is_available == True)

    if type:
        query = query.filter(MenuItem.type == type)
    if spice_level:
        query = query.filter(MenuItem.spice_level == spice_level)
    if restaurant_id:
        query = query.filter(MenuItem.restaurant_id == restaurant_id)
    if category:
        query = query.filter(MenuItem.category == category)
    if search:
        query = query.filter(MenuItem.name.ilike(f"%{search}%"))

    return query.all()


@router.get("/restaurants", response_model=List[RestaurantResponse])
def get_restaurants(
    cuisine: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Restaurant)

    if cuisine:
        query = query.filter(Restaurant.cuisine_type.ilike(f"%{cuisine}%"))

    restaurants = query.all()
    result = []
    for r in restaurants:
        item_count = db.query(MenuItem).filter(
            MenuItem.restaurant_id == r.id,
            MenuItem.is_available == True,
        ).count()
        res = RestaurantResponse.model_validate(r)
        res.item_count = item_count
        result.append(res)
    return result


@router.get("/restaurants/{restaurant_id}/items", response_model=List[MenuItemResponse])
def get_restaurant_items(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(MenuItem)
        .filter(MenuItem.restaurant_id == restaurant_id, MenuItem.is_available == True)
        .all()
    )
