from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class Task(Base):
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(ForeignKey("user.id"), nullable=False)
    
    owner = relationship("User", backref="tasks")
