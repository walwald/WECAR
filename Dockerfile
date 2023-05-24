# Base image
FROM node:14-alpine

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 종속성 설치
COPY package*.json ./
RUN npm install
RUN npm install webpack
RUN npm install mysql2 -save
RUN npm install typeorm -save


# 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build
# 컨테이너 실행할 명령어
CMD ["npm", "run", "start:dev"]