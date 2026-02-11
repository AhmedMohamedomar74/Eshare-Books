import { Box, Typography } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// ✅ Plugins لازم تتفعل
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSelector } from "react-redux";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * reservedBorrows:
 * [
 *   { startDate: "...", endDate: "...", status: "pending/accepted/completed" },
 *   ...
 * ]
 */

const BorrowDate = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  reservedBorrows = [],
}) => {
  const today = dayjs().startOf("day");
  const { content } = useSelector((state) => state.lang);

  // ✅ نحول reservedBorrows إلى رينجز Dayjs
  const reservedRanges = reservedBorrows.map((r) => ({
    start: dayjs(r.startDate).startOf("day"),
    end: dayjs(r.endDate).startOf("day"),
    status: r.status,
  }));

  // ✅ هل اليوم داخل range محجوز؟
  const isReservedDay = (date) => {
    const d = date.startOf("day");
    return reservedRanges.some(
      (range) =>
        d.isSameOrAfter(range.start, "day") &&
        d.isSameOrBefore(range.end, "day")
    );
  };

  // ✅ disable: past + reserved
  const shouldDisableDate = (date) => {
    const d = date.startOf("day");
    if (d.isBefore(today, "day")) return true;
    if (isReservedDay(d)) return true;
    return false;
  };

  // ✅ تلوين الأيام المحجوزة
  const renderReservedDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const reserved = isReservedDay(day);

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disabled={reserved || shouldDisableDate(day)}
        sx={{
          ...(reserved && {
            bgcolor: "#ffebee", // أحمر فاتح
            color: "#c62828", // أحمر غامق
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "#ffcdd2",
            },
          }),
        }}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" mb={1}>
          {content.selectBorrowDuration}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Start Date */}
          <DatePicker
            label={content.startDate}
            value={startDate}
            onChange={(newValue) => {
              if (!newValue) {
                setStartDate(null);
                return;
              }

              setStartDate(newValue);

              // لو endDate موجودة و بقت قبل startDate → reset
              if (endDate && endDate.isSameOrBefore(newValue, "day")) {
                setEndDate(null);
              }
            }}
            minDate={today}
            shouldDisableDate={shouldDisableDate}
            slots={{ day: renderReservedDay }}
          />

          {/* End Date */}
          <DatePicker
            label={content.endDate}
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            minDate={startDate ? startDate.add(1, "day") : today.add(1, "day")}
            shouldDisableDate={shouldDisableDate}
            slots={{ day: renderReservedDay }}
            disabled={!startDate}
          />
        </Box>

        {/* Legend */}
        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "#ffebee",
              border: "1px solid #c62828",
              borderRadius: "50%",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {content.reservedDays}
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BorrowDate;
