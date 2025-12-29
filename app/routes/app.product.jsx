import { authenticate } from "../shopify.server";
import ViewTable from "../components/ViewTable.jsx";

// =======================
// LOADER
// =======================
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

// =======================
// ACTION (DELETE)
// =======================
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const id = formData.get("id");

  if (!id) {
    return { success: false, error: "Missing metaobject ID" };
  }

  const deleteResponse = await admin.graphql(
    `#graphql
      mutation MetaobjectDelete($id: ID!) {
        metaobjectDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: { id },
    }
  );

  const result = await deleteResponse.json();
  return { success: true, result };
};

export default function AppViewTable() {
  return <ViewTable />;
}
