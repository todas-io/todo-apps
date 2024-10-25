# for build
FROM python:3.12-bookworm as builder

WORKDIR /app

COPY ./requirements.lock /app
COPY ./pyproject.toml /app

RUN python -m pip install --no-cache-dir --upgrade pip gunicorn uvicorn

RUN sed '/-e/d' requirements.lock > requirements.txt
RUN sed -i 's/requires = \["hatchling"\]/requires = \["setuptools", "setuptools-scm"\]/; s/build-backend = "hatchling.build"/build-backend = "setuptools.build_meta"/' pyproject.toml
RUN sed -i '/\[tool\.hatch\.metadata\]/d; /allow-direct-references = true/d' pyproject.toml

RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt
RUN pip install .

#  for production
FROM python:3.12-slim-bookworm

# 環境変数
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリ
WORKDIR /app

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
	procps \
    libpq5 \
	vim \
    iputils-ping \
    && apt-get -y clean && rm -rf /var/lib/apt/lists/* 


# コピー
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn
COPY --from=builder /usr/local/bin/gunicorn /usr/local/bin/gunicorn

# ユーザ
RUN groupadd -g 1000 user && useradd -m -s /bin/bash -u 1000 -g 1000 user

# アプリ配置
COPY . /app
RUN mkdir -p /app/taskapp/static && chown -R user:user /app/taskapp/static
RUN chmod a+x /app/taskapp/entrypoint.sh

# ポート
EXPOSE 8000/tcp

# 実行
USER user

# 作業ディレクトリ
WORKDIR /app/taskapp

ENTRYPOINT ["/app/taskapp/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]