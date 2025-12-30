import { Form, useFetcher, useLoaderData } from "react-router";
import { useState, useEffect } from "react";


export default function EditAppView({ id }) {

  const fetcher = useFetcher();
  const loaderData = useLoaderData();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);

  const existingBundles = loaderData?.data || [];
  const hasProducts = existingBundles.length > 0;
  console.log("===========================================");
  console.log("Existing Products:", existingBundles);
  console.log("Has Products:", hasProducts);
  console.log("===========================================");

  useEffect(() => {
    const metaobjects =
      loaderData?.getData?.data?.metaobjects?.edges || [];

    const data = metaobjects.map(({ node }) => {
      const nameField = node.fields.find((f) => f.key === "name");
      const valueField = node.fields.find((f) => f.key === "value");
      const productField = node.fields.find((f) => f.key === "data");
      console.log("===================================");
      console.log("EditAppView ID:", id);
      console.log("===================================");

      return {
        id: node.id,
        name: nameField?.value || "",
        value: valueField?.value || "",
        products: productField?.value ? JSON.parse(productField.value) : [],
      };
    });
    setName(data[0]?.name || "");
    setValue(data[0]?.value || "");
    setProducts(data[0]?.products || []);
  }, [loaderData]);
  console.log("===========================================================================");
  console.log("loaderData: ", loaderData);
  console.log("===========================================================================");


  function handleSubmit(event) {
    event.preventDefault();

    fetcher.submit(
      {
        name: name,
        value: value,
        product: JSON.stringify(products),
        id: id,
        actionType: "update",
      },
      { method: "post" }
    );

    console.log("Form submitted");
    setName("");
    setValue("");
    setProducts([]);
  }



  async function handleProductBrowse() {
    const selected = await shopify.resourcePicker({
      multiple: true,
      type: "product"
    });

    console.log("-----------------------");
    console.log(selected);
    console.log("-----------------------");

    setProducts(prevProducts => {
      const existingIds = new Set(prevProducts.map(p => p.id));
      const newProducts = selected.filter(
        product => !existingIds.has(product.id)
      );
      return [...prevProducts, ...newProducts];
    });
  }
  function handleRemoveProductFromCard(productId) {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  }

  return (
    <>
      <s-button
        icon="edit"
        commandFor="modal"
        command="--show"
      >

      </s-button>

      <s-modal
        id="modal"
      >

        <s-stack gap="base">
          <s-query-container>
            <s-grid gridTemplateColumns="@container (inline-size > 500px) 1fr 1fr, 1fr" gap="base">
              <s-grid-item>
                <s-text-field
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />                </s-grid-item>
              <s-grid-item>
                <s-text-field
                  label="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />                </s-grid-item>
            </s-grid>
          </s-query-container>
          <s-stack gap="base" direction="inline" align="center">
            <s-text>Please select a product: </s-text>
            <s-button onClick={handleProductBrowse} >Browse</s-button>
          </s-stack>
          {products.length > 0 && (
            <s-stack
              gap="small-300"
              padding="small-300"
            >
              {products.map((product) => (
                <s-stack key={product.id} direction="inline" gap="base" border="base" borderStyle="dotted" padding="small-300" justifyContent="space-between">
                  <s-stack direction="inline" gap="base" >
                    <s-box inlineSize="50px" blockSize="50px">
                      <s-image
                        src={product.images?.[0]?.originalSrc || ''}
                        alt={product.title}
                        aspectRatio="1/0.5"
                      />
                    </s-box>
                    <s-box>
                      <s-text>{product.title}</s-text>
                      <s-paragraph>{product.publishedAt}</s-paragraph>
                    </s-box>
                  </s-stack>
                  <s-stack>
                    <s-icon
                      type="x"
                      onClick={() => handleRemoveProductFromCard(product.id)}
                    >
                    </s-icon>
                  </s-stack>
                </s-stack>
              ))}
            </s-stack>
          )}

        </s-stack>

        <s-button slot="secondary-actions" commandFor="modal" command="--hide">
          Close
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="modal"
          command="--hide"
          onClick={handleSubmit}
        >
          Save
        </s-button>

      </s-modal>
    </>
  );
}