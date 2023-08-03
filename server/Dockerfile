FROM ubuntu:20.04

# Node.jsをインストールします
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install sudo

# コンテナ内に開放するポート。docker-compose.ymlと一致させる。
ARG PORT_FRONT
EXPOSE $PORT_FRONT

#ルート権限で操作するフォルダ /appを選択
WORKDIR /app
RUN npm install -g npm@9.8.0
RUN npm install -g json-server

# localhostでid $whoamiを実行しuidとgidの数値を事前に確認し.envファイルに転機すること。
# localhostのユーザーと同一のuid・gidのユーザーを作成。
# localhostとコンテナ内が同一ユーザー扱いとなりGitの監視が混乱しない。
ARG MY_UID
ARG MY_GID

RUN if ! grep -q ":x:$MY_GID:" /etc/group; then groupadd -g $MY_GID appgroup; fi && \
  if ! grep -q ":x:$MY_UID:" /etc/passwd; then useradd --uid $MY_UID --gid $MY_GID --create-home appuser; fi

# dockerの仕様変更なのか、コンテナはroot権限で完成させねばならなくなったのかも。
# パスワード無しでroot権限をappuserにも付与する。
RUN usermod -aG sudo appuser
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN mkdir /home/appuser/devcon 
# && chown appuser:appgroup /home/appuser/devcon
#USER appuser
WORKDIR /home/appuser/devcon
# ENTRYPOINT ["/bin/sh", "-c"]
# CMD ["tail -f /dev/null"]