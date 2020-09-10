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

const ANIMATION_LENGTH = 6000;
const GIFS = [Ralph, RalphSr, Ralphette];

const GIF_SIZE = "65vh";

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

// @ts-ignore
const ImageWrapper = styled("div", ({ $theme }) => ({
  position: "absolute",
  top: "40%",
  left: `-${GIF_SIZE}`,
  transform: "translate(0, -50%)",
  animationDuration: `${ANIMATION_LENGTH / 1000}s`,
  animationIterationCount: "1",
  animationTimingFunction: "linear",
  animationName: {
    from: {
      transform: "translate(0, -50%)",
    },
    to: {
      transform: `translate(calc(100vw + ${GIF_SIZE}), -50%)`,
    },
  },
  willChange: "transform",
  width: `${GIF_SIZE}`,
  height: `${GIF_SIZE}`,
  zIndex: 2,
}));

const Cover = styled("div", ({ $theme }) => ({
  position: "absolute",
  height: `${GIF_SIZE}`,
  width: "300vw",
  left: "35%",
  top: "0",
  backgroundColor: $theme.colors.background,
}));

const LogoCover = styled("div", ({ $theme }) => ({
  position: "absolute",
  height: "240px",
  width: "60px",
  right: "-8px",
  bottom: "0",
  backgroundColor: $theme.colors.background,
}));

const Image = styled("img", ({ $theme }) => ({
  position: "absolute",
  height: `${GIF_SIZE}`,
  width: `${GIF_SIZE}`,
}));

const Winner = styled("div", ({ $theme }) => ({
  position: "absolute",
  display: "block",
  textAlign: "center",
  top: "40%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  ...$theme.typography.font1450,
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
  left: "50%",
  bottom: $theme.sizing.scale800,
  transform: "translateX(-50%)",
  height: "20vh",
  zIndex: 1,
}));

export const Home: React.FC = () => {
  const [currentWinner, setCurrentWinner] = useState<string>("");
  const [entries, setEntries] = useLocalState<any[]>("entries", []);
  const [drawingInProgress, setDrawingInProgress] = useState<boolean>(false);
  const image = random(GIFS);

  const getNextWinner = () => {
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
      <Winner>{currentWinner}</Winner>

      {drawingInProgress && (
        <ImageWrapper>
          <Cover />
          <Image src={image} />
          <LogoCover />
        </ImageWrapper>
      )}

      <DrawButton
        disabled={ticketsRemaining <= 0 || drawingInProgress}
        type="button"
        size="compact"
        onClick={getNextWinner}
      >
        Draw Name
      </DrawButton>

      <EntriesLink to="/entries">Entries</EntriesLink>
      <LogoImage src={GravelWorlds} />
    </Body>
  );
};
