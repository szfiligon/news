FROM node:22

# 创建一个非root用户
RUN groupadd -r myuser && useradd -r -g myuser -G audio,video myuser \
    && mkdir -p /home/myuser/Downloads \
    && chown -R myuser:myuser /home/myuser

# 安装必要的依赖项
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libglib2.0-0 \
  libnspr4 \
  libgdk-pixbuf2.0-0 \
  libgtk-3-0 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libasound2 \
  libxshmfence1 \
  libxss1 \
  libnss3 \
  libatk-bridge2.0-0 \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  libgbm1 \
  libxcomposite1 \
  libxrandr2 \
  libxdamage1 \
  libxtst6 \
  libgtk-3-0 \
  libnss3 \
  libasound2 && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# 安装Chrome（或者Chromium）
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install && \
  rm google-chrome-stable_current_amd64.deb

WORKDIR /news
COPY package*.json ./
RUN npm i

# 切换到非root用户
USER myuser

COPY . .
RUN npm rebuild
EXPOSE 3002
CMD ["node", "server.js"]
