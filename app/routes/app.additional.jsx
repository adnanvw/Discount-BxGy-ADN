import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
} from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page>
      
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
