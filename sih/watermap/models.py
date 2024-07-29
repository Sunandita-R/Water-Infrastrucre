from django.db import models

# Create your models here.
class component(models.Model):
    img=models.ImageField( upload_to='pics')
    name=models.CharField(max_length=100)
    id=models.CharField(max_length=100,primary_key=True)
    lat=models.CharField(max_length=100)
    long=models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
class complaint:
    complaintno:int
    complainant:str
    regdate:str
    address:str
    details:str
    status:str
    remark:str
    remarkdate:str

    
class SensorData():
    id = int
    location : str
    status : str
