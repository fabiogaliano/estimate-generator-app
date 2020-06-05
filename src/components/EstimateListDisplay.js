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
import { translateComponent } from "../helpers/helpers";
import translations from "../helpers/translations";
import languageStore from "../stores/languageStore";

const EstimateListItemsDisplay = ({ description, qty, price, metric }) => {
  let {
    estimateItems,
    removeEstimateItem,
    setCurrentInput,
    setIndex,
  } = estimateStore();
  let { language } = languageStore();
  let { estimateListDisplay } = translations;

  return (
    <ListItem
      onDoubleClick={() => {
        let returnedItem = estimateItems.find((item) => {
          return item.workDescription.includes(description);
        });
        let returnedItemIndex = estimateItems.findIndex((item) => {
          return item.workDescription.includes(description);
        });

        let { quantity, metric, metricPrice, workDescription } = returnedItem;
        setCurrentInput(quantity, metric, metricPrice, workDescription);
        setIndex(returnedItemIndex);
      }}
    >
      <ListItemText
        primary={description}
        secondary={
          `${translateComponent(
            estimateListDisplay.quantity,
            language
          )}: ${qty} | ${translateComponent(
            estimateListDisplay.metricPrice,
            language
          )}: ${formatMoney(price)}` +
          (metric
            ? ` | ${translateComponent(
                estimateListDisplay.metric,
                language
              )}: ${metric}`
            : "")
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
