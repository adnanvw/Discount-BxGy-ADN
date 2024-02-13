import React, { useCallback, useState } from 'react'
import {
  Card,
  Box, Tabs, Page
} from "@shopify/polaris";
import DiscountForm from '../components/DiscountForm';
import DiscountTable from '../components/DiscountTable';
import Placeholder from '../components/Placeholder';

const App = () => {
  const [selected, setSelected] = useState(0);
  const [updateData, setUpdateData] = useState(null)

  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelected(selectedTabIndex)
      selectedTabIndex === 0 && setUpdateData(null)
    },
    [],
  );

  const tabs = [
    {
      id: 'created_discount_data',
      content: 'Discount Table',
      component: <DiscountTable
        setSelected={setSelected}
        setUpdateData={setUpdateData}
      />,
    },
    {
      id: 'form_to_create_discount',
      content: 'Discount Form',
      component: <DiscountForm
        setSelected={setSelected}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />,
    },
  ];


  return (
    <Page fullWidth>

      <Card >

        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Box paddingBlockStart="200">

            <Placeholder component={tabs[selected].component}
              marginTop='0'
              padding='30px'
              marginBottom='20px'
            />


          </Box>

        </Tabs>

      </Card>
    </Page>



  )
}



export default App

