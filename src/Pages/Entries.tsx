import { styled, useStyletron, withStyle } from "baseui";
import { Button, SIZE } from "baseui/button";
import { FileUploader, StyledContentMessage } from "baseui/file-uploader";
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
import { parse } from "papaparse";
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
  position: "fixed",
  bottom: $theme.sizing.scale400,
  left: $theme.sizing.scale400,
  color: $theme.colors.primary400,
}));

const Cell = withStyle(StyledTableBodyCell, () => ({
  verticalAlign: "center",
}));

const HeadCell = withStyle(StyledTableHeadCell, () => ({
  verticalAlign: "center",
}));

const Header = styled(H5, ({ $theme }) => ({
  paddingBottom: $theme.sizing.scale400,
  marginBottom: $theme.sizing.scale600,
  borderBottomWidth: "1px",
  borderBottomColor: $theme.colors.mono500,
  borderBottomStyle: "solid",
}));

export const Entries: React.FC = () => {
  const nameInputRef = useRef<any>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [tickets, setTickets] = useState<string>("");
  const [importFile, setImportFile] = useState<File>();
  const [importType, setImportType] = useState<"replace" | "append">("replace");
  const [entries, setEntries] = useLocalState<any[]>("entries", []);
  const [css, theme] = useStyletron();

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (name && parseInt(tickets, 10) > 0) {
      const newEntries = [
        ...entries,
        {
          name,
          entries: tickets,
        },
      ];
      setEntries(newEntries);
      setName("");
      setTickets("");
      nameInputRef?.current?.focus();
    }
  };

  const onImportSubmit = async (e: any) => {
    if (importFile) {
      const importEntries: any[] = [];
      setImporting(true);
      parse(importFile, {
        worker: true,
        header: true,
        step: ({ data }: any) => {
          const entry: any = {};
          const keys = Object.keys(data);
          keys.forEach((key) => {
            entry[key.toLocaleLowerCase()] = data[key];
          });
          importEntries.push(entry);
        },
        complete: () => {
          setImporting(false);
          setEntries((entries) => {
            if (importType === "append") {
              return [...entries, ...importEntries];
            } else {
              return [...importEntries];
            }
          });
        },
      });
    }
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
        <Form onSubmit={onSubmit}>
          <Header>Add Entry</Header>
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
        <Form onSubmit={onImportSubmit}>
          <Header>Import</Header>
          <FormControl label="CSV with Entries">
            <>
              {!importFile && (
                <FileUploader
                  overrides={{
                    ContentMessage: {
                      component: () => (
                        <StyledContentMessage>
                          Attach your CSV
                        </StyledContentMessage>
                      ),
                    },
                  }}
                  onDrop={onImportDrop}
                  accept="text/csv"
                />
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
          <Button
            isLoading={importing}
            disabled={importing}
            onClick={() => setImportType("replace")}
            type="submit"
            size="compact"
          >
            Import &amp; Replace
          </Button>
          <Button
            $style={{ marginLeft: theme.sizing.scale100 }}
            isLoading={importing}
            disabled={importing}
            onClick={() => setImportType("append")}
            type="submit"
            size="compact"
          >
            Import &amp; Append
          </Button>
        </Form>
        <Form>
          <Header>Remove Entries</Header>
          <Button size="compact" onClick={() => onRemoveAll()}>
            Remove All Entries
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
                  <Cell>{entry.entries}</Cell>
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
      </TableWrapper>
    </Body>
  );
};
