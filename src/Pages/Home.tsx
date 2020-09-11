import { styled, withStyle } from "baseui";
import { Button } from "baseui/button";
import React, { useState } from "react";
import { StyledLink } from "../Components/StyledLink";
import { useLocalState } from "../Hooks/useLocalState";
import GravelWorlds from "../Images/GravelWorlds.png";
import Ralph from "../Images/Ralph.gif";
import Ralphette from "../Images/Ralphette.gif";
import RalphSr from "../Images/RalphSr.gif";
import { random } from "../Utilities/random";
import { shuffle } from "../Utilities/shuffle";

const ANIMATION_LENGTH = 3000;
const GIFS = [Ralph, RalphSr, Ralphette];

const GIF_SIZE = 65;

const VH = (value: number) => `${value}vh`;
const VMAX = (value: number) => `${value}vmax`;
const S = (ms: number) => `${ms / 1000}s`;

const Body = styled("div", ({ $theme }) => ({
  boxSizing: "border-box",
  position: "absolute",
  minHeight: "100vh",
  minWidth: "100vw",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: $theme.colors.background,
  color: $theme.colors.foreground,
  overflow: "hidden",
}));

const BodyInner = styled("div", ({ $theme }) => ({
  position: "absolute",
  minHeight: "100%",
  minWidth: "100%",
  zIndex: 2,
}));

// @ts-ignore
const ImageWrapper = styled("div", () => ({
  position: "absolute",
  top: "50%",
  left: `-${VH(GIF_SIZE)}`,
  transform: "translate(0, -50%)",
  animationDuration: `${S(ANIMATION_LENGTH)}`,
  animationIterationCount: "1",
  animationTimingFunction: "linear",
  animationName: {
    from: {
      transform: "translate(0, -50%)",
    },
    to: {
      transform: `translate(${VMAX(100 + GIF_SIZE)}, -50%)`,
    },
  },
  willChange: "transform",
  width: `${VH(GIF_SIZE - 6.8)}`,
  height: `${VH(GIF_SIZE)}`,
  zIndex: 2,
  overflow: "hidden",
}));

const Image = styled("img", () => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: `${VH(GIF_SIZE)}`,
  width: `${VH(GIF_SIZE)}`,
}));

const OFFSET = -25;

//@ts-ignore
const WinnerWrapper = styled("div", () => ({
  position: "absolute",
  top: 0,
  left: `-${VH(GIF_SIZE + OFFSET)}`,
  width: 0,
  height: "100vh",
  overflow: "hidden",
  animationFillMode: "forwards",
  animationDuration: `${S(ANIMATION_LENGTH)}`,
  animationIterationCount: "1",
  animationTimingFunction: "linear",
  animationName: {
    from: {
      width: 0,
    },
    to: {
      width: `${VMAX(100 + GIF_SIZE)}`,
    },
  },
}));

const WinnerInnerWrapper = styled("div", () => ({
  position: "absolute",
  top: 0,
  left: `${VH(GIF_SIZE + OFFSET)}`,
  width: "100vw",
  height: "100vh",
}));

const Winner = styled("div", ({ $theme }) => ({
  position: "absolute",
  display: "block",
  textAlign: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  ...$theme.typography.font1450,
  fontSize: "16vh",
  lineHeight: "1.05em",
  fontFamily: "'Permanent Marker', cursive",
}));

const DrawButton = styled(Button, ({ $theme }) => ({
  position: "absolute",
  top: $theme.sizing.scale400,
  right: $theme.sizing.scale400,
}));

const EntriesLink = withStyle<
  typeof StyledLink,
  React.ComponentProps<typeof StyledLink>
>(StyledLink, ({ $theme }) => ({
  position: "absolute",
  bottom: $theme.sizing.scale400,
  right: $theme.sizing.scale400,
  color: $theme.colors.primary200,
}));

// keeping in here for later
// const StyledBicycLincoln = styled(BicycLincoln, ({ $theme }) => ({
//   position: "absolute",
//   bottom: $theme.sizing.scale800,
//   left: "50%",
//   transform: "translateX(-50%)",
//   height: "40px",
// }));

const LogoImage = styled("img", ({ $theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translateX(-50%) translateY(-50%)",
  height: "80vh",
  opacity: 0.25,
  zIndex: 1,
}));

export const Home: React.FC = () => {
  const [currentWinner, setCurrentWinner] = useState<string>("");
  const [previousWinner, setPreviousWinner] = useState<string | null>(null);
  const [entries, setEntries] = useLocalState<any[]>("entries", []);
  const [drawingInProgress, setDrawingInProgress] = useState<boolean>(false);
  const image = random(GIFS);

  const getNextWinner = () => {
    setPreviousWinner(null);
    setDrawingInProgress(true);
    const hat = [];
    for (const entry of entries) {
      const tickets = entry.tickets;
      const name = entry.name;
      for (let i = 0; i < tickets; ++i) {
        hat.push(name);
      }
    }
    const winner = random(shuffle(hat));
    setCurrentWinner(winner);

    const newEntries = [...entries].map((entry) => {
      return entry.name === winner
        ? {
            ...entry,
            tickets: 0,
          }
        : entry;
    });
    setEntries(newEntries);
    setTimeout(() => {
      setPreviousWinner(winner);
      setDrawingInProgress(false);
    }, ANIMATION_LENGTH);
  };

  const ticketsRemaining =
    entries.length > 0
      ? entries
          .map((entry) => parseInt(entry.tickets, 10))
          .reduce((prev, current) => prev + current)
      : 0;

  return (
    <Body>
      <BodyInner>
        {drawingInProgress && (
          <>
            <WinnerWrapper>
              <WinnerInnerWrapper>
                <Winner>{currentWinner}</Winner>
              </WinnerInnerWrapper>
            </WinnerWrapper>
            <ImageWrapper>
              <Image src={image} />
            </ImageWrapper>
          </>
        )}

        {Boolean(previousWinner) && <Winner>{previousWinner}</Winner>}

        <DrawButton
          disabled={ticketsRemaining <= 0 || drawingInProgress}
          type="button"
          size="compact"
          onClick={getNextWinner}
        >
          Draw Name
        </DrawButton>

        <EntriesLink to="/entries">Entries</EntriesLink>
      </BodyInner>
      <LogoImage src={GravelWorlds} />
    </Body>
  );
};
