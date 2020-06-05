import * as yup from "yup";

// Mock worker object to be included in the PDF file
export const mockWorker = {
  name: "James Bearden",
  street: "2624 Breezewood Court",
  postalCode: "67202",
  locality: "Wichita, KS",
  phone: "+351 985 154 875",
  job: "Web Designer",
  jobDescription: "Optimal development for all devices",
};

export function formatMoney(number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}

const currencyRegex = /^\d+(?:\.\d{0,2})?$/; // only 2 decimal values, separated by a dot . (eg: 23300.12)

export const estimateItemValidationSchema = yup.object({
  quantity: yup
    .number()
    .moreThan(0)
    .positive("Quantity must be a positive number")
    .integer("Quantity must be an integer")
    .required("Quantity is a required field"),
  metric: yup.string(),
  metricPrice: yup
    .string()
    .matches(
      currencyRegex,
      "Use the dot (.) for decimal values. Only numbers are allowed."
    )
    .required("Price per unit metrics is a required field"),
  workDescription: yup
    .string()
    .required("Description of the work to be done is a required field"),
});

// creation of an object to be read from the pdfmake library API
/**
 * Creates an object dinamycally to be used with the pdfmake library API to generate a PDF file
 * @param worker object: `name:string`, `street:string`, `postalCode:string`, `locality:string`, `phone:string`, `job:string` & `jobDescription:string`
 * @param client object: `name:string`, `street:string`, `postalCode:string`, `locality:string` & `phone:string`
 * @param estimateItems array<estimateItem object>: `quantity:number`, `metric:string`, `metricPrice:string` & `workDescription:string`
 * @param tax number: ranging from 0 to 1 (eg: 23% tax is represented with 0.23)
 */
export function generateEstimatePDF(worker, client, estimateItems, tax) {
  let { subtotalCost, taxCost, totalCost } = calcEstimateCost();
  let todayDateFormatted = getTodayDate("/");

  let estimateContentFormatted = estimateItems.map(formatEstimateItems);

  // Total cost of the estimate - to be added in the end of the document
  let totalCostFormatted = [
    {
      text: `Subtotal\nTAX (${String(tax * 100)}%)\nTotal`,
      colSpan: 2,
      rowSpan: 2,
      bold: true,
      fontSize: 13,
      color: "black",
      alignment: "right",
    },
    { text: "" },
    {
      fontSize: 13,
      text: `${formatMoney(subtotalCost)}\n${formatMoney(
        taxCost
      )}\n${formatMoney(totalCost)}`,
      colSpan: 3,
      rowSpan: 2,
    },
    { text: "" },
    { text: "" },
  ];

  // PDF filler
  let pdfFiller = [
    {
      text: "",
    },
    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" },
  ];

  // Object to be passed to pdfmake library, built accordingly to their API
  let estimatePDF = {
    footer: {
      text: `${worker.street}\n${worker.postalCode} ${worker.locality}`,
      bold: true,
      alignment: "center",
    },
    content: [
      {
        text: `${worker.name}`,
        style: "header",
        alignment: "center",
        lineHeight: 1.2,
      },
      {
        text: `${worker.phone}`,
        style: "subheader2",
        alignment: "center",
        lineHeight: 1.4,
      },
      {
        text: `${worker.jobDescription}`,
        style: "subheader",
        alignment: "center",
        lineHeight: 1.2,
      },
      {
        text: `${worker.job}`,
        style: "subheader2",
        alignment: "center",
        lineHeight: 1.4,
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 595 - 2 * 40,
            y2: 5,
            lineWidth: 2,
          },
        ],
      },
      {
        text: "\nESTIMATE",
        bold: true,
        alignment: "center",
        fontSize: 13,
        lineHeight: 1.2,
      },
      {
        alignment: "center",
        columns: [
          {
            width: "*",
            text: "Client",
            bold: true,
          },

          {
            width: "*",
            text: todayDateFormatted,
            bold: true,
          },
        ],
      },
      {
        text: `${client.name}\n${client.street}\n${client.postalCode} ${client.locality}\n${client.phone}`,
        margin: [70, 5, 20, 20],
      },
      {
        style: "tableExample",
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "gray";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "black" : "gray";
          },
        },
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto", "auto"],
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          body: [
            [
              { text: "Qty", style: "tableHeader" },
              { text: "Metric", style: "tableHeader" },
              { text: "Description", style: "tableHeader" },
              { text: "Unit price", style: "tableHeader" },
              { text: "Total price", style: "tableHeader" },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "justify",
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      subheader2: {
        fontSize: 13,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        alignment: "center",
      },
    },
  };

  estimateContentFormatted.push(totalCostFormatted);
  estimateContentFormatted.push(pdfFiller);

  // Inserting estimate items, their total and the filler into the existing PDF table created in the estimatePDF object
  for (let item of estimateContentFormatted) {
    estimatePDF.content[8].table.body.push(item);
  }

  return estimatePDF;

  function calcEstimateCost() {
    let subtotalCost = estimateItems.reduce((acc, item) => {
      return acc + Number(item.metricPrice) * Number(item.quantity);
    }, 0);
    subtotalCost = Number(subtotalCost.toFixed(2));
    let taxCost = Number((subtotalCost * tax).toFixed(2));
    let totalCost = Number((subtotalCost + subtotalCost * tax).toFixed(2));

    return { subtotalCost, taxCost, totalCost };
  }

  function formatEstimateItems(item) {
    let itemTotalPrice = (item.metricPrice * item.quantity).toFixed(2);

    return [
      { text: item.quantity, alignment: "center" },
      item.metric ? { text: item.metric, alignment: "center" } : "",
      item.workDescription,
      { text: item.metricPrice, alignment: "center" },
      { text: itemTotalPrice, alignment: "center" },
    ];
  }
}

export function getTodayDate(separator) {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); // January == 0
  let yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  today = `${dd}${separator}${mm}${separator}${yyyy}`;

  return today;
}

export function translateComponent(component, lang = "pt") {
  return component[lang];
}
