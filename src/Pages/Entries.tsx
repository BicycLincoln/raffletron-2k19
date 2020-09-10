import { styled, useStyletron, withStyle } from "baseui";
import { Button, SIZE } from "baseui/button";
import { FileUploader } from "baseui/file-uploader";
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
import { H5 } from "baseui/typography";
import parse from "csv-parse";
import React, { useRef, useState } from "react";
import { StyledLink } from "../Components/StyledLink";
import { useLocalState } from "../Hooks/useLocalState";

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
  const [importFile, setImportFile] = useState<File>();
  const [entries, setEntries] = useLocalState<any[]>("entries", []);
  const [css, theme] = useStyletron();

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
      setName("");
      setTickets("");
      nameInputRef?.current?.focus();
    }
  };

  const onImportSubmit = async (e: any) => {
    const parser = parse({ columns: ["name", "tickets"], fromLine: 2 });
    const reader = importFile!.stream().getReader();

    parser.on("readable", () => {
      let record: { name: string; tickets: string };
      while ((record = parser.read())) {
        const { name, tickets } = record;
        if (name && parseInt(tickets, 10) > 0) {
          console.log(name);
          console.log(tickets);
          setEntries((prevEntries) => {
            console.log(prevEntries);
            return [
              ...prevEntries,
              {
                name,
                tickets,
              },
            ];
          });
        }
      }
    });

    let done = false;

    // read the stream from the file upload
    do {
      const result = await reader?.read();
      if (result.value) {
        parser.write(result.value, "binary");
      }
      done = result?.done;
    } while (!done);

    setImportFile(undefined);
  };

  const onImportDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      setImportFile(acceptedFiles[0]);
    }
  };

  const onRemoveImport = () => {
    setImportFile(undefined);
  };

  const onRemove = (i: number) => {
    return () => {
      const newEntries = [...entries];
      newEntries.splice(i, 1);
      setEntries(newEntries);
    };
  };

  const onRemoveAll = () => {
    setEntries([]);
  };

  return (
    <Body>
      <HomeLink to="/">Home</HomeLink>
      <div>
        <H5>Add Entry</H5>
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
        <H5>Import CSV</H5>
        <Form onSubmit={onImportSubmit}>
          <FormControl label="CSV with Entries">
            <>
              {!importFile && (
                <FileUploader onDrop={onImportDrop} accept="text/csv" />
              )}
              {!!importFile && (
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  })}
                >
                  <div>{importFile.name}</div>
                  <div className={css({ flex: 1 })} />
                  <Button onClick={onRemoveImport} size={SIZE.compact}>
                    𝗫
                  </Button>
                </div>
              )}
            </>
          </FormControl>
          <Button type="submit" size="compact">
            Import File
          </Button>
        </Form>
      </div>
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
        <Button
          $style={{ marginTop: theme.sizing.scale400 }}
          size="compact"
          onClick={() => onRemoveAll()}
        >
          Remove All Entries
        </Button>
      </TableWrapper>
    </Body>
  );
};
