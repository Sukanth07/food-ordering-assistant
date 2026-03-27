from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import User, Address
from backend.schemas import AddressCreate, AddressResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/address")


@router.post("/add", response_model=AddressResponse)
def add_address(
    address: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_address = Address(
        user_id=current_user.id,
        address=address.address,
        is_default=address.is_default,
    )
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address


@router.get("/user", response_model=List[AddressResponse])
def get_user_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Address).filter(Address.user_id == current_user.id).all()
