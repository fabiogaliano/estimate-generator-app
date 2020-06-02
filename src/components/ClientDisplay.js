import React from "react";
import { primaryColor } from "../helpers/colors";

const ClientDisplay = ({
  client: { name, phone, street, postalCode, locality },
}) => (
  <p style={{ color: primaryColor }}>
    <strong>{name}</strong> | {phone}
    <br /> {street}
    <br /> {postalCode} {locality}
    <br />
  </p>
);

export default ClientDisplay;
