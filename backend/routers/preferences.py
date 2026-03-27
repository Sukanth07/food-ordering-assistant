from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, UserPreference
from backend.schemas import PreferenceCreate, PreferenceResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/preferences")


@router.get("/me", response_model=PreferenceResponse)
def get_my_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not set")
    return pref


@router.post("/save", response_model=PreferenceResponse)
def save_preferences(
    data: PreferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if pref:
        pref.diet_type = data.diet_type
        pref.non_veg_free_days = data.non_veg_free_days
        pref.spice_level = data.spice_level
        pref.flavor_profile = data.flavor_profile
        pref.allergies = data.allergies
        pref.dislikes = data.dislikes
    else:
        pref = UserPreference(
            user_id=current_user.id,
            diet_type=data.diet_type,
            non_veg_free_days=data.non_veg_free_days,
            spice_level=data.spice_level,
            flavor_profile=data.flavor_profile,
            allergies=data.allergies,
            dislikes=data.dislikes,
        )
        db.add(pref)
    db.commit()
    db.refresh(pref)
    return pref


@router.get("/has-preferences")
def has_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    return {"has_preferences": pref is not None}
