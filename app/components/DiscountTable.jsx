import React, { useCallback, useEffect, useState } from 'react';
import {
  IndexTable,
  Card,
  Text,
  useBreakpoints,
  Button,
  ButtonGroup,
  Box,
  Icon, SkeletonBodyText, LegacyCard
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import DeleteModal from './DeleteModal';
import EditOrCreateModal from './EditOrCreateModal';
export default function DiscountTable({ type }) {
  const [isDeleting, setDeleting] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  const [discountData, setDiscountData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setActive] = useState(false);
  const [updateData, setUpdateData] = useState(null)


  useEffect(() => {
    const getDiscountData = async () => {
      try {
        let response;
        if (type === 'alternativeDiscounts' ) {
          response = await fetch(`/api/getDiscounts/${'alternativeDiscount'}`, {
            method: "GET",
          });
        } else {
          response = await fetch(`/api/getDiscounts/${'evenItemsDiscount'}`, {
            method: "GET",
          });
        }


        if (response.ok) {
          const jsonData = await response.json();
          const { gotDiscount } = jsonData;
          // console.log('jsonData from getDiscounts',type,'  ', gotDiscount);
          setDiscountData(gotDiscount);
        } else {
          console.error('Failed to fetch discounts:', response.statusText);
        }
      } catch (error) {
        console.error('Error in getDiscountData:', error);
      } finally {
        setIsLoading(false);
      }
    };


    isActive === false && getDiscountData();
  }, [isActive]);


  const handleCreateDiscount = () => {
    setActive(true)
  }

  const handleEditDiscount = (id) => {
    // console.log(`Editing discount with ID ${id}`);
    const dataForUpdate = discountData.filter(dD => dD._id === id)
    // console.log(`dataForUpdate..................... ${dataForUpdate}`);
    setActive(true)
    setUpdateData(dataForUpdate)
  };

  const handleDeleteDiscount = async () => {
    // console.log(`Deleting discount with ID ${deleteID}`);
    const dataForDelete = discountData.filter(dD => dD._id === deleteID)

    try {
      // console.log('hit deleteadf');
      setDeleting(false)
      let response;
      if (type === 'alternativeDiscounts') {
        response = await fetch('/api/deleteDiscount', {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...dataForDelete[0], type })
        })
      } else {
        response = await fetch('/api/deleteDiscount', {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...dataForDelete[0], type })
        })
      }

      if (response.status >= 200 && response.status <= 299) {
        const jsonData = await response.json()
        // console.log('jsonData for delete', jsonData);
        const updatedData = discountData.filter(dD => dD._id !== deleteID)
        setDiscountData(updatedData)
        setDeleteID(null)
      }
    } catch (error) {
      console.log('error', error);
    }

  };

  const toggleDeleteModal = useCallback((id) => {
    setDeleteID(id)
    setDeleting((isDeleting) => !isDeleting)
  }, []);


  const rowMarkup = discountData?.map(
    ({
      _id,
      discountTitle,
      discountValueType,
      discountValue,
    }, i) => (
      <IndexTable.Row
        id={_id}
        key={_id}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {discountTitle}
          </Text>
        </IndexTable.Cell>
        {type === 'alternativeDiscounts' && <IndexTable.Cell>{discountValueType}</IndexTable.Cell>}
        <IndexTable.Cell>{discountValue}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              icon={<Icon source={EditIcon} />}
              onClick={() => handleEditDiscount(_id)}

            />
            {type === 'alternativeDiscounts' && <Button
              icon={<Icon source={DeleteIcon} />}
              onClick={() => toggleDeleteModal(_id)}
              tone='critical'
            />}
          </ButtonGroup>
        </IndexTable.Cell>

      </IndexTable.Row>
    )
  );

  return (
    <Box width='80%' >
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '30px' }}>
        <Text variant="headingLg" as="h5">
          {type === 'evenItemsDiscount' ? 'Even-Numbered Items Discount' : 'Alternative Discounts'}
        </Text>
        {(discountData.length < 1 || type !== 'evenItemsDiscount') && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonGroup>
            <Button variant="primary" onClick={handleCreateDiscount}>{type === 'evenItemsDiscount' ? 'Create Discount' : 'Add Discount'}</Button>
          </ButtonGroup>
        </div>}
      </div>

      <div className='table' style={{ marginBottom: '26px' }}>

        {isLoading ?
          <Box paddingBlockStart="200">
            <SkeletonBodyText
              lines={6}
            />
          </Box>
          :
          <Card
            padding={{ xs: '80', sm: '95' }}
          >
            <IndexTable
              itemCount={discountData.length}
              headings={[
                { title: 'Discount Title' },
                ...(type === 'alternativeDiscounts' ?
                  (
                    [
                      { title: 'Discount Type' },
                      { title: 'Discount Value' }
                    ]

                  ) :
                  [
                    { title: 'Discount Percentage Value' }
                  ]
                ),
                { title: 'Action' }

              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        }
      </div>
      <EditOrCreateModal
        isActive={isActive}
        setActive={setActive}
        type={type}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
      <DeleteModal
        isDeleting={isDeleting}
        setDeleting={setDeleting}
        toggleDeleteModal={toggleDeleteModal}
        handleDeleteDiscount={handleDeleteDiscount}
      />
    </Box >
  );
}

