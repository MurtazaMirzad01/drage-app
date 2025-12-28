const response = await admin.graphql(
  `#graphql
  mutation CreateMetaobjectDefinition(
    $definition: MetaobjectDefinitionCreateInput!
  ) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        name
        type
        fieldDefinitions {
          name
          key
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }`,
  {
    variables: {
      definition: {
        name: "Product Data",
        type: "product_data", // FIXED
        fieldDefinitions: [
          { name: "Hex", key: "hex", type: "single_line_text_field" },
          { name: "Value", key: "value", type: "single_line_text_field" },
          { name: "Data", key: "data", type: "json" }
        ],
      },
    },
  }
);

const json = await response.json();

const result = json.data.metaobjectDefinitionCreate;

if (result.userErrors.length > 0) {
  console.log("User Errors:", result.userErrors);
  throw new Error(result.userErrors[0].message);
}

return result.metaobjectDefinition;
