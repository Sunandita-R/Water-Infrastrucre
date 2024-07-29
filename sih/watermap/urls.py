from django.urls import path

from . import views

urlpatterns = [
    path("",views.first,name="first"),
    path("log", views.index, name="index"),
    path('fun1', views.fun1, name='fun1'),
    path('pipe',views.pipe,name='pipe'),
    path('rem',views.rem,name='rem'),
    path('remmark',views.remmark,name='remmark'),
    path('login',views.login,name='login'),
    path('users/userlog',views.userlog,name='userlog'),
    path('userlog',views.userlog,name='userlog'),
    path('users/userreg',views.userreg,name='userreg'),
    path('showreg',views.showreg,name='showreg'),
    path('showlog',views.showlog,name='showlog'),
    path('showadm',views.showadm,name='showadm'),
    path('grieve',views.grieve,name="grieve"),
    path('pwd',views.pwd,name="pwd"),
    path('profile',views.profile,name="profile"),
    path('lodge',views.lodge,name='lodge'),
    path('users/lodge',views.lodge,name='lodge'),
    path('usermap',views.usermap,name='usermap'),
    path('iot',views.iot,name='iot'),
    path('admout',views.admout,name='admout'),
    path('iotvis',views.iotvis,name='iotvis'),
    path('showadmin',views.showadmin,name='showadmin'),
    path('iot/iot',views.iot,name = 'iot'),
    path('grlog',views.grlog,name='grlog'),
    path('comp',views.comp,name='comp'),
    path('userout',views.userout,name='userout'),
    path('adminout',views.adminout,name='adminout')
]