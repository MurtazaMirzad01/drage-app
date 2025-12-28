import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import AppView from "../components/AppView.jsx";
import { getMetaobjectDefinition, createMetaobjectDefinition, createMetaobject, updateMetaobject, deleteMetaobject } from "../services/metaobject.gq.js";
import { createMetafieldDefinition, getMetafieldDefinitions, setMetafields } from "../services/metafield.gq.js";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const { admin } = await authenticate.admin(request);
  // 1️⃣ Check if metaobject definition exists
  const definitionResponse = await getMetaobjectDefinition({ admin });
  let metaobjectDefinition = definitionResponse?.data?.metaobjectDefinitionByType;

  // 2️⃣ If definition does not exist, create it
  if (!metaobjectDefinition) {
    const createdDefinitionResponse = await createMetaobjectDefinition({ admin });
    metaobjectDefinition = createdDefinitionResponse?.metaobjectDefinitionCreate?.metaobjectDefinition;

    if (!metaobjectDefinition) {
      console.error("Failed to create metaobject definition");
      return null;
    }
  }
  return null;
};
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  return <AppView />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
