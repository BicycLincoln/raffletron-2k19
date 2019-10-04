import React, { useState } from "react";
import { styled } from "baseui";
import { Block } from "baseui/block";
import Ralph from "./Ralph.gif";
import RalphSr from "./RalphSr.gif";
import Ralphette from "./Ralphette.gif";
import { getLocal, shuffle, random, setLocal } from "../Utilities";
import { Button } from "baseui/button";

const ANIMATION_LENGTH = 8000
const GIFS = [ Ralph, RalphSr, Ralphette ]

const Body = styled(Block, ({ $theme }) => ({
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
  paddingRight: $theme.sizing.scale800
}));

// @ts-ignore 
const ImageWrapper = styled(Block, ({ $theme }) => ({
  position: "absolute",
  top: "50%",
  left: "-600px",
  transform: "translate(0, -50%)",
  animationDuration: `${ANIMATION_LENGTH / 1000}s`,
  animationIterationCount: "1",
  animationTimingFunction: "linear",
  animationName: {
    from: {
      transform: "translate(0, -50%)"
    },
    to: {
      transform: "translate(calc(100vw + 600px), -50%)"
    }
  },
  willChange: "transform",
  width: "600px",
  height: "600px",
}));

const Cover = styled(Block, ({ $theme }) => ({
  position: "absolute",
  height: "600px",
  width: "300vw",
  left: "35%",
  top: "0",
  backgroundColor: $theme.colors.background,
}));

const LogoCover = styled(Block, ({ $theme }) => ({
    position: "absolute",
    height: "240px",
    width: "60px",
    right: "0",
    bottom: "0",
    backgroundColor: $theme.colors.background,
  }));

const Image = styled("img", ({ $theme }) => ({
  position: "absolute",
  height: "600px",
  width: "600px"
}));

const Winner = styled(Block, ({ $theme }) => ({
  position: "absolute",
  display: "block",
  textAlign: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  ...$theme.typography.font1450
}));

const DrawButton = styled(Button, ({ $theme }) => ({
  position: "absolute",
  top: $theme.sizing.scale400,
  right: $theme.sizing.scale400
}));

export const Home: React.FC = () => {
  const [currentWinner, setCurrentWinner] = useState<string>("");
  const [entries, setEntries] = useState<any[]>(getLocal("entries") || []);
  const [drawingInProgress, setDrawingInProgress] = useState<boolean>(false);
  const image = random(GIFS)

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

    const newEntries = [...entries].map(entry => {
      return entry.name === winner
        ? {
            ...entry,
            tickets: 0
          }
        : entry;
    });
    setEntries(newEntries);
    setLocal("entries", newEntries);
    setTimeout(() => {
      setDrawingInProgress(false);
    }, ANIMATION_LENGTH);
  };

  const ticketsRemaining = entries.length > 0
  ? entries
    .map(entry => parseInt(entry.tickets, 10))
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
    </Body>
  );
};
