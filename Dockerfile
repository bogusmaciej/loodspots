ARG PYTHON_VERSION=3.10.12
FROM python:${PYTHON_VERSION}-slim as base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=1000
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser


# --mount=type=cache,target=/root/.cache/pip \
# --mount=type=bind,source=requirements.txt,target=requirements.txt \

COPY . .

RUN chown -R appuser:appuser /app
RUN chown -R appuser:appuser /app/website/static/data

EXPOSE 8000

RUN python -m pip install -r requirements.txt

USER appuser

CMD gunicorn --bind 0.0.0.0:8000 wsgi:app
