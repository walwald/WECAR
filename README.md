# 📍WECAR - Backend

c2c 공간 대여 중계 플랫폼 Airbnb를 모델링하여, c2c 차량 대여 중계 플랫폼 WECAR 웹사이트 제작<br>

> *짧은 프로젝트 기간동안 개발에 집중해야 하므로 디자인/기획 부분만 클론했습니다.<br>
개발은 초기 세팅부터 전부 직접 구현했으며, 아래 데모 영상에서 보이는 부분은 모두 백앤드와 연결하여 실제 사용할 수 있는 서비스 수준으로 개발한 것입니다.*
<br>

## 1. 프로젝트 기간 & 인원
* 프로젝트 기간: 3주 (2023.05.12 ~ 2023.06.02)   
* 개발 인원:  
  `Frontend`: 김영운 <br>
  `Backend`: 장다희 <br>
* [프론트엔드 Github 저장소](https://github.com/KIMYOUNGWOON/44-3rd-wecar.git)
* 모델링한 사이트: [Airbnb](https://www.airbnb.co.kr/)
<br>

## 2. 사용 기술

* **Backend** <br>
TypeScript 4.7 <br>
NestJS v9<br>
TypeOrm 0.3<br>
MySql 5.7<br>
Rest <br>
Prettier <br>
Docker <br>
AWS <br>
<br>

* **협업** <br>
Git & Git hub <br>
Trello <br>
Postman <br>
Slack <br>
Notion <br>
<br>


 ## 3. [ERD](https://dbdiagram.io/d/645ca847dca9fb07c4e4dd14)
 일반 user, host, 차량 모델, 등록 차량(host car), 예약, 결제를 중점적으로 ERD를 설계하였습니다. <br><br>
 ![WECAR](https://github.com/walwald/WECAR/assets/120387100/5bddd524-366a-4fc4-9a58-f32210aec9be)

<br>
<br>
 
 ## 4. 핵심 기능
  WECAR 서비스의 핵심은 차량 대여 중계입니다.<br>
  호스트는 자신의 차량을 등록하여 예약을 받고, 일반 유저는 대여할 차량을 선택해 예약하고 결제합니다.<br>
  페이지를 관리하는 admin 기능으로 차량 브랜드, 모델, 옵션 등을 신규 등록하는 기능이 있습니다. <br>
    
<details>
<summary>핵심 기능 설명 펼치기</summary>
<div markdown="1">

  <br>   
  
  **1. 회원가입/로그인**
  - 일반 유저와 호스트를 구별하여 회원가입/로그인 되도록 구현했습니다.
  - 사용자 정보에 있어 공통된 property는 BaseUser로 작성하여 호스트와 일반 유저가 extends 하도록 했습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/users/entities/base-user.entity.ts#L5)
  - 비밀번호 암호화, 로그인 시 비밀번호 확인과 같은 기본적인 기능을 BaseUser의 메서드로 작성하여, 추후 다른 유형의 유저가 추가되더라도 코드의 중복 없이 사용가능하도록 하였습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/61706973829c77ffc0211e8d130e1977f282bbb9/src/users/entities/base-user.entity.ts#L33)<br><br>

  **2. 로그인 history 기록** 📌[user](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/users/users.service.ts#L67), [host](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/hosts/hosts.service.ts#L72) 코드 확인
  - 보안 강화 측면에서 일반 유저와 호스트가 로그인 할 때마다 ip, agent, 시간이 기록되어 history를 남기도록 했습니다.<br><br>

  **3. Token Refresh** 📌[user](https://github.com/walwald/WECAR/blob/d9c8c0d7b349d3e5714ac3eec7b5f3841697f15d/src/users/users.service.ts#L77), [host](https://github.com/walwald/WECAR/blob/d9c8c0d7b349d3e5714ac3eec7b5f3841697f15d/src/hosts/hosts.service.ts#L83) 코드 확인
  - 보안 강화를 위하여 access token의 만료시간을 상대적으로 짧게 설정하여 access token 만료 시 refresh token으로 인증하여 새 token을 발급받도록 구현했습니다.<br><br>

  **4. 차량/옵션 등록** 📌[모델 등록](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/cars.service.ts#L48), [옵션 등록](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/cars.service.ts#L134) 코드 확인
  - WECAR의 페이지 관리자가 사용하는 차량 모델 신규 등록, 차량 옵션 선택지 등록 기능을 구현했습니다.<br><br>

  **5. 호스트 차량 등록** 📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/cars.service.ts#L176)
  - 호스트가 차량을 등록하는 API로, nested Dto를 활용하여 필수 정보가 모두 입력되어야 차량이 등록되도록 했습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/dto/car-register.dto.ts#L6)
  - 차량 등록 과정에서 사진 파일 업데이트는 AWS의 S3를 활용하여, 서버에서 signed url을 생성하여 client에게 보내 client가 해당 url로 파일을 업로드하는 방식을 택했습니다.📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/utils/aws.service.ts#L15)
  - 파일 업로드를 마치면 client가 파일 업로드가 완료된 url을 해당 차량 정보와 함께 차량 등록시 body로 전송하도록 하였습니다.<br><br>
  
  **6. 호스트 차량 리스트 (필터/검색)** 📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/cars.service.ts#L241)
  - 예약 가능한 host car 리스트를 제공하는 API로, query parameter를 통해 필터 조건과 pagenation을 위한 page number를 전달 받습니다.
  - 적용될 수 있는 필터에는 '주소', '예약 시작 날짜와 종료 날짜', '최소 탑승 인원', '브랜드', '배기량', '차량 유형', '연료 유형', '일일 최소 대여료', '일일 최대 대여료', '탑승 정원', '차량 옵션'이 있으며, 모두 동시에 적용 가능합니다.
  - pagenation을 별도의 함수로 작성하여 관리가 쉽고 재사용될 수 있도록 하였습니다. 📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/utils/utils.service.ts#L38)
  - 필터 적용 조건에 따른 데이터의 개수를 total count로 전달하여 client 측 pagenation이 용이하게 하였습니다.<br><br>
  
  **7. 호스트 차량 상세 정보** 📌[코드 확인](https://github.com/walwald/WECAR/blob/79f83c50a39af7d885bf06ae04bf1094630031d7/src/cars/cars.service.ts#L369)
  - 호스트 차량의 상세 정보를 조회하는 기능입니다.
  - 해당 차량의 예약 내역 날짜도 함께 전달하여, client가 이미 예약된 날짜를 예약 불가능한 것으로 표시하고, 예약 가능한 날짜를 user에게 보여줄 수 있도록 하였습니다.<br><br>
  
  **9. 예약** 📌[코드 확인](https://github.com/walwald/WECAR/blob/d9c8c0d7b349d3e5714ac3eec7b5f3841697f15d/src/bookings/bookings.service.ts#L39)
  - user가 예약을 생성하는 기능으로, 해당 호스트 차량의 기존 예약과 날짜가 겹칠 경우 에러를 반환하여 동일한 날짜에 중복으로 예약되지 않도록 예외처리 하였습니다.
  - client 측에서 계산한 수수료를 body로 전달 받으나, 서버에서 계산한 수수료 값이 다를 경우 에러를 반환합니다. 수수료율이 변경 되었을 때 시간차로 인해 변경된 수수료율이 반영되지 못하고 요청이 넘어오는 상황을 고려하였습니다.<br><br>
  
  **10. 결제**<br>
  - **10.1 결제 생성** 📌[코드 확인](https://github.com/walwald/WECAR/blob/d9c8c0d7b349d3e5714ac3eec7b5f3841697f15d/src/payments/payments.service.ts#L42)
    - 예약 uuid와 결제 수단을 body로 전달 받아 결제 내역을 생성하는 기능으로, 유효하지 않은 예약 uuid인 경우 에러를 반환합니다.
    - 해당 예약 건에 대해 이미 결제 내역이 생성된 경우 해당 결제 내역을 반환합니다.
    - 생성 시 결제 상태는 '결제 대기'입니다.<br><br>
  - **10.2 Toss 결제 승인 및 결제 완료** 📌[코드 확인](https://github.com/walwald/WECAR/blob/d9c8c0d7b349d3e5714ac3eec7b5f3841697f15d/src/payments/payments.service.ts#L71)
    - Toss 결제 API를 사용하였습니다.
    - client 측에서 toss 결제 API를 사용하여 1차적으로 결제를 완료하면, 서버에서 secret key를 사용하여 결제 승인 요청을 toss측에 요청하여 결제를 마무리합니다.
    - 결제 완료와 함께 예약 상태를 '예약 완료', 결제 상태롤 '결제 완료'로 업데이트 합니다.
    - toss로부터 응답받은 데이터는 필요한 정보만 데이터베이스에 저장합니다.
    - 모든 과정은 transaction 처리하여 에러 발생 시 rollback 되도록 하였고, toss 승인 요청 이후 에러가 발생할 경우 승인 취소 요청을 보내도록 하였습니다.<br><br>

    
  **11. 호스트 차량/예약 상태 업데이트 scheduler** 📌[코드 확인](https://github.com/walwald/WECAR/blob/6acfc21ad484b14f493bedc7da852b57fceb3a4e/src/utils/scheduler.service.ts#L11)
  - 호스트 차량의 예약 가능 날짜와, 대여 예약 날짜에 따라 상태가 업데이트되는 scheduler 기능을 구현했습니다.
  - 호스트 차량의 예약 가능 기간 중 마짐막 날이 지나면 상태가 대여 불가인 'false'로 업데이트됩니다.
  - 대여 종료일이 지나면 예약 상태가 '반납 대기'로 업데이트됩니다.
  <br><br>
  
  **12. 예약/결제 log 기록 subscriber** 📌[예약](https://github.com/walwald/WECAR/blob/6acfc21ad484b14f493bedc7da852b57fceb3a4e/src/bookings/booking.subscriber.ts#L8), [결제](https://github.com/walwald/WECAR/blob/6acfc21ad484b14f493bedc7da852b57fceb3a4e/src/payments/payment.subscriber.ts#L8) 코드 확인
  - 예약 또는 결제의 상태가 업데이트될 때마다 id, 상태, 시간에 대한 log를 남기는 subscrbier 기능을 구현했습니다.
  <br>
  
  ---
  
  <br>
</div>
</details>
  
  - [Postman](https://documenter.getpostman.com/view/26388948/2s93eeQUpz): 프로젝트 진행 시 Postman의 Documentation을 활용하여 프론트엔드와 소통하였습니다. <br>
 client가 사용한 모든 API를 Postman에서 확인할 수 있습니다.<br><br>
<br>

 ## 5. 핵심 트러블 슈팅
 #### 1. 호스트 차량 리스트 날짜 필터 query문
  - user가 '시작 날짜'와 '종료 날짜' 필터를 적용할 경우, 해당 날짜에 예약이 가능한 호스트 차량이 검색되도록 하고자 했습니다.
  - 호스트가 지정한 예약 가능 날짜를 필터하는 것은 간단했으나, 각 차량에 이미 등록된 예약과 날짜가 겹치면 검색되지 않도록 하는 부분이 까다로웠습니다. 
  - user가 설정한 날짜와 하루라도 날짜가 겹치는 예약이 하나라도 있으면 해당 차량은 검색되지 않아야 했습니다.
  - query문으로 위 조건을 표현하는 데에 한계가 있다고 판단하여, 초기에는 query문으로 데이터를 추출하여 service에서 데이터를 가공하고자 했습니다.

      <details>
      <summary>기존 코드</summary>
      <div markdown="1">

      ```TypeScript
       //src/cars/cars.service.ts

       async getHostCars(filter: CarFilterDto): Promise<HostCar[]> {
        const limitNumber = 12;
        const skip = filter.page ? (filter.page - 1) * limitNumber : 0;

        if (!filter.startDate !== !filter.endDate)
          throw new BadRequestException('One of Start date or End date is Missnig');

        const query = this.hostCarRepository
          .createQueryBuilder('hostCar')
          .leftJoinAndSelect('hostCar.carModel', 'carModel')
          .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
          .leftJoinAndSelect('hostCar.options', 'option')
          .leftJoinAndSelect('hostCar.bookings', 'booking')
          .leftJoinAndSelect('hostCar.files', 'file')
          .leftJoinAndSelect('carModel.brand', 'brand')
          .leftJoinAndSelect('carModel.engineSize', 'engineSize')
          .leftJoinAndSelect('carModel.carType', 'carType')
          .where('hostCar.status = true')
          .take(limitNumber)
          .skip(skip)
          .select([
            'hostCar.id',
            'hostCar.pricePerDay',
            'hostCar.address',
            'hostCar.startDate',
            'hostCar.endDate',
            'carModel.name',
            'brand.name',
            'file.url',
            'booking',
          ]);

          //다른 조건 관련 코드 생략

          if (filter.startDate && filter.endDate) {
          query
            .andWhere(
              'DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :startDate 
               AND DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :startDate',
              { startDate: `${filter.startDate}` },
            )
            .andWhere(
              'DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :endDate 
               AND DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :endDate',
                { endDate: `${filter.endDate}` },
              );
          }

          let filteredCars = await query.getMany();

          if (filter.startDate && filter.endDate) {
            filteredCars = filteredCars.filter((car) => {
              let result = true;
              car.bookings.forEach((booking) => {
                const bookingStartDate = new Date(booking.startDate);
                const bookingEndDate = new Date(booking.endDate);

                const correctedBookingStartDate = new Date(
                  bookingStartDate.getTime() + 24 * 60 * 60 * 1000,
                );
                const correctedBookingEndDate = new Date(
                  bookingEndDate.getTime() + 24 * 60 * 60 * 1000,
                );
                const filterStartDate = new Date(filter.startDate);
                const filterEndDate = new Date(filter.endDate);

                result =
                  result &&
                  (correctedBookingEndDate < filterStartDate ||
                    correctedBookingStartDate > filterEndDate);
                return result;
              });
              return result;
            });
          }
          return Promise.all(filteredCars);
        }
      ```

      </div>
      </details>
                   
             
- 그러나 기존 코드의 경우 날짜 필터가 적용된 최종 결과에 페이지네이션이 적용될 수 없다는 것을 깨달았습니다. 
- TypeOrm으로도 subquery를 사용할 수 있다는 것을 알게되어, subquery를 활용해 복잡한 조건을 query로 작성하여 문제를 해결했습니다. <br> 

    <details>
    <summary>개선된 코드</summary>
    <div markdown="1">
                   
     ```TypeScript            
       //src/cars/cars.service.ts

       async getHostCars(filter: CarFilterDto): Promise<FilteredList> {
        if (!filter.startDate !== !filter.endDate)
          throw new BadRequestException('One of Start date or End date is Missnig');

        const query = this.hostCarRepository
          .createQueryBuilder('hostCar')
          .leftJoinAndSelect('hostCar.carModel', 'carModel')
          .leftJoinAndSelect('hostCar.fuelType', 'fuelType')
          .leftJoinAndSelect('hostCar.options', 'option')
          .leftJoinAndSelect('hostCar.bookings', 'booking')
          .leftJoinAndSelect('hostCar.files', 'file')
          .leftJoinAndSelect('carModel.brand', 'brand')
          .leftJoinAndSelect('carModel.engineSize', 'engineSize')
          .leftJoinAndSelect('carModel.carType', 'carType')
          .where('hostCar.status = true')
          .orderBy('hostCar.id', 'DESC')
          .groupBy('hostCar.id')
          .select([
            'hostCar.id',
            'hostCar.pricePerDay',
            'hostCar.address',
            'hostCar.startDate',
            'hostCar.endDate',
            'carModel.name',
            'brand.name',
            'file.url',
            'booking',
          ]);  

        //다른 조건 관련 코드 생략

        if (filter.startDate && filter.endDate) {
          query
            .andWhere(
              'DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :startDate AND DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :startDate',
              { startDate: `${filter.startDate}` },
            )
            .andWhere(
              'DATE_FORMAT(hostCar.endDate, "%Y-%m-%d") >= :endDate AND DATE_FORMAT(hostCar.startDate, "%Y-%m-%d") <= :endDate',
              { endDate: `${filter.endDate}` },
            )
            .leftJoin(
              (subQuery) =>
                subQuery
                  .select('*')
                  .from('bookings', 'booking')
                  .where('!(start_date > :endDate or end_date < :startDate)', {
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                  }),
              'booking_query',
              'hostCar.id = booking_query.hostCarId',
            )
            .having('count(booking_query.id) < 1');
        }           

        const allFilteredCars = await query.getMany();

        const totalCount = allFilteredCars.length;

        await this.utilsService.pagenation(query, filter.page);

        const pageantedCars = await query.getMany();

        pageantedCars.forEach((car) => {
          car.startDate = this.utilsService.makeKrDate(car.startDate);
          car.endDate = this.utilsService.makeKrDate(car.endDate);
        });

        return { totalCount, hostCars: pageantedCars };
      }
     ```

    </div>
    </details>

  <br>
  
 #### 2. toss payment transaction 처리 & 에러 핸들링
 - toss 결제 API를 사용하여 서버 승인 절차를 진행하는 과정에서, toss에 요청을 보내는 과정 이후에는 transaction 처리를 하지 않았습니다.
 - toss에 요청을 보낸 이후에는 toss에 보낸 요청까지 rollback할 수 없기에, 이후 에러가 발생하더라도 rollback하는 것이 의미 없다고 판단했습니다. 
 
    <details>
    <summary>기존 코드</summary>
    <div markdown="1"> 

     ```TypeScript
     //src/payments/payments.service.ts
      
     async completeTossPayment(tossKey: TossKeyDto) {
        let response;
        let payment;
        await this.entityManager.transaction(async (entityManager) => {
          payment = await this.paymentRepository.findOneBy({
            booking: { uuid: tossKey.orderId },
          });

          if (!payment) throw new NotFoundException('Create Payment First');
      
          const paymentStatus = await this.getPaymentStatus('SUCCESS');
          await entityManager.update(
            Payment,
            { booking: { uuid: tossKey.orderId } },
            { id: payment.id, status: paymentStatus },
          );
      
          const bookingStatus = await this.bookingsService.getBookingStatus(
            'BOOKED',
          );
      
          await entityManager.update(
            Booking,
            { uuid: tossKey.orderId },
            { uuid: tossKey.orderId, status: bookingStatus },
          );

          const encodedKey = Buffer.from(
            `${this.config.get('TOSS_KEY')}:`,
          ).toString('base64');

          const options = {
            method: 'POST',
            url: `${this.config.get('TOSS_URL')}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${encodedKey}`,
            },
            data: {
              paymentKey: tossKey.paymentKey,
              amount: tossKey.amount,
              orderId: tossKey.orderId,
            },
          };
          try {
            response = await firstValueFrom(this.httpService.request(options));
          } catch (error) {
            console.error(error);
            throw new ServiceUnavailableException('Toss Connection Error');
          }
        });

        if (!response.data)
          throw new ServiceUnavailableException('Toss Info Response Error');

        const tossInfoEntry = this.tossInfoRepository.create({
          status: response.data.status,
          currency: response.data.currency,
          requestedAt: response.data.requestedAt,
          approvedAt: response.data.approvedAt,
          totalAmount: response.data.totalAmount,
          vat: response.data.vat,
          method: response.data.method,
          payment: payment,
        });

        return this.tossInfoRepository.save(tossInfoEntry);
      }
    }
    ```

  </div>
  </details>
   
        
 - 그러나 toss API에 승인 취소 요청을 보낼 수 있다는 것을 알게 되었습니다.
 - 관련 요청을 전부 transaction 처리하며, toss에 승인 요청을 보낸 이후 에러가 발생하는 경우는 별도의 try/catch문을 사용하여 승인 취소 요청을 보내도록 처리했습니다.
        
        
    <details>
    <summary>개선된 코드</summary>
    <div markdown="1">   
    
      ```TypeScript
      //src/payments/payments.service.ts
      
      async completeTossPayment(tossKey: TossKeyDto) {
        await this.entityManager.transaction(async (entityManager) => {
          const payment = await this.paymentRepository.findOneBy({
            booking: { uuid: tossKey.orderId },
          });

          if (!payment) throw new NotFoundException('Create Payment First');

          const paymentStatus = await this.getPaymentStatus('SUCCESS');
          await entityManager.update(
            Payment,
            { booking: { uuid: tossKey.orderId } },
            { id: payment.id, status: paymentStatus },
          );

          const bookingStatus = await this.bookingsService.getBookingStatus(
            'BOOKED',
          );

          await entityManager.update(
            Booking,
            { uuid: tossKey.orderId },
            { uuid: tossKey.orderId, status: bookingStatus },
          );

          const encodedKey = Buffer.from(
            `${this.config.get('TOSS_KEY')}:`,
          ).toString('base64');

          const options = {
            method: 'POST',
            url: `${this.config.get('TOSS_URL')}`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${encodedKey}`,
            },
            data: {
              paymentKey: tossKey.paymentKey,
              amount: tossKey.amount,
              orderId: tossKey.orderId,
            },
          };

          const response = await lastValueFrom(this.httpService.request(options));

          if (!response.data) {
            throw new ServiceUnavailableException('Toss Info Connection Error');
          }

          try {
            const tossInfoEntry = entityManager.create(TossInfo, {
              status: response.data.status,
              currency: response.data.currency,
              requestedAt: response.data.requestedAt,
              approvedAt: response.data.approvedAt,
              totalAmount: response.data.totalAmount,
              vat: response.data.vat,
              method: response.data.method,
              payment: payment,
            });

            return entityManager.save(TossInfo, tossInfoEntry);
          } catch (err) {
            const options = {
              method: 'POST',
              url: `${this.config.get('TOSS_CANCEL_URL')}/${
                tossKey.paymentKey
              }/cancel`,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${encodedKey}`,
              },
              data: {
                cancelReason: '서버 에러',
              },
            };

            await lastValueFrom(this.httpService.request(options));
            throw new InternalServerErrorException('DataBase Error');
          }
        });
      }
      ```
      
    </div>
    </details>  
 
 <br><br>
        
 ## 6. 그 외 트러블 슈팅
  <details>
  <summary>중첩된 객체의 Validation Pipe Dto 미적용 문제</summary>
  <div markdown="1">         
  
  <br>
        
  - 차량 등록 과정에서 요청 body를 validate하는 Dto를 작성하였습니다.
  - 객체의 value를 또 다른 객체로 요구하고 Type을 지정하였는데 객체 내 객체에 대해서는 validation이 적용되지 않았습니다.
  - 검색을 통해 이러한 경우 `@ValidateNest()`와 `@Type()` 데코레이터를 사용해야 한다는 것을 알게되었습니다. [참고한 stackoverflow](https://stackoverflow.com/questions/53650528/validate-nested-objects-using-class-validator-in-nest-js-controller)
  ```TypeScript
  //src/cars/dto/car-register.dto.ts
    
  export class CarRegisterDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => NewHostCarDto)
    newHostCar: NewHostCarDto;

    @IsArray()
    files: FileDto[];
  }
  ```
  
  <br>
    
  </div>
  </details>  

  <details>
  <summary>circular dependency 문제</summary>
  <div markdown="1">   
  
  <br>
        
  - 각 module에서 `forwardRef(() => )`를 사용하며 service를 `exports` 하여 해결했습니다. 
      
  <br>
    
  </div>
  </details>  
        
  <details>
  <summary>필터 적용 시 Pagenation 문제</summary>
  <div markdown="1">   
  
  <br>
    
  - 차량 목록에 필터를 적용하여 pagenation을 적용할 때, 필터가 적용된 목록의 개수를 client에게 전달하지 않으면 client가 전체 페이지 수를 알 수 없다는 것을 간과했습니다.
  - 필터된 목록의 `total count`와 각 페이지에 맞는 데이터를 함께 응답하여 문제를 해결했습니다.
  
  <br>
    
  </div>
  </details>  
  
  <details>
  <summary>Event Subscriber에 필요한 변수 넘겨주기</summary>
  <div markdown="1">  
  
  <br>
    
  - after update subscriber에서 `event.entity`를 사용하여 필요한 인자를 끌어오려 했으나, update의 경우 update된 value만 끌어올 수 있다는 것을 알게 되었습니다.
  - 값이 변하지 않더라도 update 메서드에서 필요한 값을 동일한 값으로 update하도록 하여 subscriber에서 event.entity로 값을 불러올 수 있게 하였습니다.
  
  <br>
    
  </div>
  </details>  
  
  <details>
  <summary>Token Refresh를 위해 Access Token 만료 메시지 보내기</summary>
  <div markdown="1"> 
  
  <br>
    
  - client가 token refresh 요청을 보내기 위해서는 유효하지 않은 token 에러 메시지와 구별되는 access token 만료 메시지가 필요했습니다.
  - 기존에는 Passport Strategy만을 사용해 특정 상황에 대한 error 메시지를 반환했습니다.
  - Passport Strategy 뿐만 아니라 `AuthGuard`에서도 상황에 따라 error 메시지를 반환하도록 지정해주어 문제를 해결했습니다.
  
  <br>
    
  </div>
  </details>  
        
  <details>
  <summary>MySql 데이터 상 날짜와 생성된 Date 객체 날짜 간극 문제</summary>
  <div markdown="1"> 
  
  <br>
    
  - MySql에 날짜 데이터를 저장할 때의 날짜와, MySql에서 데이터를 호출하였을 때 보여지는 날짜가 달라 어려움을 겪었습니다.
  - MySql의 timezone은 한국으로 설정되어 있었는데, 데이터베이스에서 날짜를 호출하여 가져올 때 국제 표준 시간으로 변환된다는 것을 알게 되었습니다.
  - 국제 표준 시간에서 한국 시간으로 변환하는 함수를 만들어 사용했습니다.

  ```TypeScript
    //src/utils/utils.service.ts
    
    makeKrDate(date: Date): Date {
      const correctedDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      return correctedDate;
    }
  ```
  
  <br>
    
  </div>
  </details>  

 <br><br>
        
 ## 7. 느낀점/회고
 > 3차 프로젝트 회고록: https://walwaldev.tistory.com
 <br>
 
 ## Reference

- 이 프로젝트는 [Airbnb](https://www.airbnb.co.kr/) 사이트를 참조하여 학습목적으로 만들었습니다.
- 실무수준의 프로젝트이지만 학습용으로 만들었기 때문에 이 코드를 활용하여 이득을 취하거나 무단 배포할 경우 법적으로 문제될 수 있습니다.
- 이 프로젝트에서 사용하고 있는 사진 대부분은 위코드에서 구매한 것이므로 해당 프로젝트 외부인이 사용할 수 없습니다.
