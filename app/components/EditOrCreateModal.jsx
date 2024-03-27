import { Modal, TextField, ButtonGroup, FormLayout, Box, Select } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { showToast } from './Toast';


export default function EditOrCreateModal({ isActive, setActive, updateData, setUpdateData, type }) {



  const [discountTitle, setDiscountTitle] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountValueType, setDiscountValueType] = useState('');
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    // console.log('updateData', updateData)
    if (updateData) {

      if (type === 'alternativeDiscounts') {
        setDiscountTitle(updateData[0].discountTitle);
        setDiscountValueType(updateData[0].discountValueType);
        setDiscountValue(updateData[0].discountValue);
      } else {
        setDiscountTitle(updateData[0].discountTitle);
        setDiscountValue(updateData[0].discountValue);
      }

    }
  }, [updateData])

  const DiscountTypes = [
    { label: 'FIXED_AMOUNT', value: 'FIXED_AMOUNT' },
    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
  ];


  function checkDecimal(value) {
    //check contains more than 2 number after decimal
    var decimalPattern = /^\d+\.\d{3,}$/;

    if (decimalPattern.test(value)) {
      return true;
    } else {
      return false;
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discountTitle.trim() || discountValue.length === 0 || (type === 'alternativeDiscounts' && !discountValueType.trim())) {
      showToast('Please fill all the fields.');
    } else {

      if (checkDecimal(discountValue)) {
        return showToast('Discount value cannot contain more than 2 digit after decimal.');
      }

      if (discountValueType === 'PERCENTAGE' && discountValue > 100) {
        return showToast('Discount percentage value cannot be greater than 100%.');
      }


      const dataObject = {
        discountTitle,
        discountValue,
        ...(type === 'alternativeDiscounts' ? { discountValueType } : {})
      };


      try {
        setLoading(true);
        const response = await fetch(`/api/${updateData ? 'updateDiscount' : 'saveDiscount'}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: updateData
            ? JSON.stringify({
              ...dataObject,
              _id: updateData[0]._id,
              ...(type === 'alternativeDiscounts' ? { type: 'alternativeDiscounts' } : { type: 'evenItemsDiscount' })
            })
            : JSON.stringify({
              ...dataObject,
              ...(type === 'alternativeDiscounts' ? { type: 'alternativeDiscounts' } : { type: 'evenItemsDiscount' })
            }),
        });

        if (response.ok) {
          const jsonData = await response.json();
          setLoading(false);
          showToast(updateData ? 'Successfully updated!' : 'Successfully saved!');
          setDiscountTitle('');
          setDiscountValue('');
          setDiscountValueType('');
          setTimeout(() => {
            setActive(false);
          }, 1000);
          updateData && setUpdateData(null);
        } else {
          setLoading(false);
          showToast('Something went wrong!');
          setTimeout(() => {
            setActive(false);
          }, 1000);
          throw new Error(`Failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  const handleChange = useCallback(() => {
    setDiscountTitle('')
    setDiscountValue('')
    setDiscountValueType('')
    setUpdateData(null)
    setActive(!isActive)
  }, [isActive]);


  return (
    <Modal
      open={isActive}
      onClose={handleChange}
      title={updateData ? 'Update Discount' : "Add Discount"}
      primaryAction={{
        loading: isLoading,
        content: 'Save',
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
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

              {type === 'alternativeDiscounts' && <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
                <Select
                  label="Discount Type"
                  placeholder='Select Discount Type'
                  options={DiscountTypes}
                  onChange={(value) => setDiscountValueType(value)}
                  value={discountValueType}
                />
              </div>}

              <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
                <TextField
                  label={type === 'alternativeDiscounts' ? "Discount Value" : "Discount Percentage Value"}
                  type="number"
                  value={discountValue}
                  onChange={(value) => setDiscountValue(value)}
                  required
                  pattern={'^[1-9][0-9]*$'}
                />
              </div>

              <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>

              </div>
            </div>
          </FormLayout>

        </Box>
      </Modal.Section>
    </Modal>
  );
}