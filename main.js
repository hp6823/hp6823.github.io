// Load and visualize data with brushing
const makeColorURL = "/data/make_and_color.csv";
// const spatialDataURL = "data/tow_location_coordinates.csv";

vegaEmbed("#vis1", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "url": makeColorURL },
  "vconcat": [
    {
      "width": 600,
      "height": 150,
      "mark": "area",
      "encoding": {
        "x": {
        "field": "Tow Date",
        "type": "temporal",
        "title": "Select Time Range"
        },
        "y": {
        "aggregate": "sum",
        "field": "Count",
        "type": "quantitative",
        "title": "Towed Vehicles"
        }
      },
      "selection": {
        "brush": { "type": "interval", "encodings": ["x"] }
      }
    },
    {
    "hconcat": [
      {
        "width": 300,
        "height": 330,
        "data": { "url": makeColorURL },
        "title": {
          "text": "Tow Volume by Vehicle Make",
          "anchor": "middle",
          "fontSize": 16,
          "color": "#333",
          "align": "center"
        },
        "transform": [
          { "filter": { "selection": "brush" } },
          {
            "aggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }],
            "groupby": ["Make"]
          },
          { "sort": [{ "field": "TotalCount", "order": "descending" }] },
          { "window": [{ "op": "rank", "as": "Rank" }] },
          { "filter": "datum.Rank <= 10" }
        ],
        "mark": "bar",
        "encoding": {
          "y": {
            "field": "Make",
            "type": "nominal",
            "sort": "-x",
            "title": "Top 10 Vehicle Makes"
          },
          "x": {
            "field": "TotalCount",
            "type": "quantitative",
            "title": "Tow Count"
          },
          "color": { "value": "#5276A7" }
        }
      },
      {
        "width": 300,
        "height": 330,
        "data": { "url": makeColorURL },
        "title": {
          "text": "Tow Volume by Vehicle Color",
          "anchor": "middle",
          "fontSize": 16,
          "color": "#333",
          "align": "center"
        },
        "transform": [
          { "filter": { "selection": "brush" } },
          {
            "aggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }],
            "groupby": ["Color"]
          },
          { "sort": [{ "field": "TotalCount", "order": "descending" }] },
          { "window": [{ "op": "rank", "as": "Rank" }] },
          { "filter": "datum.Rank <= 10" }
        ],
        "mark": "bar",
        "encoding": {
          "y": {
            "field": "Color",
            "type": "nominal",
            "sort": "-x",
            "title": "Top 10 Vehicle Colors"
          },
          "x": {
            "field": "TotalCount",
            "type": "quantitative",
            "title": "Tow Count"
          },
          "color": { "value": "#DE5F5F" }
        }
      }
    ]
    }
  ]
}).catch(console.error);

const realMapURL = "/data/IL_lat_lon_color.csv";
const geoShapeURL = "/data/chicago_comm_areas_cleaned.geojson";

vegaEmbed("#vis2", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Tow Volume by Location in Chicago (Filtered by Color)",
    "anchor": "start",
    "fontSize": 20,
    "fontWeight": "bold"
  },
  "width": 600,
  "height": 500,
  "params": [
    {
      "name": "colorFilter",
      "bind": {
        "input": "select",
        "options": [
          "All", "BLK", "WHI", "SIL", "RED", "GRY", "BLU", "GRN",
          "BRO", "BGE", "YEL", "ONG", "GLD", "MAR", "PLE", "PNK", "TAN", "TRQ", "ZZZ"
        ],
        "labels": [
          "All Colors", "Black", "White", "Silver", "Red", "Gray", "Blue", "Green",
          "Brown", "Beige", "Yellow", "Orange", "Gold", "Maroon", "Purple", "Pink", "Tan", "Teal", "Unknown"
        ],
        "name": "Filter by Color: "
      },
      "value": "All"
    }
  ],
  "projection": {
    "type": "mercator",
    "center": [-87.6298, 41.8781],
    "scale": 50000
  },
  "layer": [
    {
      "data": { "url": geoShapeURL },
      "mark": {
        "type": "geoshape",
        "fill": "#e0e0e0",
        "stroke": "#aaa",
        "strokeWidth": 0.5
      }
    },
    {
      "data": { "url": realMapURL },
      "transform": [
        { "filter": "colorFilter == 'All' || datum.Color == colorFilter" }
      ],
      "mark": {
        "type": "circle",
        "opacity": 0.85,
        "stroke": "#333",
        "strokeWidth": 0.4
      },
      "encoding": {
        "longitude": { "field": "Longitude", "type": "quantitative" },
        "latitude": { "field": "Latitude", "type": "quantitative" },
        "size": {
          "field": "Count",
          "type": "quantitative",
          "scale": { "range": [50, 1000] }
        },
        "color": {
          "field": "Count",
          "type": "quantitative",
          "scale": { "scheme": "reds" },
          "legend": { "title": "Tow Count" }
        },
        "tooltip": [
          { "field": "Towed to Address Lower", "type": "nominal" },
          { "field": "Count", "type": "quantitative" },
          { "field": "Color", "type": "nominal" }
        ]
      }
    }
  ]
}).catch(console.error);

const towsData = "data/filtered_towed_vehicles.csv"; // Use your preprocessed file

vegaEmbed("#vis3", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "vconcat": [
    {
      "width": 600,
      "height": 200,
      "title": "Tow Volume Over Time (Brush to Filter)",
      "mark": "line",
      "encoding": {
        "x": { "field": "Tow Date", "type": "temporal", "title": "Tow Date" },
        "y": { "aggregate": "count", "type": "quantitative", "title": "Tows per Day" },
        "opacity": {
          "condition": { "selection": "brush", "value": 1 },
          "value": 0.2
        }
      },
      "selection": {
        "brush": { "type": "interval", "encodings": ["x"] }
      },
      "data": { "url": towsData }
    },
    {
      "width": 600,
      "height": 200,
      "title": "Tows by Weekday (Filtered by Time Brush)",
      "mark": "bar",
      "transform": [
        { "filter": { "selection": "brush" } }
      ],
      "encoding": {
        "x": {
          "field": "Weekday",
          "type": "nominal",
          "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "title": "Tow Count"
        },
        "color": { "field": "Weekday", "type": "nominal" }
      },
      "data": { "url": towsData }
    }
  ]
}).catch(console.error);

const dropdownData = "data/make_and_color_filtered.csv";

vegaEmbed("#vis4", {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Top Vehicle Makes by Selected Color",
    "anchor": "start",
    "fontSize": 16,
    "fontWeight": "bold"
  },
  "params": [
    {
      "name": "colorFilter",
      "bind": {
        "input": "select",
        "options": [
          "All", "BLK", "BLU", "GRY", "RED", "SIL", "WHI"
        ],
        "labels": [
          "All Colors", "Black", "Blue", "Gray", "Red", "Silver", "White"
        ],
        "name": "Filter by Color: "
      },
      "value": "All"
    }
  ],
  "vconcat": [
    {
      "data": { "url": dropdownData },
      "transform": [
        { "filter": "colorFilter == 'All' || datum.Color == colorFilter" },
        {
          "aggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }],
          "groupby": ["Make", "Color"]
        }
      ],
      "mark": "bar",
      "width": 400,
      "height": 400,
      "encoding": {
        "y": { "field": "Make", "type": "nominal", "sort": "-x" },
        "x": { "field": "TotalCount", "type": "quantitative" },
        "color": {
          "field": "Color",
          "type": "nominal",
          "legend": { "title": "Color" }
        }
      }
    },
    {
      "data": { "url": dropdownData },
      "transform": [
        { "filter": "colorFilter == 'All' || datum.Color == colorFilter" },
        {
          "aggregate": [{ "op": "sum", "field": "Count", "as": "TotalCount" }],
          "groupby": ["Make", "Color"]
        }
      ],
      "mark": "circle",
      "width": 500,
      "height": 500,
      "encoding": {
        "x": { "field": "Make", "type": "nominal" },
        "y": { "field": "TotalCount", "type": "quantitative" },
        "size": { 
          "field": "TotalCount", 
          "type": "quantitative",
          "scale": {
            "range": [25, 1000]
          }
        },
        "color": {
          "field": "Color",
          "type": "nominal"
        },
        "tooltip": [
          { "field": "Make", "type": "nominal" },
          { "field": "Color", "type": "nominal" },
          { "field": "TotalCount", "type": "quantitative", "title": "Count" }
        ]
      }
    }
  ]
}).catch(console.error);

  