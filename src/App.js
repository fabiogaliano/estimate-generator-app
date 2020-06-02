import React from "react";
import styled from "styled-components";
import { Link, Route, Switch } from "react-router-dom";
import { Button } from "@material-ui/core";
import Estimate from "./components/Estimate";
import ClientForm from "./components/ClientForm";
import ClientDisplay from "./components/ClientDisplay";
import clientStore from "./stores/clientStore";
import estimateStore from "./stores/estimateStore";
import {
  Delete as DeleteIcon,
  AddCircleOutlineTwoTone as AddCircleIcon,
  ListAlt as ListAltIcon,
} from "@material-ui/icons";
import {
  generateEstimatePDF,
  getTodayDate,
  mockWorker,
} from "./helpers/helpers";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { secondaryColor } from "./helpers/colors";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Wrapper = styled.section`
  padding: 1em;
  background: ${secondaryColor};
`;

const App = () => {
  let { client, removeClient } = clientStore();
  let { estimateItems, taxPercentage } = estimateStore();

  return (
    <div>
      <Wrapper>
        {client && <ClientDisplay client={client} />}
        <Link to="/client" style={{ textDecoration: "none" }}>
          {"   "}
          {client ? (
            <Button
              color="secondary"
              startIcon={<DeleteIcon />}
              variant="contained"
              onClick={() => removeClient()}
            >
              Remove Client
            </Button>
          ) : (
            <Button
              color="primary"
              startIcon={<AddCircleIcon />}
              variant="contained"
            >
              Add Client
            </Button>
          )}
        </Link>
        {"                "}
        <Link style={{ textDecoration: "none" }} to="/">
          <Button variant="contained">Estimate</Button>
        </Link>
        {client && estimateItems.length ? (
          <Button
            style={{ float: "right" }}
            color="primary"
            startIcon={<ListAltIcon />}
            variant="contained"
            onClick={() =>
              pdfMake
                .createPdf(
                  generateEstimatePDF(
                    mockWorker,
                    client,
                    estimateItems,
                    taxPercentage
                  )
                )
                .download(
                  `ORÇAMENTO-${client.name.split(" ").join("")}_${getTodayDate(
                    "-"
                  )}.pdf`
                )
            }
          >
            Generate Estimate
          </Button>
        ) : null}
      </Wrapper>
      <div>
        <Switch>
          <Route path="/" exact component={Estimate} />
          <Route path="/client" exact component={ClientForm} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
