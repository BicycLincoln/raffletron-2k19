import { styled } from "baseui";
import React, { useState, useMemo } from "react";
import GravelWorlds from "../Images/GravelWorlds.png";
import { differenceInSeconds, fromUnixTime } from "date-fns";

const Body = styled("div", ({ $theme }) => ({
  boxSizing: "border-box",
  position: "absolute",
  minHeight: "100vh",
  minWidth: "100vw",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: $theme.colors.background,
  color: $theme.colors.foreground,
  paddingTop: $theme.sizing.scale800,
  paddingBottom: $theme.sizing.scale800,
  paddingLeft: $theme.sizing.scale800,
  paddingRight: $theme.sizing.scale800,
  overflow: "hidden",
}));

const Timer = styled("div", ({ $theme }) => ({
  position: "absolute",
  display: "flex",
  textAlign: "center",
  top: "40%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  zIndex: 2,
  ...$theme.typography.font1450,
  fontSize: $theme.sizing.scale4800,
  fontFamily: "'Permanent Marker', cursive",
}));

const TimerBlock = styled("div", ({ $theme }) => ({
  width: "2ch",
  textAlign: "center",
}));

const TimerSep = styled("div", ({ $theme }) => ({
  textAlign: "center",
}));

const LogoImage = styled("img", ({ $theme }) => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translateX(-50%) translateY(-50%)",
  height: "80vh",
  opacity: 0.25,
  zIndex: 1,
}));

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export const Countdown: React.FC = () => {
  const ToDate = useMemo(() => fromUnixTime(1599782400), []);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    differenceInSeconds(ToDate, new Date())
  );

  setInterval(() => {
    setSecondsRemaining(differenceInSeconds(ToDate, new Date()));
  }, 300);

  const hoursCountdown = useMemo(
    () => Math.floor(secondsRemaining / SECONDS_IN_HOUR),
    [secondsRemaining]
  );
  const minutesCountdown = useMemo(
    () =>
      Math.floor(
        (secondsRemaining - hoursCountdown * SECONDS_IN_HOUR) /
          SECONDS_IN_MINUTE
      ),
    [secondsRemaining, hoursCountdown]
  );
  const secondsCountdown = useMemo(
    () =>
      Math.floor(
        secondsRemaining -
          hoursCountdown * SECONDS_IN_HOUR -
          minutesCountdown * SECONDS_IN_MINUTE
      ),
    [secondsRemaining, hoursCountdown, minutesCountdown]
  );

  return (
    <Body>
      <Timer>
        <TimerBlock>
          {`${secondsRemaining < 0 ? 0 : hoursCountdown}`.padStart(2, "0")}
        </TimerBlock>
        <TimerSep>:</TimerSep>
        <TimerBlock>
          {`${secondsRemaining < 0 ? 0 : minutesCountdown}`.padStart(2, "0")}
        </TimerBlock>
        <TimerSep>:</TimerSep>
        <TimerBlock>
          {`${secondsRemaining < 0 ? 0 : secondsCountdown}`.padStart(2, "0")}
        </TimerBlock>
      </Timer>
      <LogoImage src={GravelWorlds} />
    </Body>
  );
};
