#!/usr/bin/env bash

function guess_runfiles() {
    if [ -d ${BASH_SOURCE[0]}.runfiles ]; then
        # Runfiles are adjacent to the current script.
        echo "$( cd ${BASH_SOURCE[0]}.runfiles && pwd )"
    else
        # The current script is within some other script's runfiles.
        mydir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
        echo $mydir | sed -e 's|\(.*\.runfiles\)/.*|\1|'
    fi
}

RUNFILES=$(guess_runfiles)

{UPLOADER} \
  -info-file "{INFO_FILE}" \
  -version-file "{VERSION_FILE}" \
  -bucket "{BUCKET}" \
  -key-prefix "{KEY_PREFIX}" \
  {UPLOADER_ARGS}
