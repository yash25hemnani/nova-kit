#!/bin/bash

NAME=""
SINGULAR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --page)
      NAME="$2"
      shift 2
      ;;
    --singular)
      SINGULAR="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --page <page-name> [--singular <singular-name>]"
      exit 1
      ;;
  esac
done

if [[ -z "$NAME" ]]; then
  echo "Usage: $0 --page <page-name> [--singular <singular-name>]"
  exit 1
fi

SINGULAR="${SINGULAR:-$NAME}"

NAME_CAMEL=$(echo "$NAME" | sed 's/-\([a-z]\)/\U\1/g')
NAME_CAP="${NAME_CAMEL^}"

SINGULAR_CAMEL=$(echo "$SINGULAR" | sed 's/-\([a-z]\)/\U\1/g')
SINGULAR_CAP="${SINGULAR_CAMEL^}"

echo "Creating page: $NAME"
echo "Using singular: $SINGULAR"

BASE_DIR="src/pages/$NAME"

mkdir -p "$BASE_DIR"/{components,columns,dialogs,forms,queries,schemas,tables,types}

touch "$BASE_DIR/All${NAME_CAP}.tsx"
touch "$BASE_DIR/columns/get${NAME_CAP}TableColumns.tsx"
touch "$BASE_DIR/dialogs/CreateEdit${SINGULAR_CAP}Dialog.tsx"
touch "$BASE_DIR/forms/CreateEdit${SINGULAR_CAP}Form.tsx"
touch "$BASE_DIR/queries/${NAME}.queries.ts"
touch "$BASE_DIR/queries/${NAME}.mutations.ts"
touch "$BASE_DIR/schemas/createEdit${SINGULAR_CAP}Schema.ts"
touch "$BASE_DIR/tables/${NAME_CAP}Table.tsx"
touch "$BASE_DIR/types/${SINGULAR}.types.ts"

echo "Created $BASE_DIR"