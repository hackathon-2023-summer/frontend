#!/bin/bash
export $(xargs < .env)
if [ -d /home/appuser/devcon/${NAME_FRONT} ]; then
  cd /home/appuser/devcon/${NAME_FRONT}
  # npm run dev
else
  # rm -rf /home/appuser/devcon/${NAME_FRONT};
  npx create-next-app@12.3.4 ${NAME_FRONT} --ts --yes
  cd /home/appuser/devcon/${NAME_FRONT}
  npm install next@12.3.4 react react-dom typescript @types/react
  npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-hook-form
fi

npm run dev
# tail -f /dev/null