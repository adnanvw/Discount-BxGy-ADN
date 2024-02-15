import { Modal, TextField, ButtonGroup, FormLayout, Box, } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { showToast } from './Toast';


export default function EditOrCreateModal({ isActive, setActive, updateData, setUpdateData }) {

  const handleChange = useCallback(() => setActive(!isActive), [isActive]);

  const [discountTitle, setDiscountTitle] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    // console.log('updateData', updateData)
    if (updateData) {
      setDiscountTitle(updateData[0].discountTitle);
      setDiscountValue(updateData[0].discountValue);
    }
  }, [updateData])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discountTitle.trim() || discountValue.length === 0) {
      showToast('Please fill all the fields.');
    } else {
      const dataObject = {
        discountTitle,
        discountValue,
      };

      try {
        setLoading(true);

        const response = await fetch(`/api/${updateData ? 'updateDiscount' : 'saveDiscount'}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: updateData ? JSON.stringify({ ...dataObject, _id: updateData[0]._id }) : JSON.stringify(dataObject),
        });

        if (response.ok) {
          const jsonData = await response.json();
          setLoading(false);
          showToast(updateData ? 'Successfully updated!' : 'Successfully saved!');
          setDiscountTitle('');
          setDiscountValue('');
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


  return (
    <Modal
      open={isActive}
      onClose={handleChange}
      title={updateData ? 'Update Discount' : "Create Discount"}
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

              <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
                <TextField
                  label="Discount Percentage Value"
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