import { useLoaderData, useFetcher } from "react-router";

export default function ViewTable() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const metaobjects =
    loaderData?.getData?.data?.metaobjects?.edges || [];

  const data = metaobjects.map(({ node }) => {
    const nameField = node.fields.find((f) => f.key === "name");
    const valueField = node.fields.find((f) => f.key === "value");

    return {
      id: node.id,
      name: nameField?.value || "N/A",
      value: valueField?.value || "N/A",
    };
  });

  // Optional reload after delete
  if (fetcher.state === "idle" && fetcher.data?.success) {
    window.location.reload();
  }

  return (
    <s-section>
      <s-table>
        <s-table-header-row>
          <s-table-header>Name</s-table-header>
          <s-table-header>Value</s-table-header>
          <s-table-header>Actions</s-table-header>
        </s-table-header-row>

        <s-table-body>
          {data.map((item) => (
            <s-table-row key={item.id}>
              <s-table-cell>{item.name}</s-table-cell>
              <s-table-cell>{item.value}</s-table-cell>
              <s-table-cell>
                <fetcher.Form method="post">
                  <input type="hidden" name="id" value={item.id} />
                  <s-button type="submit" variant="destructive" tone="critical" icon="delete">
                  </s-button>
                </fetcher.Form>
              </s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>
    </s-section>
  );
}
