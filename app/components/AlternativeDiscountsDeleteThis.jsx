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
export default function AlternativeDiscounts({ setSelected }) {
  const [isDeleting, setDeleting] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  const [discountTypesData, setDiscountTypesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setActive] = useState(false);
  const [updateData, setUpdateData] = useState(null)

  // useEffect(() => {
  //   const getDiscountData = async () => {
  //     try {
  //       const response = await fetch('/api/getDiscounts', {
  //         method: "GET",
  //       });

  //       if (response.ok) {
  //         const jsonData = await response.json();
  //         const { gotDiscount } = jsonData;
  //         // console.log('jsonData from getDiscounts', gotDiscount);
  //         setDiscountTypesData(gotDiscount);
  //       } else {
  //         console.error('Failed to fetch discounts:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error in getDiscountData:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   isActive === false && getDiscountData();
  // }, [isActive]);


  const handleCreateDiscount = () => {
    setActive(true)
  }

  const handleEditDiscount = (id) => {
    // console.log(`Editing discount with ID ${id}`);
    const dataForUpdate = discountTypesData.filter(dD => dD._id === id)
    // console.log(`dataForUpdate..................... ${dataForUpdate}`);
    setActive(true)
    setUpdateData(dataForUpdate)
  };

  const handleDeleteDiscount = async () => {
    // console.log(`Deleting discount with ID ${deleteID}`);
    const dataForDelete = discountTypesData.filter(dD => dD._id === deleteID)

    try {
      // console.log('hit deleteadf');
      setDeleting(false)

      const response = await fetch('/api/deleteDiscount', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(...dataForDelete)
      })
      if (response.status >= 200 && response.status <= 299) {
        const jsonData = await response.json()
        // console.log('jsonData for delete', jsonData);
        const updatedData = discountTypesData.filter(dD => dD._id !== deleteID)
        setDiscountTypesData(updatedData)
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


  const rowMarkup = discountTypesData.map(
    ({
      _id,
      discountTitle,
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
        <IndexTable.Cell>{discountValue}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              icon={<Icon source={EditIcon} />}
              onClick={() => handleEditDiscount(_id)}

            />
            <Button
              icon={<Icon source={DeleteIcon} />}
              onClick={() => toggleDeleteModal(_id)}
              tone='critical'
            />
          </ButtonGroup>
        </IndexTable.Cell>

      </IndexTable.Row>
    )
  );

  return (
    <Box width='80%' >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Text variant="headingXl" as="h3">
          Alternative Discount Types
        </Text>
      </div>

      <div className='table' style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px', marginRight: '10px' }}>
          <ButtonGroup>
            <Button variant="primary" onClick={handleCreateDiscount}>Add New Discount</Button>
          </ButtonGroup>
        </div>

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
              itemCount={discountTypesData.length}
              // condensed={useBreakpoints().smDown}
              headings={[
                { title: 'Discount Title' },
                { title: 'Discount Type' },
                { title: 'Discount Value' },
                { title: 'Action' },

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
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
      <DeleteModal
        isDeleting={isDeleting}
        setDeleting={setDeleting}
        toggleDeleteModal={toggleDeleteModal}
        handleDeleteDiscount={handleDeleteDiscount}
      />
    </Box>
  );
}

