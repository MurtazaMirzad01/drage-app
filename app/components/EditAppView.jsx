import { Form, useFetcher, useLoaderData } from "react-router";
import { useState } from "react";
export default function EditAppView() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  console.log("Loader Data:", loaderData);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);

  const existingBundles = loaderData?.data || [];
  const hasProducts = existingBundles.length > 0;
  console.log("===========================================");
  console.log("Existing Products:", existingBundles);
  console.log("Has Products:", hasProducts);
  console.log("===========================================");
  function handleSubmit(event) {
    event.preventDefault();

    fetcher.submit(
      {
        name,
        value,
        product: JSON.stringify(products),
        actionType: "create",
      },
      { method: "post" }
    );

    console.log("Form submitted");
    setName("");
    setValue("");
    setProducts([]);
  }


  function handleDiscard() {
    console.log("Form reset");
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
    <s-page heading="Dashboard">
      <s-section>
        <s-heading>Enter product Details</s-heading>
        <Form
          data-save-bar
          onSubmit={handleSubmit}  // Changed from string to function
          onReset={handleDiscard}  // Changed from string to function
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
        </Form>
        {hasProducts && (
          <s-section>
            <s-table>
              <s-table-header-row>
                <s-table-header>Name</s-table-header>
                <s-table-header>Value</s-table-header>
                <s-table-header>Actions</s-table-header>
              </s-table-header-row>
              <s-table-body>
                {existingBundles.map((product) => (
                  <s-table-row key={product.id}>
                    <s-table-cell>{product.name}</s-table-cell>
                    <s-table-cell>{product.value}</s-table-cell>
                    <s-table-cell>
                      <s-button
                        variant="destructive"
                        onClick={() => {
                          // Handle delete action
                        }}
                      >
                        Delete
                      </s-button>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          </s-section>
        )}

      </s-section>
    </s-page>
  );
}