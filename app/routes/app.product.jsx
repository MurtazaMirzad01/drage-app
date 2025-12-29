import { authenticate } from "../shopify.server";
import ViewTable from "../components/ViewTable.jsx";
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const getResponse = await admin.graphql(
    `#graphql
      query {
        metaobjects(type: "custom_product", first: 100) {
          edges {
            node {
              id
              type
              fields {
                key
                value
              }
            }
          }
        }
      }`
  );

  const getData = await getResponse.json();
  return { getData };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const mode = formData.get("_mode");
  const id = formData.get("id");

  // DELETE
  if (mode === "delete") {
    const res = await admin.graphql(
      `#graphql
        mutation MetaobjectDelete($id: ID!) {
          metaobjectDelete(id: $id) {
            deletedId
            userErrors {
              field
              message
            }
          }
        }`,
      { variables: { id } }
    );
    return await res.json();
  }

  // UPDATE (FIXED VERSION)
  if (mode === "update") {
    const name = formData.get("name");
    const value = formData.get("value");

    const res = await admin.graphql(
      `#graphql
        mutation UpdateMetaobject(
          $id: ID!
          $fields: [MetaobjectFieldInput!]!
        ) {
          metaobjectUpdate(id: $id, metaobject: { fields: $fields }) {
            metaobject {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`,
      {
        variables: {
          id,
          fields: [
            { key: "name", value: name },
            { key: "value", value: value },
          ],
        },
      }
    );

    return await res.json();
  }

  return { error: "Unknown mode" };
};


export default function AppViewTable() {
  return <ViewTable />;
}
