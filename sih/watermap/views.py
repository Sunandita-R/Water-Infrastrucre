from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from watermap.models import component
from .models import SensorData
import psycopg2
content={}
# Connect to the PostgreSQL database
conn = psycopg2.connect(
    database="map",
    user="postgres",
    password="1234",
    host="localhost",
    port="5432"
)

# Create a cursor
cursor = conn.cursor()
def index(request):
    cursor.execute('Select * from component')
    l=cursor.fetchall()
    json_data = json.dumps(l)
    cursor.execute('Select * from pipe')
    p=cursor.fetchall()
    pd=json.dumps(p)
    context = {
    'lis': json_data,
    'p':pd
}
    return render(request,'index.html',context)


def fun1(request):
    if request.method == 'POST':
        # Extract the JavaScript variable value from the request
        startCoords = json.loads(request.body).get('startCoordinates')
        endCoords=json.loads(request.body).get('endCoordinates')
        icon=json.loads(request.body).get('iconUrl')
        name=json.loads(request.body).get('compname')
        id=json.loads(request.body).get('id')
        latitude=json.loads(request.body).get('latitude')
        longitude=json.loads(request.body).get('longitude')
        val=(id,name,icon,latitude,longitude)
        print(val)
        query='insert into component(id,name,icon,latitude,longtitude) values (%s,%s,%s,%s,%s);'
        val=(id,name,icon,latitude,longitude)
        cursor.execute(query,val)
        conn.commit()
        print("success")
        
        # Use the JavaScript variable value as needed
        # For demonstration, we'll just echo it back
        
        return render(request,'index.html')
   

def pipe(request):
    if request.method == 'POST':
        print("hii")
        # Extract the JavaScript variable value from the request
        startlat = json.loads(request.body).get('startlat')
        endlat=json.loads(request.body).get('endlat')
        startlng = json.loads(request.body).get('startlng')
        endlng=json.loads(request.body).get('endlng')
        query='insert into pipe(stlat,stlng,endlat,endlng) values (%s,%s,%s,%s);'
        val=(startlat,startlng,endlat,endlng)
        cursor.execute(query,val)
        conn.commit()
        cursor.execute('select max(id) from pipe')
        max=cursor.fetchall()
        m=int(max[0][0])
        return render(request,'index.html',{'max':m})

def rem(request):
    if request.method == 'POST':
        pipid = json.loads(request.body).get('pipid')
        query='delete from pipe where id=%s'
        val = (pipid,)
        print("Query:", cursor.mogrify(query, val).decode('utf-8'))
        cursor.execute(query,val)
        conn.commit()
        return render(request,'index.html')
    
def remmark(request):
        if request.method == 'POST':
            pipid = json.loads(request.body).get('pipid')
            query='delete from component where id=%s'
            val = (pipid,)
            print("Query:", cursor.mogrify(query, val).decode('utf-8'))
            cursor.execute(query,val)
            conn.commit()
            return render(request,'index.html')
def first(request):
    return render(request,'home.html')
def login(request):
    username = request.POST["username"]
    password = request.POST["password"]

    query="select email,password from admindetails"
    cursor.execute(query)
    conn.commit()

    l=cursor.fetchall()
    for i in l:
        if(i[0]==username and i[1]==password):
            print("Success!")
            cursor.execute('Select * from component')
            l=cursor.fetchall()
            json_data = json.dumps(l)
            cursor.execute('Select * from pipe')
            p=cursor.fetchall()
            pd=json.dumps(p)
            context = {
            'lis': json_data,
            'p':pd
        }

            return render(request, 'index.html',context)
def userlog(request):
    username = request.POST["username"]
    password = request.POST["password"]

    query="select email,password from userreg"
    cursor.execute(query)
    conn.commit()

    l=cursor.fetchall()
    for i in l:
        if(i[0]==username and i[1]==password):
            print("Success!")
            query='select fullname from userreg where email=%s'
            val=(username,)
            cursor.execute(query,val)
            fn=cursor.fetchall()
            na=fn[0][0]
            print(na)
            cursor.execute("select count(status) from complaint where complainee=%s and status='Not processed'",(username,))
            fn=cursor.fetchall()
            np=fn[0][0]
            cursor.execute("select count(status) from complaint where complainee=%s and status='Processing'",(username,))
            fn=cursor.fetchall()
            ip=fn[0][0]
            cursor.execute("select count(status) from complaint where complainee=%s and status='Not processed'",(username,))
            fn=cursor.fetchall()
            cc=fn[0][0]
            context={'fn':na,'np':np,'ip':ip,'cc':cc}
            return render(request,'users\dashboard.html',context)
    return render(request,'users\index.html')

def userreg(request):
    username = request.POST['email']
    password = request.POST['password']
    fullname=request.POST['fullname']
    contactno=request.POST['contactno']
    query='insert into userreg (fullname,email,password,contact) values (%s,%s,%s,%s)'
    val=(fullname,username,password,contactno,)
    cursor.execute(query,val)
    conn.commit()
    return render(request,'users/index.html')

def showreg(request):
    return render(request,'users/registration.html')

def showlog(request):
    return render(request,'users/index.html')
def showadm(request):
    return render(request,'admin/index.html')
def grieve(request):
    return render(request,'index/index.html')
def pwd(request):
    return render(request,'users/change-password.html')
def profile(request):
    return render(request,'users/profile.html')
def lodge(request):
    print(content)
    return render(request,'users/register-complaint.html',content)
def get_sensor_data(request):
    # Retrieve sensor data from the database
    
    cursor.execute("SELECT * FROM sensor_data")
    l = cursor.fetchall()
    v =[]
    for i in l:
           sensor_data = SensorData()
           sensor_data.id = i[0]
           sensor_data.location=i[1]
           sensor_data.status = i[2]
           v.append(sensor_data)
    return render(request, "index.html",{"list": v})
def usermap(request):
    cursor.execute('Select * from component')
    l=cursor.fetchall()
    json_data = json.dumps(l)
    cursor.execute('Select * from pipe')
    p=cursor.fetchall()
    pd=json.dumps(p)
    context = {
    'lis': json_data,
    'p':pd
}
    return render(request,"map-user/index.html",context)
def iot(request):
    return render(request,"iot page/index.html")
def admout(request):
    cursor.execute('Select * from component')
    l=cursor.fetchall()
    json_data = json.dumps(l)
    cursor.execute('Select * from pipe')
    p=cursor.fetchall()
    pd=json.dumps(p)
    context = {
    'lis': json_data,
    'p':pd
}
    return render(request,"map-user/index.html",context)
    
def iotvis(request):
    return render(request,"iotindex.html")


def showadmin(request):
    return render(request, "map-user/admin.html")

def grlog(request):
    username = request.POST["username"]
    password = request.POST["password"]

    query="select email,password from admindetails"
    cursor.execute(query)
    conn.commit()

    l=cursor.fetchall()
    for i in l:
        if(i[0]==username and i[1]==password):
            return render(request,'admin/complaint-details.html')
        
def comp(request):
    username = request.POST["cname"]
    password = request.POST["addr"]
    details=request.POST["complaindetails"]
    query="insert into complaint (complainee,des,status,address) values (%s,%s,'Not Processed',%s)"
    val=(username,details,password)
    cursor.execute(query,val)
    conn.commit()
    return render(request,'users/dashboard.html')

def userout(request):
    return render(request,'home.html')
def adminout(request):
    return render(request,'home.html')