export const getMetaobjectDefinition = async ({ admin: { graphql } }) => {
  const response = await graphql(
    `#graphql
    query MetaobjectDefinitionByType($type: String!) {
      metaobjectDefinitionByType(type: $type) {
        id
        name
        type
        description
      }
    }
  `,
    {
      variables: {
        type: "custom_product",
      },
    },
  );
  return await response.json();
}
export const createMetaobjectDefinition = async ({ admin }) => {
  const response = await admin.graphql(
    `#graphql
      mutation CreateBundleMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition {
            id
            name
            type
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
          type: "custom_product",
          fieldDefinitions: [
            { name: "name", key: "name", type: "single_line_text_field" },
            { name: "value", key: "value", type: "multi_line_text_field" },
            { name: "data", key: "data", type: "json" },
          ],
        },
      },
    }
  );

  const json = await response.json();
  return json.data;
};

export const createMetaobject = async ({ admin }, { name, value, data }) => {
  const response = await admin.graphql(
    `#graphql
      mutation CreateMetaobject($input: MetaobjectCreateInput!) {
        metaobjectCreate(input: $input) {
          metaobject {
            id
            type
            handle
            fields {
              key
              value
            }
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
        input: {
          type: "custom_product",
          fields: [
            { key: "name", value: name },
            { key: "value", value: value },
            { key: "data", value: JSON.stringify(data) },
          ],
        },
      },
    }
  );

  return await response.json();
};

export const updateMetaobject = async ({ admin: { graphql } }, id, product) => {
  const response = await graphql(
    `#graphql
      mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject {
            id
            handle
            type
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
        id,
        metaobject: {
          fields: [
            { key: "name", value: product.name },
            { key: "value", value: product.value },
            { key: "data", value: JSON.stringify(product) },
          ],
        },
      },
    }
  );

  return (await response.json()).data;
};

export const deleteMetaobject = async ({ admin: { graphql } }, id) => {
  const response = await graphql(
    `#graphql
      mutation MetaobjectDelete($id: ID!) {
        metaobjectDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
            code
          }
        }
      }`,
    {
      variables: { id },
    }
  );

  return await response.json();
};

export const getMetaobject = async ({ admin: { graphql } }, id) => {
  const response = await graphql(
    `#graphql
      query Metaobject($id: ID!) {
        metaobject(id: $id) {
          id
          handle
          name: field(key: "name") { value }
          value: field(key: "value") { value }
          data: field(key: "data") { value }
        }
      }`,
    {
      variables: { id },
    }
  );

  return await response.json();
};
