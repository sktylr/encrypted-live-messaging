FROM python:3.11.8

WORKDIR /api

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . /api/

RUN python manage.py collectstatic --no-input
