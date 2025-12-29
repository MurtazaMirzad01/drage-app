export const createMetafieldDefinition = async ({
  admin: { graphql },
  metaobjectDefinitionId,
  ownerType,
}) => {
  const response = await graphql(
    `
      #graphql
      mutation CreateBundleOfferMetafieldDefinition(
        $definition: MetafieldDefinitionInput!
      ) {
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
          name: "custom_product",
          namespace: "custom",
          key: "custom_product",
          description: "bundle metaobject related",
          type: "metaobject_reference",
          ownerType: ownerType,
          validations: [
            {
              name: "metaobject_definition_id",
              value: metaobjectDefinitionId,
            },
          ],
        },
      },
    },
  );

  return response.data;
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

