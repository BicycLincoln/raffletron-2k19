import { styled, withStyle } from "baseui";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import {
  StyledRoot,
  StyledTable,
  StyledTableBody,
  StyledTableBodyCell,
  StyledTableBodyRow,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeadRow,
} from "baseui/table-semantic";
import React, { useRef, useState } from "react";
import { StyledLink } from "../Components/StyledLink";
import { useLocalState } from "../Hooks/useLocalState";
import { setLocal } from "../Utilities/setLocal";

const Body = styled("div", ({ $theme }) => ({
  display: "flex",
  backgroundColor: $theme.colors.background,
  color: $theme.colors.foreground,
  paddingTop: $theme.sizing.scale800,
  paddingBottom: $theme.sizing.scale800,
  paddingLeft: $theme.sizing.scale800,
  paddingRight: $theme.sizing.scale800,
}));

const Form = styled("form", ({ $theme }) => ({
  width: "300px",
  marginRight: $theme.sizing.scale800,
}));

const TableWrapper = styled("div", ({ $theme }) => ({
  flex: 1,
}));

const HomeLink = withStyle<
  typeof StyledLink,
  React.ComponentProps<typeof StyledLink>
>(StyledLink, ({ $theme }) => ({
  position: "absolute",
  bottom: $theme.sizing.scale400,
  left: $theme.sizing.scale400,
  color: $theme.colors.primary200,
}));

const Cell = withStyle(StyledTableBodyCell, ({ $theme }) => ({
  verticalAlign: "center",
}));

const HeadCell = withStyle(StyledTableHeadCell, ({ $theme }) => ({
  verticalAlign: "center",
}));

export const Entries: React.FC = () => {
  const nameInputRef = useRef<any>(null);
  const [name, setName] = useState<string>("");
  const [tickets, setTickets] = useState<string>("");
  const [entries, setEntries] = useLocalState<any[]>("entries", []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (name && parseInt(tickets, 10) > 0) {
      const newEntries = [
        ...entries,
        {
          name,
          tickets,
        },
      ];
      setEntries(newEntries);
      setLocal("entries", newEntries);
      setName("");
      setTickets("");
      nameInputRef?.current?.focus();
    }
  };

  const onRemove = (i: number) => {
    return () => {
      const newEntries = [...entries];
      newEntries.splice(i, 1);
      setLocal("entries", newEntries);
      setEntries(newEntries);
    };
  };

  const onRemoveAll = () => {
    setLocal("entries", []);
    setEntries([]);
  };

  return (
    <Body>
      <HomeLink to="/">Home</HomeLink>
      <Form onSubmit={onSubmit}>
        <FormControl label="Name">
          <Input
            id="name"
            value={name}
            size="compact"
            autoComplete="off"
            autoFocus
            inputRef={nameInputRef}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl label="Entries">
          <Input
            id="entries"
            type="number"
            size="compact"
            autoComplete="off"
            value={tickets}
            onChange={(event) => setTickets(event.currentTarget.value)}
          />
        </FormControl>
        <Button type="submit" size="compact">
          Add Entry
        </Button>
      </Form>
      <TableWrapper>
        <StyledRoot $style={{ overflow: "visible" }}>
          <StyledTable>
            <StyledTableHead>
              <StyledTableHeadRow>
                <HeadCell>Name</HeadCell>
                <HeadCell>Entries</HeadCell>
                <HeadCell></HeadCell>
              </StyledTableHeadRow>
            </StyledTableHead>
            <StyledTableBody>
              {entries.map((entry: any, index: number) => (
                <StyledTableBodyRow key={index}>
                  <Cell>{entry.name}</Cell>
                  <Cell>{entry.tickets}</Cell>
                  <Cell>
                    <Button size="compact" onClick={onRemove(index)}>
                      Remove Entry
                    </Button>
                  </Cell>
                </StyledTableBodyRow>
              ))}
            </StyledTableBody>
          </StyledTable>
        </StyledRoot>
        <Button size="compact" onClick={() => onRemoveAll()}>
          Remove All Entries
        </Button>
      </TableWrapper>
    </Body>
  );
};
