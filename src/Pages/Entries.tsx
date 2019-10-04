import { styled } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import {
  StyledBody,
  StyledCell,
  StyledHead,
  StyledHeadCell,
  StyledRow,
  StyledTable
} from "baseui/table";
import React, { useState } from "react";
import { StyledLink } from "../Components/StyledLink";
import { getLocal, setLocal } from "../Utilities";

const Body = styled(Block, ({ $theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: $theme.colors.background,
  color: $theme.colors.foreground,
  paddingTop: $theme.sizing.scale800,
  paddingBottom: $theme.sizing.scale800,
  paddingLeft: $theme.sizing.scale800,
  paddingRight: $theme.sizing.scale800
}));

const Form = styled("form", ({ $theme }) => ({
  width: "300px",
  marginRight: $theme.sizing.scale800
}));

const Table = styled(Block, ({ $theme }) => ({
  flex: 1
}));

const HomeLink = styled(StyledLink, ({ $theme }) => ({
  position: "absolute",
  bottom: $theme.sizing.scale400,
  left: $theme.sizing.scale400,
  color: $theme.colors.primary200
}));

export const Entries: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [tickets, setTickets] = useState<string>("");
  const [entries, setEntries] = useState<any[]>(getLocal("entries") || []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (name && parseInt(tickets, 10) > 0) {
      const newEntries = [
        ...entries,
        {
          name,
          tickets
        }
      ];
      setEntries(newEntries);
      setLocal("entries", newEntries);
      setName("");
      setTickets("");
    }
  };

  const onRemove = (i: number) => {
    return (e: any) => {
      const newEntries = [...entries];
      newEntries.splice(i, 1);
      setLocal("entries", newEntries);
      setEntries(newEntries);
    };
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
            onChange={event => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl label="Entries">
          <Input
            id="entries"
            type="number"
            size="compact"
            autoComplete="off"
            value={tickets}
            onChange={event => setTickets(event.currentTarget.value)}
          />
        </FormControl>
        <Button type="submit" size="compact">
          Add Entry
        </Button>
      </Form>
      <Table>
        <StyledTable>
          <StyledHead>
            <StyledHeadCell>Name</StyledHeadCell>
            <StyledHeadCell>Entries</StyledHeadCell>
            <StyledHeadCell></StyledHeadCell>
          </StyledHead>
          <StyledBody>
            {entries.map((entry: any, index: number) => (
              <StyledRow key={index}>
                <StyledCell>{entry.name}</StyledCell>
                <StyledCell>{entry.tickets}</StyledCell>
                <StyledCell>
                  <Button size="compact" onClick={onRemove(index)}>
                    Remove
                  </Button>
                </StyledCell>
              </StyledRow>
            ))}
          </StyledBody>
        </StyledTable>
      </Table>
    </Body>
  );
};
