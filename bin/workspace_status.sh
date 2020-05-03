#!/bin/bash

echo "PROJECT_ID ${GOOGLE_PROJECT}"
echo "GIT_COMMIT_SHA $(git rev-parse HEAD)"
echo "FUNCTION_BUCKET ${LAMBDA_BUCKET:-courier-staging-handlers}"
