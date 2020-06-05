import React from "react";
import styled from "styled-components";
import { Link, Route, Switch } from "react-router-dom";
import { Button } from "@material-ui/core";
import Estimate from "./components/Estimate";
import ClientForm from "./components/ClientForm";
import ClientDisplay from "./components/ClientDisplay";
import clientStore from "./stores/clientStore";
import estimateStore from "./stores/estimateStore";
import languageStore from "./stores/languageStore";
import {
  Delete as DeleteIcon,
  AddCircleOutlineTwoTone as AddCircleIcon,
  ListAlt as ListAltIcon,
} from "@material-ui/icons";
import {
  generateEstimatePDF,
  getTodayDate,
  mockWorker,
  translateComponent,
} from "./helpers/helpers";
import translations from "./helpers/translations";
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
  let { language, setLanguage } = languageStore();
  let { app } = translations;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          background: secondaryColor,
        }}
      >
        <Button
          onClick={() => setLanguage("pt")}
          style={{
            margin: "0px 10px",
          }}
          variant="contained"
        >
          PT
        </Button>

        <Button
          style={{
            margin: "0px 5px",
          }}
          variant="contained"
          onClick={() => setLanguage("en")}
        >
          EN
        </Button>
      </div>
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
              {translateComponent(app.removeClientBtn, language)}
            </Button>
          ) : (
            <Button
              color="primary"
              startIcon={<AddCircleIcon />}
              variant="contained"
            >
              {translateComponent(app.addClientBtn, language)}
            </Button>
          )}
        </Link>
        {"                "}
        <Link style={{ textDecoration: "none" }} to="/">
          <Button variant="contained">
            {translateComponent(app.estimateBtn, language)}
          </Button>
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
                  `${translateComponent(
                    app.estimateBtn,
                    language
                  ).toUpperCase()}-${client.name
                    .split(" ")
                    .join("")}_${getTodayDate("-")}.pdf`
                )
            }
          >
            {translateComponent(app.generateEstimate, language)}
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
