import React from 'react'
import {
  Card,
  Box, Page, Text
} from "@shopify/polaris";
import DiscountTable from '../components/DiscountTable';
import Placeholder from '../components/Placeholder';

const App = () => {

  return (
    <Page fullWidth>

      <Box paddingBlockStart="200">

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <Text variant="heading2xl" as="h3" >
            Manage Discounts
          </Text>
        </div>

        <Placeholder
          component={
            <DiscountTable
              type="evenItemsDiscount"
            />
          }
          marginTop='0'
          padding='30px'
          marginBottom='20px'
        />

        <Placeholder
          component={
            <DiscountTable
              type="alternativeDiscounts"
            />
          }
          marginTop='0'
          padding='30px'
          marginBottom='20px'
        />

      </Box>
    </Page>



  )
}



export default App

