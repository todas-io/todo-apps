from ninja import NinjaAPI, Schema, ModelSchema
from ninja.security import django_auth

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt


from datetime import datetime

from .models import Todo


api = NinjaAPI(title="task管理API", csrf=True)


class LoginRequest(Schema):
    username: str
    password: str
    
class UserSchema(Schema):
    username: str

class Error(Schema):
    message: str

class TodoAddRequest(Schema):
    title: str


class TodoUpdateRequest(Schema):
    id: int
    title: str
    completed: bool


class TodoSchema(ModelSchema):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'created_at', 'update_at', 'completed']

@api.get("/login", response={200: UserSchema}, auth=django_auth)
def get_user(request):
    return 200, request.auth


@api.get("/ping")
@ensure_csrf_cookie
@csrf_exempt
def ping(request):
    return HttpResponse()

@api.post("/login", response={200: UserSchema, 401: Error})
def authen(request, l: LoginRequest):
    user = authenticate(
        request=request,
        username=l.username,
        password=l.password
    )
    if not user:
        return 401, {"message": "not authenticate"}
    else:
        login(request,user)
        return 200, user


@api.get("/todo", response=list[TodoSchema], auth=django_auth)
def index(request):
    objs = Todo.objects.filter(owner=request.auth)
    return objs


@api.post("/todo", response=TodoSchema, auth=django_auth)
def add(request, t: TodoAddRequest):
    obj = Todo.objects.create(
        owner=request.auth,
        title=t.title
    )
    return obj


@api.put("/todo", response=TodoSchema, auth=django_auth)
def update(request, t: TodoUpdateRequest):
    obj = Todo.objects.filter(owner=request.auth).get(id=t.id)
    obj.title = t.title
    obj.completed = t.completed
    obj.save()
    return obj

@api.delete("/todo",  auth=django_auth)
def task_delete(request, id: int):
    obj = Todo.objects.filter(owner=request.auth).get(id=id)
    obj.delete()
    return {"id": id}

