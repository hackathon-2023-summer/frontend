#!/bin/bash
export $(xargs < .env)
if [ -d /home/appuser/devcon/${NAME_FRONT} ]; then
  cd /home/appuser/devcon/${NAME_FRONT}
  sudo -i -u root bash -c 'cd /home/appuser/devcon/'${NAME_FRONT}' && npm install'
else
  cd /home/appuser/devcon/
  sudo npx create-next-app@12.3.4 ${NAME_FRONT} --ts --yes  
  cd /home/appuser/devcon/${NAME_FRONT}
  sudo npm install next@12.3.4 react react-dom typescript @types/react
  sudo npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-hook-form
  sudo chown appuser:appgroup -R /home/appuser/devcon
fi

cd /home/appuser/devcon/${NAME_FRONT}
sudo npm run dev
# tail -f /dev/null