# 프로젝트 소개
Sk planet 실내위치 인식팀의 디비 서버 연동을 위한 코드 데이터

## 프로젝트 관리

프로젝트를 관리하기 위하여 알아야 하는 점

### `프로젝트 실행`

*npm run dev* 을 이용하면 프로젝트를 개발 모드로 실행할 수 있음
prod 모드는 아직 구현하지 않음 ( 실제 배포를 진행할 때 개발모드를 prod모드와 변환 할 것 )

### `sequelize sync 관련`

app.js 폴더에 주석처리 되어 있는 sequlize.sync()는 디비 스키마 구조에 변화가 있을 경우 주석 해제
이 부분을 따로 스크립트 파일로 변경할 예정

### `REST API 관련`

현재 ADD 기능 구현 완료 ( POST man 을 이용하여 테스트 가능 )
POST man 에서 x-www-form-urlencoded 을 이용하여 테스트 진행