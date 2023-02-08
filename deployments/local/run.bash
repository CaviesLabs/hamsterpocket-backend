#!/bin/bash

set -euo pipefail

FLAG_START=${FLAG_START:-"true"}
FLAG_SERVICES=${FLAG_SERVICES:-""}
FLAG_DELETE=${FLAG_DELETE:-"false"}
FLAG_LOGS=${FLAG_LOGS:-""}
FLAG_RAW=()

COMPOSE_FILE="deployments/local/docker-compose.yml"
# PROJECT="beersup"

# process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d | --delete)
      FLAG_DELETE="true"
      # Override other flags
      FLAG_START="false"
      FLAG_SERVICES=""
      FLAG_LOGS=""
    shift 1
    ;;
    -s | --services)
      FLAG_SERVICES=$2
      # Override other flags
      FLAG_START="false"
    shift 2
    ;;
    -l | --logs)
      FLAG_LOGS=$2
      # Override other flags
      FLAG_START="false"
    shift 2
    ;;
    # Stop parsing commands from here
    --)
      shift 1
      FLAG_RAW=("$@")
      break
      ;;
    *)
      echo "Unrecognized argument: $1"
  esac
done

readonly FLAG_SERVICES
readonly FLAG_RAW

export DOCKER_BUILDKIT=0

function start_cluster() {
  docker compose -f $COMPOSE_FILE --project-directory $PWD build
  docker compose -f $COMPOSE_FILE --project-directory $PWD up --detach --timeout 600
  echo "Finish deployment for Local"
  docker compose -f $COMPOSE_FILE ps
}

function delete_cluster() {
  docker compose -f $COMPOSE_FILE down
  echo "Finish delete all services"
}

function restart_services() {
  docker compose -f $COMPOSE_FILE --project-directory $PWD build $FLAG_SERVICES
  docker compose -f $COMPOSE_FILE --project-directory $PWD up --detach $FLAG_SERVICES
  echo "Finish restart for ${FLAG_SERVICES}"
  docker compose -f $COMPOSE_FILE ps
}

function cluster_logs(){
  docker compose -f $COMPOSE_FILE logs $FLAG_LOGS
}

if [[ "$FLAG_START" == "true" ]]; then
  start_cluster
fi

if [[ "$FLAG_DELETE" == "true" ]]; then
  delete_cluster
fi

if [[ -n "$FLAG_SERVICES" ]]; then
  restart_services
fi

if [[ -n "$FLAG_LOGS" ]]; then
  cluster_logs
fi
