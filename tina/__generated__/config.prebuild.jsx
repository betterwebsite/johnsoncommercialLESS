// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: "main",
  clientId: "70168c56-eee5-4c77-a613-0636ffccc0ad",
  // Not needed for local dev
  token: "b0e3a480ab22ab38ec5eb71a472903451aafb408",
  media: {
    loadCustomStore: async () => {
      return {
        async persist(files) {
          return files.map((file) => ({
            type: "file",
            filename: file.name
          }));
        },
        previewSrc: (fullPath) => `/assets/images/cms/${fullPath.filename}`
      };
    }
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public"
    // or your Eleventy output folder
  },
  schema: {
    collections: [
      {
        label: "Listings",
        name: "listings",
        path: "src/_data",
        format: "json",
        match: {
          include: ["listings"]
        },
        fields: [
          {
            type: "object",
            list: true,
            name: "listings",
            label: "Listings",
            fields: [
              { type: "string", name: "address", label: "Address" },
              {
                type: "string",
                name: "listing_type",
                label: "Listing Type",
                options: ["sale", "lease", "both", "sold"]
              },
              {
                type: "string",
                name: "property_type",
                label: "Property Type",
                options: ["Industrial", "Land", "Medical", "Office", "Retail", "Special Purpose", "Residential"]
              },
              { type: "string", name: "pdf_url", label: "PDF URL" },
              { type: "image", name: "image", label: "Featured Image" },
              {
                type: "object",
                list: true,
                name: "additional_images",
                label: "Additional Images",
                fields: [
                  { type: "image", name: "url", label: "Image" }
                ]
              },
              {
                type: "object",
                name: "price",
                label: "Price",
                fields: [
                  { type: "number", name: "sale_price", label: "Sale Price" },
                  { type: "string", name: "lease_rate", label: "Lease Rate" },
                  { type: "number", name: "price_per", label: "Price per SF" }
                ]
              },
              {
                type: "object",
                name: "misc",
                label: "Misc",
                fields: [
                  { type: "number", name: "traffic", label: "Traffic Count" },
                  { type: "number", name: "caprate", label: "Cap Rate" },
                  { type: "string", name: "zoning", label: "Zoning" },
                  { type: "string", name: "parcelid", label: "Parcel ID" }
                ]
              },
              {
                type: "object",
                name: "location",
                label: "Location",
                fields: [
                  { type: "string", name: "city", label: "City" },
                  { type: "string", name: "state", label: "State" },
                  { type: "string", name: "zipcode", label: "Zipcode" },
                  { type: "number", name: "lat", label: "Latitude" },
                  { type: "number", name: "lng", label: "Longitude" }
                ]
              },
              {
                type: "object",
                name: "buildings",
                label: "Buildings",
                list: true,
                fields: [
                  { type: "number", name: "square_feet", label: "Square Feet" },
                  { type: "number", name: "lot_acres", label: "Lot Size (Acres)" },
                  { type: "number", name: "year_built", label: "Year Built" }
                ]
              },
              {
                type: "object",
                name: "sections",
                label: "Additional Content",
                list: true,
                fields: [
                  { type: "string", name: "section_name", label: "Section Name" },
                  { type: "string", name: "section_description", label: "Section Description" }
                ]
              },
              { type: "rich-text", name: "description", label: "Description" },
              { type: "string", name: "agent_name", label: "Agent Name" }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
