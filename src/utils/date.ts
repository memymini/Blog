import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatToKST = (iso: string) =>
  dayjs.utc(iso).tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH:mm");
