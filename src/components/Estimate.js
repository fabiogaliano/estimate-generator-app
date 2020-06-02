import React from "react";
import styled from "styled-components";
import { EstimateListDisplay } from "./EstimateListDisplay";
import EstimateItemForm from "./EstimateItemForm";
import EstimateCostDisplay from "./EstimateCostDisplay";
import { primaryColor } from "../helpers/colors";

const TotalWrapper = styled.section`
  display: flex;
  padding: 1.5em;
  background: ${primaryColor};
`;

const Estimate = () => {
  return (
    <>
      {" "}
      <TotalWrapper>
        <EstimateItemForm />
        <EstimateCostDisplay />
      </TotalWrapper>
      <EstimateListDisplay />
    </>
  );
};

export default Estimate;
