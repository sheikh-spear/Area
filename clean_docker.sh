#!/bin/sh
docker system prune
docker system prune --volumes
docker-compose up --build
