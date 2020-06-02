import React from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { formatMoney } from "../helpers/helpers";
import estimateStore from "../stores/estimateStore";

const EstimateListItemsDisplay = ({ description, qty, price, metric }) => {
  let { estimateItems, removeEstimateItem } = estimateStore();

  return (
    <ListItem>
      <ListItemText
        primary={description}
        secondary={
          `Quantity: ${qty} | Price per unit metrics: ${formatMoney(price)}` +
          (metric ? ` | Metric: ${metric}` : "")
        }
      />

      <ListItemSecondaryAction>
        <IconButton
          onClick={() => {
            // eslint-disable-next-line array-callback-return
            estimateItems.filter(function deleteItem(item, i) {
              let itemFound = item.workDescription.includes(description);
              if (itemFound) {
                removeEstimateItem(i);
              }
            });
          }}
          edge="end"
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
export const EstimateListDisplay = () => {
  let { estimateItems } = estimateStore();

  return (
    <Grid container justify="center">
      <Grid item xs={4} sm={5} md={6} lg={6}>
        <List>
          {estimateItems.map((item) =>
            React.cloneElement(<EstimateListItemsDisplay />, {
              key: item.workDescription,
              description: item.workDescription,
              metric: item.metric,
              qty: item.quantity,
              price: item.metricPrice,
            })
          )}
        </List>
      </Grid>
    </Grid>
  );
};
