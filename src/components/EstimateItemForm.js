import React from "react";
import { Formik, Form, useField } from "formik";
import { TextField, Button, InputAdornment, Grid } from "@material-ui/core";
import { estimateItemValidationSchema } from "../helpers/helpers";
import estimateStore from "../stores/estimateStore";

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

const EstimateItemForm = () => {
  const { addEstimateItem } = estimateStore();

  return (
    <Grid container>
      <Formik
        validateOnChange={true}
        validationSchema={estimateItemValidationSchema}
        initialValues={{
          quantity: "",
          metric: "",
          metricPrice: "",
          workDescription: "",
        }}
        onSubmit={(data, { resetForm }) => {
          addEstimateItem(data);
          resetForm();
        }}
      >
        {({ values, errors }) => (
          <Form>
            <CustomField
              required
              name="quantity"
              type="number"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px 10px 10px 20px", width: "220px" }}
            />

            <CustomField
              name="metric"
              type="input"
              label="Metric"
              variant="outlined"
              style={{ margin: "20px 10px 10px 0px", width: "220px" }}
            />
            <CustomField
              required
              name="metricPrice"
              type="input"
              label="Price per unit metrics"
              variant="outlined"
              style={{ margin: "20px 10px 10px 0px", width: "220px" }}
              inputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
            />
            <div>
              <CustomField
                required
                name="workDescription"
                type="input"
                label="Description of the work"
                variant="outlined"
                style={{ margin: "20px 20px", width: "680px" }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              style={{ margin: "0px 10px 10px 20px" }}
            >
              Add
            </Button>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default EstimateItemForm;
