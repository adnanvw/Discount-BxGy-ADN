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


export default function DiscountTable({ setSelected, setUpdateData }) {
  const [isDeleting, setDeleting] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  const [discountData, setDiscountData] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const getDiscountData = async () => {
      try {
        const response = await fetch('/api/getDiscounts', {
          method: "GET",
        });

        if (response.ok) {
          const jsonData = await response.json();
          const { gotDiscount } = jsonData;
          console.log('jsonData from getDiscounts', gotDiscount);
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

    getDiscountData();
  }, []);


  const handleCreateDiscount = () => {
    setSelected(1)
  }

  const handleEditDiscount = (id) => {
    // console.log(`Editing discount with ID ${id}`);
    const dataForUpdate = discountData.filter(dD => dD._id === id)
    // console.log(`dataForUpdate..................... ${dataForUpdate}`);

    setSelected(1)
    setUpdateData(dataForUpdate)
  };

  const handleDeleteDiscount = async () => {
    console.log(`Deleting discount with ID ${deleteID}`);
    const dataForDelete = discountData.filter(dD => dD._id === deleteID)

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


  const rowMarkup = discountData.map(
    ({
      _id,
      discountTitle,
      offerType,
      discountValue,
      discountMethod,
      selectedCollection,
    }) => (
      <IndexTable.Row
        id={_id}
        key={_id}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {discountTitle}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{offerType}</IndexTable.Cell>
        <IndexTable.Cell>{discountValue}</IndexTable.Cell>
        <IndexTable.Cell>{discountMethod}</IndexTable.Cell>
        <IndexTable.Cell>{selectedCollection}</IndexTable.Cell>
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
    <Box>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px', marginRight: '10px' }}>
        <ButtonGroup>
          <Button variant="primary" onClick={handleCreateDiscount}>Create Discount</Button>
        </ButtonGroup>
      </div>

      {isLoading ?
        <Box paddingBlockStart="200">
          <SkeletonBodyText
            lines={6}
          />
        </Box>
        :
        <LegacyCard>
          <IndexTable
            itemCount={discountData.length}
            // condensed={useBreakpoints().smDown}
            headings={[
              { title: 'Discount Title' },
              { title: 'Discount Type' },
              { title: 'Discount Value' },
              { title: 'Discount Method' },
              { title: 'Selected Collection' },
              { title: 'Action' },

            ]}
            // pagination={{
            //   hasNext: true,
            //   onNext: () => { },
            // }}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      }
      <DeleteModal
        isDeleting={isDeleting}
        setDeleting={setDeleting}
        toggleDeleteModal={toggleDeleteModal}
        handleDeleteDiscount={handleDeleteDiscount}
      />
    </Box>

  );
}

