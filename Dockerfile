ARG PYTHON_VERSION=3.10.12
FROM python:${PYTHON_VERSION}-slim as base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt
    chown -R appuser:appuser /app

COPY . .

RUN chmod -c 777 /app/website/static/data/loodspots_deleted.txt
USER appuser

EXPOSE 8000

CMD gunicorn --bind 0.0.0.0:8000 wsgi:app
