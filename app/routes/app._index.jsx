import React from 'react'
import {
  Card,
  Box, Page
} from "@shopify/polaris";
import DiscountTable from '../components/DiscountTable';
import Placeholder from '../components/Placeholder';

const App = () => {

  return (
    <Page fullWidth>
      <Card >

        <Box paddingBlockStart="200">

          <Placeholder component={
            <DiscountTable />
          }
            marginTop='0'
            padding='30px'
            marginBottom='20px'
          />

        </Box>

      </Card>
    </Page>



  )
}



export default App

