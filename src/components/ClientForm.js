import React from "react";
import { Formik, Form, useField } from "formik";
import { TextField, Button, Grid } from "@material-ui/core";
import clientStore from "../stores/clientStore";
import styled from "styled-components";
import { primaryColor } from "../helpers/colors";

const TotalWrapper = styled.section`
  display: flex;
  padding: 1.5em;
  background: ${primaryColor};
`;

const CustomField = ({
  required,
  style,
  type,
  variant,
  label,
  inputProps,
  ...props
}) => {
  let [field, meta] = useField(props);
  let errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      {...field}
      label={label}
      variant={variant}
      type={type}
      style={style}
      InputProps={inputProps}
      helperText={errorText}
      required={required}
      error={!!errorText}
      size="small"
      margin="dense"
    />
  );
};

const ClientForm = ({ history }) => {
  let { setClient } = clientStore();
  let blankClient = {
    name: "",
    street: "",
    postalCode: "",
    locality: "",
    phone: "",
  };
  return (
    <TotalWrapper>
      <Grid container>
        <Formik
          initialValues={blankClient}
          onSubmit={(data, { resetForm }) => {
            setClient(data);
            history.push("/");
          }}
        >
          {({ values, errors }) => (
            <Form>
              <CustomField
                name="name"
                type="input"
                label="Client Name"
                variant="outlined"
                style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              />

              <CustomField
                name="street"
                type="input"
                label="Street Address"
                variant="outlined"
                style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              />
              <CustomField
                name="postalCode"
                type="input"
                label="Postal Code"
                variant="outlined"
                style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              />
              <CustomField
                name="locality"
                type="input"
                label="Locality"
                variant="outlined"
                style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              />

              <CustomField
                name="phone"
                type="input"
                label="Phone number"
                variant="outlined"
                style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              />

              <div>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ margin: "0px 10px 10px 20px" }}
                >
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Grid>
    </TotalWrapper>
  );
};

export default ClientForm;
