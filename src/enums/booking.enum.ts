export enum BookingStatusEnum {
  PROCESSING = 1,
  BOOKED = 2,
  CANCELED = 3,
  PREPARING = 4,
  WAITINGCAR = 5,
  USING = 6,
  RETURNTIME = 7,
  RETURNED = 8,
  OVERTIME = 9,
}

//id 직접 넣지 말고, 바뀌어도 괜찮게 만들기, code에 맞는 필드를 추가

export enum CommissionRate {
  RATE = 0.05,
}
//module안으로 옮기기
