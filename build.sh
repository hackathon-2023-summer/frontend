#!/bin/bash

# コンテナ内はroot権限で動作させるので、
export $(xargs < .env)
if [ -d /home/appuser/devcon/${NAME_FRONT} ]; then
  cd /home/appuser/devcon/${NAME_FRONT}
  npm install
else
  cd /home/appuser/devcon/
  npx create-next-app@12.3.4 ${NAME_FRONT} --ts --yes  
  cd /home/appuser/devcon/${NAME_FRONT}
  npm install next@12.3.4 react react-dom typescript @types/react
  npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-hook-form
  npm install @fortawesome/fontawesome-svg-core html-react-parser react-dropzone @types/dompurify dotenv dayjs dompurify
fi
chown -R appuser:appgroup /home/appuser/devcon
npm run dev
# tail -f /dev/null