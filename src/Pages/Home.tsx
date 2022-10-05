import { styled, useStyletron, withStyle } from "baseui";
import { Button } from "baseui/button";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { StyledLink } from "../Components/StyledLink";
import { useLocalState } from "../Hooks/useLocalState";
import Cat from "../Images/Cat.gif";
import Dog from "../Images/Dog.gif";
import Logo from "../Images/BicycLincoln-Cog.svg";
import Mouse from "../Images/Mouse.gif";
import Octopus from "../Images/Octopus.gif";
import Ralph from "../Images/Ralph.gif";
import Ralphette from "../Images/Ralphette.gif";
import RalphSr from "../Images/RalphSr.gif";
import Shark from "../Images/Shark.gif";
import Squirrel from "../Images/Squirrel.gif";
import { createRandomGenerator } from "../Utilities/createRandomGenerator";
import { random } from "../Utilities/random";
import { shuffle } from "../Utilities/shuffle";

type IDirection = "left" | "right";

interface IGif {
  direction: IDirection;
  url: string;
  enabled: boolean;
}

const ANIMATION_LENGTH = 3000;
const GIFS: IGif[] = [
  {
    direction: "left",
    url: Shark,
    enabled: false,
  },
  {
    direction: "right",
    url: Dog,
    enabled: false,
  },
  {
    direction: "left",
    url: Octopus,
    enabled: false,
  },
  {
    direction: "right",
    url: Mouse,
    enabled: false,
  },
  {
    direction: "right",
    url: Squirrel,
    enabled: false,
  },
  {
    direction: "right",
    url: Cat,
    enabled: false,
  },
  {
    direction: "left",
    url: Ralph,
    enabled: true,
  },
  {
    direction: "left",
    url: Ralphette,
    enabled: true,
  },
  {
    direction: "left",
    url: RalphSr,
    enabled: true,
  },
];

const GIF_SIZE = 65;

const VH = (value: number) => `${value}vh`;
const VMAX = (value: number) => `${value}vmax`;
const VMIN = (value: number) => `${value}vmin`;
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

const BodyInner = styled("div", () => ({
  position: "absolute",
  minHeight: "100%",
  minWidth: "100%",
  zIndex: 2,
}));

const ImageWrapper = styled(
  "div",
  // @ts-ignore
  ({ $direction = "left" }: { $direction?: IDirection }) => ({
    position: "absolute",
    top: "50%",
    [$direction]: `-${VH(GIF_SIZE)}`,
    transform: "translate(0, -50%)",
    animationDuration: `${S(ANIMATION_LENGTH)}`,
    animationIterationCount: "1",
    animationTimingFunction: "linear",
    animationName: {
      from: {
        transform: "translate(0, -50%)",
      },
      to: {
        transform: `translate(${VMAX(
          ($direction === "right" ? -1 : 1) * (100 + GIF_SIZE)
        )}, -50%)`,
      },
    },
    willChange: "transform",
    width: `${VH(GIF_SIZE - 6.8)}`,
    height: `${VH(GIF_SIZE)}`,
    zIndex: 2,
    overflow: "hidden",
  })
);

const Image = styled("img", () => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: `${VH(GIF_SIZE)}`,
  width: `${VH(GIF_SIZE)}`,
}));

const OFFSET = -25;

const WinnerWrapper = styled(
  "div",
  //@ts-ignore
  ({ $direction = "left" }: { $direction?: IDirection }) => ({
    position: "absolute",
    top: 0,
    [$direction]: `-${VH(GIF_SIZE + OFFSET)}`,
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
  })
);

const WinnerInnerWrapper = styled(
  "div",
  ({ $direction = "left" }: { $direction?: IDirection }) => ({
    position: "absolute",
    top: 0,
    [$direction]: `${VH(GIF_SIZE + OFFSET)}`,
    width: "100vw",
    height: "100vh",
  })
);

const Winner = styled("div", ({ $theme }) => ({
  position: "absolute",
  display: "block",
  textAlign: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  ...$theme.typography.font1450,
  fontSize: `${VMIN(16)}`,
  lineHeight: "0.875",
  fontFamily: "'Yanone Kaffeesatz', sans-serif",
  textTransform: "uppercase",
  fontWeight: 800,
  // fontFamily: "'Bangers', cursive",
  // fontFamily: "'Permanent Marker', cursive",
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
  color: $theme.colors.primary400,
}));

const LogoImage = styled<{ $visible: boolean }, "img">(
  "img",
  ({ $theme, $visible }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    width: "50vw",
    opacity: $visible ? 0.25 : 0,
    zIndex: 1,
    transition: "opacity 2500ms",
  })
);

const getRandom = createRandomGenerator(GIFS.filter((gif) => gif.enabled));

export const Home: React.FC = () => {
  const [image, setImage] = useLocalState<number>("image", 0);
  useEffect(() => {
    setTimeout(() => {
      setImage((image + 1) % 1);
    }, 7_500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const history = useHistory();
  const [css] = useStyletron();
  const [currentWinner, setCurrentWinner] = useState<string>("");
  const [gif, setGif] = useState<any>(getRandom());
  const [entries, setEntries] = useLocalState<any[]>("entries", []);
  const [drawingInProgress, setDrawingInProgress] = useState<boolean>(false);

  const getNextWinner = useCallback(() => {
    if (!drawingInProgress) {
      setDrawingInProgress(true);
      setEntries((entries) => {
        const hat = [];
        for (const entry of entries) {
          for (let i = 0; i < entry.entries; ++i) {
            hat.push(entry.name);
          }
        }
        const winner = random(shuffle(hat));
        setGif(getRandom());
        setCurrentWinner(winner);

        const newEntries = [...entries].map((entry) => {
          return entry.name === winner
            ? {
                ...entry,
                entries: --entry.entries,
              }
            : entry;
        });

        return newEntries;
      });
    }
    // eslint-disable-next-line
  }, [drawingInProgress]);

  const entriesRemaining =
    entries.length > 0
      ? entries
          .map((entry) => parseInt(entry.entries, 10))
          .reduce((prev, current) => prev + current)
      : 0;

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (
        (e.key === "Spacebar" || e.key === " " || e.key === "Enter") &&
        entriesRemaining > 0
      ) {
        e.preventDefault();
        getNextWinner();
      } else if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        history.push("/entries");
      }
    },
    [getNextWinner, entriesRemaining, history]
  );

  const onAnimationEnd = useCallback((e) => {
    setDrawingInProgress(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyUp);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", onKeyUp);
    };
  }, [onKeyUp]);

  return (
    <Body>
      <BodyInner>
        {drawingInProgress && (
          <>
            <WinnerWrapper $direction={gif.direction}>
              <WinnerInnerWrapper $direction={gif.direction}>
                <Winner>{currentWinner}</Winner>
              </WinnerInnerWrapper>
            </WinnerWrapper>
            <ImageWrapper
              onAnimationEnd={onAnimationEnd}
              $direction={gif.direction}
            >
              <Image src={gif.url} />
            </ImageWrapper>
          </>
        )}

        {!drawingInProgress && <Winner>{currentWinner}</Winner>}

        <div className={css({ display: "none" })}>
          <DrawButton
            disabled={entriesRemaining <= 0 || drawingInProgress}
            type="button"
            size="compact"
            onClick={getNextWinner}
          >
            Draw Name
          </DrawButton>
        </div>

        <EntriesLink $style={{ display: "none" }} to="/entries">
          Entries
        </EntriesLink>
      </BodyInner>
      <LogoImage $visible={image === 0} src={Logo} />
    </Body>
  );
};
