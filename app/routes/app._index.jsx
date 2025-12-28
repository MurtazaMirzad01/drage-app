import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import AppView from "../components/AppView.jsx";
import { getMetaobjectDefinition, createMetaobjectDefinition, createMetaobject, updateMetaobject, deleteMetaobject } from "../services/metaobject.gq.js";
import { createMetafieldDefinition, getMetafieldDefinitions, setMetafields } from "../services/metafield.gq.js";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const {
    data: { metaobjectDefinition },
  } = await getMetaobjectDefinition({ admin });
  if (!metaobjectDefinition) {
    const {
      data: { metaobjectDefinitionCreate: { metaobjectDefinition }, },
    } = await createMetaobjectDefinition({ admin });
    if (metaobjectDefinition) {
      await createMetafieldDefinition({ admin, metaobjectDefinitionId: metaobjectDefinition.id });
      await createMetafieldDefinition({ admin, metaobjectDefinitionId: metaobjectDefinition.id, ownerType: "PRODUCT" });
    }
  }
};
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const value = formData.get("value");
  const products = (formData.get("product"));
  const metaobjectId = formData.get("metaobjectId");

  console.log("Action received data:", { name, value, products, metaobjectId });

  // Create the metaobject
  const createdMetaobjectResponse = await createMetaobject(
    { admin },
    { name, value, data: { products } }
  );

  const createdMetaobject = createdMetaobjectResponse?.metaobjectCreate?.metaobject;

  if (!createdMetaobject) {
    console.error("Failed to create metaobject");
    return null;
  }

  console.log("Created Metaobject:", createdMetaobject);

  // Set metafields for each product
  for (const product of products) {
    const setMetafieldResponse = await setMetafields(
      { admin },
      product.id,
      createdMetaobject.id
    );

    console.log(
      `Set metafield for product ${product.id}:`,
      setMetafieldResponse
    );
  }

  return null;
};

export default function Index() {
  return <AppView />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
