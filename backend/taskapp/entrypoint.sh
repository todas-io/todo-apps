#!/bin/sh

set -e

if [ "$#" -gt "0" ]; then

    if [ "$1" = "gunicorn" ]; then
        echo "python manage.py migrate --noinput"
        python manage.py migrate --noinput
        echo "python manage.py collectstatic --noinput --clear"
        python manage.py collectstatic --noinput --clear
    fi

    echo "$@"
    exec "$@"

fi