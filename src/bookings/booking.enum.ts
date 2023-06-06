export enum BookingStatusEnum {
  PROCESSING = '예약 진행 중',
  BOOKED = '예약 완료',
  CANCELED = '예약 취소',
  PREPARING = '픽업 준비 중',
  WAITINGCAR = '픽업 대기',
  USING = '사용 중',
  RETURNTIME = '반납 대기',
  RETURNED = '반납 완료',
  OVERTIME = '반납 요청',
}

export enum CommissionEnum {
  RATE = 0.05,
}
