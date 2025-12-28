export const createMetafieldDefinition = async ({ admin }, metaobjectDefinitionId) => {
  const response = await admin.graphql(
    `#graphql
      mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            name
            namespace
            key
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `,
    {
      variables: {
        definition: {
          name: "Custom Product",
          namespace: "custom",
          key: "custom_product",
          description: "Metaobject reference for product",
          type: "metaobject_reference",
          ownerType: "PRODUCT",
          validations: [
            {
              name: "metaobject_definition_id",
              value: JSON.stringify({
                metaobject_definition_id: metaobjectDefinitionId // replace with actual definition GID
              }),
            },
          ],
        },
      },
    }
  );

  const json = await response.json();

  // Check for errors
  if (
    json?.data?.metafieldDefinitionCreate?.userErrors &&
    json.data.metafieldDefinitionCreate.userErrors.length > 0
  ) {
    console.error(
      "Metafield creation errors:",
      json.data.metafieldDefinitionCreate.userErrors
    );
    return null;
  }

  return json.data;
};



export const getMetafieldDefinitions = async ({ admin }) => {
  const response = await admin.graphql(
    `#graphql
      query MetafieldsCount($id: ID!) {
        metafieldDefinition(id: $id) {
          id
          name
          description
          metafieldsCount
        }
      }
    `,
    {
      variables: {
        id: "gid://shopify/MetafieldDefinition/1071456212",
      },
    }
  );

  const json = await response.json();
  return json.data.metafieldDefinition;
};

export const setMetafields = async ({ admin }, ownerId, metaobjectId) => {
  const response = await admin.graphql(
    `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            ownerId: ownerId,                 // gid://shopify/Product/xxxx
            namespace: "custom",
            key: "product",
            type: "metaobject_reference",
            value: metaobjectId               // gid://shopify/Metaobject/xxxx
          }
        ]
      }
    }
  );

  const json = await response.json();
  return json.data;
};

