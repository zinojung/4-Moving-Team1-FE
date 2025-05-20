import { format, formatDistanceToNow, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';
import ButtonOutlined from '../atoms/ButtonOutlined';
import ButtonSolid from '../atoms/ButtonSolid';
import ChipEstimateStatus from '../atoms/ChipEstimateStatus';
import ChipMovingType from '../atoms/ChipMovingType';
import ChipText from '../atoms/ChipText';
import Swal from 'sweetalert2';

type Props = {
  id?: string;
  serviceType: string;
  status: string; // 지정 견적 요청 여부
  customerName: string;
  movingDate: Date;
  departure: string;
  destination: string;
  isConfirmed: boolean;
  requestDate: Date;
  price?: number;
  onSendEstimate?: () => void;
  onReject?: () => void;
  onViewDetail?: () => void;
  showOverlay?: boolean;
  rejectionMessage?: string;
};

/**
 * CustomerCardInEstimate 컴포넌트
 *
 * 고객이 요청한 이사 견적 정보를 표시하는 카드 UI입니다.
 * 이사 서비스 유형, 고객명, 출발지/도착지, 이사일, 견적 금액 등 정보를 시각적으로 구성하며,
 * 견적 상태 및 이사일 기준으로 '반려됨', '이사 완료' 등의 오버레이 메시지를 표시할 수 있습니다.
 * 조건에 따라 '견적 보내기' 및 '반려' 버튼을 표시하고, 반응형 레이아웃으로 다양한 해상도에 대응합니다.
 *
 * @param {string} serviceType - 이사 서비스 유형 (예: 'smallMove', 'homeMove', 'officeMove')
 * @param {string} status - 견적 요청 상태 ('assigned', 'rejected' 등)
 * @param {string} customerName - 고객 이름
 * @param {Date} movingDate - 예정된 이사 날짜
 * @param {string} departure - 출발지 주소
 * @param {string} destination - 도착지 주소
 * @param {string} rejectionMessage - 반려시 작성한 메시지
 * @param {boolean} isConfirmed - 견적이 확정되었는지 여부
 * @param {Date} requestDate - 견적 요청 생성 시간
 * @param {number} [price] - 견적 금액 (선택적)
 * @param {() => void} [onSendEstimate] - '견적 보내기' 버튼 클릭 시 실행될 콜백
 * @param {() => void} [onReject] - '반려' 버튼 클릭 시 실행될 콜백
 * @param {() => void} [onViewDetail] - '견적 상세보기' 클릭 시 실행될 콜백
 *
 * @example
 * <CustomerCardInEstimate
 *   serviceType="smallMove"
 *   status="assigned"
 *   customerName="김인서"
 *   movingDate={new Date('2024-07-01')}
 *   departure="서울시 중구"
 *   destination="경기도 수원시"
 *   isConfirmed={false}
 *   requestDate={new Date('2024-06-30')}
 *   price={210000}
 *   onSendEstimate={() => console.log('견적 보내기')}
 *   onReject={() => console.log('반려')}
 *   onViewDetail={() => console.log('상세보기')}
 *   rejectionMessage={'반려시 작성한 메시지'}
 * />
 */
function CustomerCardInEstimate({
  serviceType,
  status,
  customerName,
  movingDate,
  departure,
  destination,
  price,
  requestDate,
  onSendEstimate,
  onReject,
  onViewDetail,
  showOverlay,
  rejectionMessage,
}: Props) {
  const currentDate = new Date();
  const isPastMovingDate = isBefore(movingDate, currentDate);
  const isRejected = status === 'rejected';
  const hasPrice = !!price;

  const formatDateFnsKorean = (date: Date): string => {
    const formatted = format(date, 'yyyy. MM. dd', { locale: ko });
    const day = format(date, 'eee', { locale: ko }); // '월', '화' 등
    return `${formatted}(${day})`;
  };

  const formattedMovingDate = formatDateFnsKorean(movingDate);

  const fomattedRequestDate = formatDistanceToNow(requestDate, {
    addSuffix: true,
    locale: ko,
  });

  const formattedDeparture = departure.split(' ').slice(0, 2).join(' ');
  const formattedDestination = destination.split(' ').slice(0, 2).join(' ');

  const onViewRejectionMessage = (rejectionMessage?: string) => {
    Swal.fire({
      title: '반려 메시지',
      text: rejectionMessage,
    });
  };

  return (
    <div className="relative">
      {/* 카드 전체 내용 */}
      <div
        className="flex flex-col justify-between gap-3.5 lg:gap-4 bg-GrayScale-50 border-Line-100 border-[0.5px] rounded-2xl max-w-[327px] md:max-w-[600px] lg:max-w-full px-3.5 py-4"
        style={{
          filter:
            'drop-shadow(2px 2px 10px rgba(220, 220, 220, 0.1)) drop-shadow(-2px -2px 10px rgba(220, 220, 220, 0.1))',
        }}
      >
        <div className="bg-Black-100 w-full h-full z-10"></div>
        {/* chip 정보 */}
        <div className="flex justify-between items-center">
          <span className="flex gap-2.5">
            <ChipMovingType type={serviceType} />
            {status === 'assigned' ? <ChipEstimateStatus type="assigned" isShort={true} /> : ''}
          </span>
          <span className="text-[12px] lg:text-sm text-GrayScale-500">{fomattedRequestDate}</span>
        </div>
        {/* 고객 이름 및 견적 관련 정보 */}
        <div className="flex flex-col gap-3.5 lg:gap-4 lg:px-[18px] lg:py-[16px]">
          <div className="text-[16px] font-semibold lg:text-xl">{`${customerName} 고객님`}</div>
          <div className="border-b-1 border-Line-100"></div>
          <div className="flex flex-col md:items-center md:flex-row gap-3.5 lg:gap-4 text-[14px] lg:text-lg">
            <div className="flex items-center gap-2 lg:gap-3">
              <ChipText>이사일</ChipText>
              <span>{formattedMovingDate}</span>
            </div>
            <span className="hidden md:inline-block text-GrayScale-200">|</span>
            <div className="flex md:items-center gap-2 lg:gap-3">
              <ChipText>출발</ChipText>
              <span>{formattedDeparture}</span>
              <span className="text-GrayScale-200">|</span>
              <ChipText>도착</ChipText>
              <span>{formattedDestination}</span>
            </div>
          </div>
        </div>
        {price && (
          <div className="flex justify-end items-end gap-2 lg:gap-4">
            <span className="text-[14px] lg:text-lg leading-none">견적 금액</span>
            <span className="text-lg lg:text-2xl font-bold leading-none relative top-[1.5px]">{`${price.toLocaleString()}원`}</span>
          </div>
        )}

        {/* 버튼 */}
        {onSendEstimate && onReject ? (
          <div className="flex flex-col md:flex-row gap-2">
            <ButtonSolid onClick={onSendEstimate} showIcon={true}>
              견적 보내기
            </ButtonSolid>
            <ButtonOutlined onClick={onReject} disabled={status === 'assigned' ? false : true}>
              반려
            </ButtonOutlined>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* 조건 만족시 오버레이 */}
      {showOverlay !== false && (isRejected || isPastMovingDate) && (
        <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/65 text-white z-10 rounded-2xl max-w-[327px] md:max-w-[600px] lg:max-w-[955px] ">
          {!hasPrice && isRejected && (
            <div className="flex flex-col items-center gap-4">
              <p>반려된 요청이에요</p>
              <div className="max-w-[108px] lg:max-w-[123px]">
                <ButtonOutlined
                  intent="active"
                  onClick={() => onViewRejectionMessage(rejectionMessage)}
                >
                  <span className="text-[14px] lg:text-[16px] px-3">상세보기</span>
                </ButtonOutlined>
              </div>
            </div>
          )}
          {hasPrice && isPastMovingDate && (
            <div className="flex flex-col items-center gap-4">
              <p>이사 완료된 견적이에요</p>
              <div className="max-w-[108px] lg:max-w-[123px]">
                <ButtonOutlined intent="active" onClick={onViewDetail}>
                  <span className="text-[14px] lg:text-[16px] px-3">견적 상세보기</span>
                </ButtonOutlined>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerCardInEstimate;
