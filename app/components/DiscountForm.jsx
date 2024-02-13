import React, { useCallback, useEffect, useState } from 'react'
import { TextField, Button, ButtonGroup, FormLayout, Box, Text, Select } from '@shopify/polaris';
import { showToast } from './Toast';


export default function DiscountForm({ setSelected, updateData, setUpdateData }) {

  const [discountTitle, setDiscountTitle] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  const [discountValue, setDiscountValue] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [selectedOfferType, setSelectedOfferType] = useState('');
  const [selectedDiscountMethod, setSelectedDiscountMethod] = useState('');


  const onChangeChooseCollection = async () => {
    const selected = await shopify.resourcePicker({ type: 'collection' });
    console.log('selected setSelectedCollection.............', selected);
    setSelectedCollection(selected[0].id)

    return selected
  }

  useEffect(() => {
    // console.log('updateData', updateData)
    if (updateData) {
      setDiscountTitle(updateData[0].discountTitle);
      setSelectedCollection(updateData[0].selectedCollection);
      setDiscountValue(updateData[0].discountValue);
      setSelectedOfferType(updateData[0].offerType)
      setSelectedDiscountMethod(updateData[0].discountMethod)
    }
  }, [updateData])

  const offerTypeoptions = [
    { label: 'Percentage OFF', value: 'Percentage OFF' },
    { label: 'Fixed Amount OFF', value: 'Fixed Amount OFF' },
  ];

  const discountMethodOptions = [
    { label: 'Automatic', value: 'Automatic' },
    { label: 'Manual', value: 'Manual' },
  ];

  const handleSelectOfferTypeChange = useCallback(
    (value) => setSelectedOfferType(value),
    [],
  );

  const handleSelectDiscountMethodChange = useCallback(
    (value) => setSelectedDiscountMethod(value),
    [],
  );


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !discountTitle.trim() || !selectedCollection.trim()
      || discountValue.length === 0
      || !selectedOfferType.trim() || !selectedDiscountMethod.trim()
    ) {
      return showToast('Please fill all the fields.')
    }
    const dataObject = {
      discountTitle,
      selectedCollection,
      discountValue,
      offerType: selectedOfferType,
      discountMethod: selectedDiscountMethod
    }
    try {
      setLoading(true)
      // console.log('dataObject with id', {...dataObject, _id: updateData[0]._id});
      // console.log('updateData', updateData);


      const response = await fetch(`/api/${updateData ? 'updateDiscount' : 'saveDiscount'}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateData ? JSON.stringify({ ...dataObject, _id: updateData[0]._id }) : JSON.stringify(dataObject)
      })
      if (response.status >= 200 && response.status <= 299) {
        const jsonData = await response.json()
        setLoading(false)
        showToast(updateData ? 'Successfully updated!' : 'Successfully saved!')
        // console.log('jsonData for update and save', jsonData)
        setDiscountTitle('');
        setSelectedCollection('');
        setDiscountValue('');
        setSelectedOfferType('')
        setSelectedDiscountMethod('')
        setTimeout(() => {
          setSelected(0)
        }, 2000)
        updateData && setUpdateData(null)
      }
    } catch (error) {
      console.log('error', error);
    }

  }


  return (
    <Box>
      <FormLayout>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
            <TextField
              label="Discount Code Title"
              value={discountTitle}
              onChange={(e) => setDiscountTitle(e)}
              required
              size='md'
            />
          </div>

          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
            <TextField
              label="Choose Collection for discount"
              placeholder='Please select a collection from button below.'
              value={selectedCollection}
              required
            />
            <div style={{ paddingTop: '5px' }}>
              <Button onClick={onChangeChooseCollection}>Select collection</Button>
            </div>
          </div>

          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
            <Select
              label="Discount Type"
              placeholder='Please select a discount type'
              options={offerTypeoptions}
              onChange={handleSelectOfferTypeChange}
              value={selectedOfferType}
            />
          </div>

          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
            <TextField
              label="Discount Value"
              type="number"
              value={discountValue}
              onChange={(value) => setDiscountValue(value)}
              required
              pattern={'^[1-9][0-9]*$'}
            />
          </div>

          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
            <Select
              label="Discount Method"
              placeholder='Please select a discount method'
              options={discountMethodOptions}
              onChange={handleSelectDiscountMethodChange}
              value={selectedDiscountMethod}
            />
          </div>

          <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>

          </div>
        </div>


        <ButtonGroup>
          <Button variant="primary" loading={isLoading} onClick={handleSubmit}>{updateData ? "Update Discount" : "Add Discount"}</Button>
        </ButtonGroup>
      </FormLayout>


    </Box>

  )
}
