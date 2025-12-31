import { Form, useFetcher, useLoaderData } from "react-router";
import { useState, useEffect } from "react";

export default function EditAppView({ id, modalId }) { // Accept modalId prop
  const fetcher = useFetcher();
  const loaderData = useLoaderData();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const metaobjects = loaderData?.getData?.data?.metaobjects?.edges || [];

    // Find the specific item by ID
    const foundItem = metaobjects.find(({ node }) => node.id === id);

    if (foundItem) {
      const node = foundItem.node;
      const nameField = node.fields.find((f) => f.key === "name");
      const valueField = node.fields.find((f) => f.key === "value");
      const productField = node.fields.find((f) => f.key === "data");

      setName(nameField?.value || "");
      setValue(valueField?.value || "");
      setProducts(productField?.value ? JSON.parse(productField.value) : []);
    }
  }, [loaderData, id]);

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
        commandFor={modalId} // Use the unique modal ID
        command="--show"
      >
      </s-button>

      <s-modal
        id={modalId} // Use the unique modal ID
      >
        {/* Modal content remains the same */}
        <s-stack gap="base">
          <s-query-container>
            <s-grid gridTemplateColumns="@container (inline-size > 500px) 1fr 1fr, 1fr" gap="base">
              <s-grid-item>
                <s-text-field
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </s-grid-item>
              <s-grid-item>
                <s-text-field
                  label="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </s-grid-item>
            </s-grid>
          </s-query-container>

          <s-stack gap="base" direction="inline" align="center">
            <s-text>Please select a product: </s-text>
            <s-button onClick={handleProductBrowse}>Browse</s-button>
          </s-stack>

          {products.length > 0 && (
            <s-stack gap="small-300" padding="small-300">
              {products.map((product) => (
                <s-stack key={product.id} direction="inline" gap="base" border="base" borderStyle="dotted" padding="small-300" justifyContent="space-between">
                  <s-stack direction="inline" gap="base">
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
                    ></s-icon>
                  </s-stack>
                </s-stack>
              ))}
            </s-stack>
          )}
        </s-stack>

        <s-button slot="secondary-actions" commandFor={modalId} command="--hide">
          Close
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          commandFor={modalId}
          command="--hide"
          onClick={handleSubmit}
        >
          Save
        </s-button>
      </s-modal>
    </>
  );
}